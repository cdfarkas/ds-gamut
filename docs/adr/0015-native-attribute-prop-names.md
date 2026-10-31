# ADR 0015 — Prop names that collide with native HTML attributes

## Status

Accepted (2026-10-31).

## Context

A native HTML attribute name, reused as an Omnia prop with different values, is a collision. The
live example is `size`. On a native `<input>`, `size` is a number of characters. On Omnia's `Input`
it is `'sm' | 'md' | 'lg'`, so `Input` must `Omit` the native key from `InputHTMLAttributes` and the
native attribute can no longer be reached (the destructured `size` never lands in `...rest`).

The owner asked whether major design systems follow a similar logic and what Omnia's rule should be.
At the owner's previous company, the in-house DS prefixed such props (`variantSize`). The package is
unpublished (`"private": true`, version `0.1.0`), so a rename is still free today. It stops being
free at the first release.

### What Omnia has today

Checked in `src/components/**/*.tsx` (not stories or tests) against `@types/react` 19.3.0 in
`node_modules`.

| Component | Prop                          | Native name exists on                                                                                     | Omnia values                              | Verdict                                                                |
| --------- | ----------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `Input`   | `size`                        | `<input>` (`size?: number`), also `<select>`                                                              | `'sm' \| 'md' \| 'lg'`                    | **Collision.** `Omit`ted from the native type.                         |
| `Input`   | `type`                        | `<input>`                                                                                                 | `text email url tel password` (a subset)  | Not a collision: native values, narrowed. Re-declared after an `Omit`. |
| `Input`   | `disabled`, `readOnly`        | `<input>`                                                                                                 | boolean, native meaning                   | Not a collision.                                                       |
| `Input`   | `prefix` (omitted, no prop)   | `HTMLAttributes` (`prefix?: string`, RDFa)                                                                | none: the key is only removed from the type | Not a collision; frees the word. Nothing re-declares it.             |
| `Input`   | `className`, `style`, `ref`   | every element                                                                                             | native meaning, but `className` and `style` land on the wrapper, `ref` on the `<input>` | Same name and meaning, different target. Out of scope here, documented in the TSDoc. |
| `Input`   | `invalid`, `startAdornment`, `endAdornment` | none (`aria-invalid` is the ARIA name)                                                      | boolean, `ReactNode`                      | No native name.                                                        |
| `Button`  | `size`                        | not on `<button>`. `size?: number` is on `AllHTMLAttributes`, `InputHTMLAttributes`, `SelectHTMLAttributes` only | `'sm' \| 'md' \| 'lg'`          | **No collision on the element it renders.** Needs no `Omit`.           |
| `Button`  | `loading`                     | `<img>` and `<iframe>` (`'eager' \| 'lazy'`), not `<button>`                                             | boolean                                   | No collision on `<button>`. Same word, other element.                  |
| `Button`  | `intent`                      | none                                                                                                      | `Intent`                                  | No native name.                                                        |
| `Badge`   | `intent`                      | none                                                                                                      | `Intent`                                  | No native name.                                                        |

So today there is one real collision (`Input.size`) and one same-word-other-element case
(`Button.size`, `Button.loading`). `size` has one meaning across Omnia atoms: the `sm | md | lg`
scale, mirrored as `data-size` (ADR 0010).

### What is coming

From `docs/naming/checkbox.md` and the element it will render (`<input type="checkbox">`):

- `size`: the same collision as `Input`. `InputHTMLAttributes` types `size?: number` for every input
  type, even though MDN says the attribute applies only to `email`, `password`, `tel`, `url` and
  `text` (S28). The TypeScript collision exists even where the HTML one does not.
- `label`: not on `<input>` in React's types. It exists on `<option>`, `<optgroup>` and `<track>`
  (`string`). Same word, other element, as `Button.loading`.
- `indeterminate`: an IDL property of `HTMLInputElement`, not an attribute, and absent from React's
  types (S28). Boolean, same meaning as native. Not a collision.
- `checked`: native boolean. If Omnia took the Radix shape (`checked: boolean | 'indeterminate'`),
  it would become a collision with custom values. The naming study's shared base keeps a separate
  `indeterminate` boolean, so it does not.
- `Switch`: the same `size`, and `checked` from the native input.

### Forces

- The native `size` is of little use. CSS `width` takes precedence over it (S28), and Omnia's
  `Input` fills its container.
- `Omit` is cheap in TypeScript, but it is silent at runtime: an untyped caller passing `size={20}`
  gets no error. `sizeClass[20]` is `undefined`, the class list drops it, and `data-size="20"` is
  rendered.
- Any object typed `InputHTMLAttributes` that is spread into Omnia's `Input` stops compiling. Checked
  with `tsc` on a minimal copy of the pattern (`Omit<InputHTMLAttributes, 'size'>` plus
  `size?: 'sm' | 'md' | 'lg'`): spreading a `InputHTMLAttributes` value fails with "Type 'number' is
  not assignable to type '"sm" | "md" | "lg"'".
- React Hook Form's `register(name)` returns `ref`, `name`, `onChange`, `onBlur`, plus `disabled`
  when that option is set and `min`, `max`, `maxLength`, `minLength`, `pattern`, `required` in
  progressive mode (S27). No key is `size`, so every option below behaves the same under
  `register`. What matters there is that `ref` and `...rest` reach the native input, which `Input`
  already does.

## Survey

Date: 2026-10-31. Method: official docs or the system's own source file, opened this session through
a fetch tool that summarises each page; quotes are short and cell values are as that summary
reported them. "None documented" means the pages opened do not mention it, not that the system lacks
it. "Not verified" means no usable page was opened. The text input is the reference component.

| System           | DS size prop on the text input                       | How the native `size` stays reachable                                                       | Pattern | Src     |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------- | ------- |
| MUI              | `size`: `'small' \| 'medium'`                        | `inputProps`: "Attributes applied to the `input` element". `size` through it is not confirmed | Shadow  | S1      |
| Chakra UI v3     | `size`: `2xs` to `2xl`                               | **`htmlSize`** — system-wide: the styled factory maps `htmlSize`/`htmlWidth`/`htmlHeight`/`htmlTranslate` to the native attribute (source; the docs page opened does not mention it) | Rename  | S2, S29 |
| Chakra UI v2     | `size`: `xs`, `sm`, `md`, `lg`                       | **`htmlSize`**: "use the native DOM `size` attribute you can use the `htmlSize` prop"       | Rename  | S3      |
| Mantine          | `size`: `MantineSize`                                | **`inputSize`**, documented in the source as the "HTML `size` attribute for the input element". A discussion answer once said it was "not currently possible" (date not checked) | Rename  | S4      |
| Ant Design       | `size`: `large`, `medium`, `small`                   | None documented. The source declares its own `size?: SizeType`, with no `Omit` of the native key | Shadow  | S5      |
| Fluent UI v9     | `size`: `small`, `medium`, `large`                   | None, on purpose. The spec calls the native one not "very useful in practice"; the types file says `htmlSize` could be added if someone needs it | Shadow, rename deferred | S6      |
| GitHub Primer    | `size`: `small`, `medium`, `large`                   | None documented. The source destructures `size`, so it never reaches the `<input>`; no `htmlSize` | Shadow  | S7      |
| IBM Carbon       | `size`: `xs`, `sm`, `md`, `lg`                       | None. The source lists `'size'` in `ExcludedAttributes` and `Omit`s it                      | Shadow (explicit `Omit`) | S8 |
| Adobe Spectrum   | no `size` prop; `width`, `height` style props        | None documented                                                                             | Avoids the word | S9  |
| Shopify Polaris  | no `size` prop on `s-text-field`; `maxLength`, `minLength` | None documented. The page does not discuss overlaps with native names               | Avoids the word | S10 |
| Atlassian        | no `size` prop; `isCompact`, `width`                 | None documented. Also: "`disabled` isn't supported", use `isDisabled`                        | Avoids the word; prefixes booleans with `is` | S11 |
| Radix Themes     | `size`: `"1"`, `"2"`, `"3"`                          | None documented                                                                             | Shadow  | S12     |
| GOV.UK           | no prop; width classes `govuk-input--width-N`        | None documented                                                                             | Avoids the word | S13 |
| Braid (SEEK)     | no size or width prop on `TextField`                 | None documented. "Braid components are very explicit about the properties they accept"      | Avoids the word | S14 |
| Twilio Paste     | `size` typed `never`                                 | Blocked: `size`, `height`, `width` and `style` are all re-declared as `never` in the source | Shadow (blocks it with `never`) | S15 |
| Salesforce Lightning | SLDS blueprint page: no size variants mentioned | None documented. The LWC `lightning-input` reference returned HTTP 403                      | Not verified | S16 |
| Shoelace         | `size`: `small`, `medium`, `large`                   | None: the properties table has no native `size` mirror, though it mirrors `maxlength`, `pattern`, `inputmode`, and others | Shadow (custom element) | S17 |
| Web Awesome      | `size`: `xs`, `s`, `m`, `l`, `xl`                    | None documented                                                                             | Shadow (custom element) | S18 |
| React-Bootstrap  | `size`: `'sm' \| 'lg'`                               | **`htmlSize`**: "The size attribute of the underlying HTML element."                         | Rename  | S19     |
| iTwinUI (Bentley) | `size` (values not read)                            | **`htmlSize`**, added in a PR: "handles the native `size` attribute in `<input>`"           | Rename  | S20     |

Counts, over the 20 rows above (16 required systems plus Chakra v2, React-Bootstrap, iTwinUI and
Web Awesome):

- **Rename the native one** (`htmlSize` or `inputSize`): Chakra v2, Chakra v3, Mantine, React-Bootstrap, iTwinUI.
  Five. Chakra v3 keeps it as a system-wide convention in its styled factory, not only on Input.
- **Shadow the native one with the DS meaning and expose no way back**: MUI (partly, via
  `inputProps`), Ant, Fluent, Primer, Carbon, Radix Themes, Paste, Shoelace, Web Awesome.
  Nine. Fluent and Paste do it deliberately and say why or enforce it; Carbon `Omit`s it in source.
- **Avoid `size` on the text input altogether**: Spectrum, Polaris, Atlassian, GOV.UK, Braid. Five.
- **Prefix the DS prop** (`variantSize` style): **none found** in the systems above.
- Not verified: Lightning's LWC reference.

The prefix pattern the owner knew was not found as a size convention anywhere in the survey. The
nearest relatives are different problems:

| Source                          | What it shows                                                                                                                 | Src |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --- |
| Fluent UI charting contrib      | A section titled "Avoid re-declaring properties from native element attributes"; also says common HTML names may "confuse callers" | S21 |
| Dialtone (Dialpad)              | A PR renamed `title` to `headerText`, `titleId` to `headerId` "to avoid HTML attribute name collisions". Renames, no prefix   | S22 |
| Nord Health                     | For Web Component properties, avoid names that clash with standardised members (`title`, `hidden`); size goes through a `size` property | S23 |
| Lea Verou, HTML syntax guidelines | "Re-use existing names for the same concepts when possible." The inverse rule (avoid a name with another meaning) is not on the page | S24 |
| Maersk Design System            | A web search summary said Maersk replaced `size` with `fit` because of the native input `size`. The two Maersk pages that would confirm it returned 404, so this is **Not verified** | S25 |
| Bolt Design System              | A search summary said Bolt considered prefixing and kept its names. The wiki page returned 404: **Not verified**               | S26 |

Notes on the survey:

- React-bound systems cluster on `Omit` (explicit in Carbon, enforced by `never` in Paste).
  Custom-element systems (Shoelace, Web Awesome) have the collision at the attribute level, but their
  host is not an `<input>`: the native control is internal, so the native `size` was simply never
  exposed. Neither documents a way to reach it.
- Where a rename exists, it is a **second prop for the native attribute** (`htmlSize`, `inputSize`),
  never a rename of the DS prop. Four of five use the same word, `htmlSize`.
- Fluent is the clearest statement of the trade: the native attribute is not exposed because it is
  not "very useful in practice", and the escape hatch is named in advance.
- Chakra v2 notes that `htmlSize` only works as expected with `width` set to `auto`. The same trap
  applies to Omnia's full-width `Input`.

## Options

Costs are for Omnia as it is on this branch. Changed files below are counted from the source tree:
the prop is referenced in 13 files under `src/components` (`Input` and `Button`: component, stories, tests, MDX, CSS, index),
plus `docs/overrides.md` and ADR 0010.

### A. Keep shadowing with `Omit`, and document it

`size` keeps the Omnia meaning. The native key is removed from the type. No way to set the native
attribute.

- Today's components: no change. `Input` already does this. `Button` and `Badge` need nothing.
- `data-size`: unchanged. Prop and attribute have the same name, as ADR 0010 expects.
- TypeScript: one `Omit<…, 'size'>` per component that renders a native element with `size`
  (`Input`, `Checkbox`, `Switch`). A caller holding an `InputHTMLAttributes` value cannot spread it
  into `Input` (checked with `tsc`).
- `...rest`: native `size` cannot be passed. A numeric `size` in untyped code is silently turned
  into a missing class and `data-size="20"`.
- React Hook Form: no effect (S27).
- Market fit: nine of the twenty rows (S1, S5 to S8, S12, S15, S17, S18).

### B. Prefix the custom props (`variantSize`, …)

The DS prop becomes `variantSize` (or `controlSize`, `intentSize`), and `size` stays native.

- Today's components: rename in `Input` and `Button` (they share the scale), their stories, tests and
  MDX: the 13 files above. Free now, a breaking change after release.
- `data-size`: either the attribute keeps `size` and diverges from the prop name (breaks the "prop
  reflects as `data-*`" habit in ADR 0010), or it is renamed to `data-variant-size` and breaks the
  documented selector contract in `docs/overrides.md`. Either way ADR 0010 needs a follow-up.
- TypeScript: **no `Omit` needed.** The native `size?: number` stays in the type, so an
  `InputHTMLAttributes` value spreads in cleanly.
- `...rest`: a native `size={20}` passes through and works.
- Naming: `variantSize` implies a `variant` concept, but Omnia uses `intent`. The prefix needs its own
  word, which is the very thing the rule is trying not to invent.
- React Hook Form: no effect (S27).
- Market fit: none of the twenty rows. Every consumer who knows another DS will type `size`.

### C. Keep `size` for the DS and expose the native one renamed (`htmlSize`)

Option A plus a second prop `htmlSize?: number` mapped to the `<input>`'s `size`.

- Today's components: add one prop to `Input` and its mapping (`size={htmlSize}` on the `<input>`),
  a test, and a line in the MDX. `Button` and `Badge` unchanged. Can be added later without a break.
- `data-size`: unchanged.
- TypeScript: the same `Omit` as A, plus the new prop. Still no spreading of `InputHTMLAttributes`.
- `...rest`: native `size` is reachable under another name, so it is not lost, but it is not
  drop-in. Needs `width: auto` to show an effect on a full-width input (S3).
- React Hook Form: no effect (S27).
- Market fit: five of twenty rows (S2, S3, S4, S19, S20); four use the same word `htmlSize`.

### D. A different non-native word (`scale`, `density`, `fit`, …)

The DS prop gets a name no native element uses.

- Today's components: rename as in B (the 13 files); same cost profile, same break after release.
- `data-size`: same dilemma as B.
- TypeScript: **no `Omit` needed**, as in B.
- `...rest`: native `size` passes through, as in B.
- Word choice is not free. In React's types `scale?: number | string` exists on `SVGAttributes`.
  `density` is not in `@types/react` 19.3.0 (searched). `fit` is not either, but Maersk's use of it is
  Not verified (S25).
- Market fit: none verified. Atlassian's `isCompact` is a boolean, not a scale, and shows that a
  system can avoid the word by using a different shape (S11).

### Other shapes the survey shows

- **E. Do not offer a scale prop on `Input`.** Spectrum, Polaris, Atlassian, GOV.UK and Braid avoid
  the word by exposing width or a boolean. It sidesteps the problem and loses the `sm | md | lg`
  vocabulary that `Button` and the naming studies share, so it is listed for completeness only.
- **F. Block the native one with `never`** (Paste, S15). It makes the loss explicit at compile time
  and gives a readable error; it is A with a better message.

## Recommendation

Not decided. This section is my reading, written so that it can be attacked.

**Take option A as the rule, with C as a pre-named escape.** Concretely:

1. A prop may reuse a native attribute name only if it keeps the native meaning (narrowing the
   values is fine: `Input.type`).
2. Where the Omnia meaning differs, the component keeps the market word, `Omit`s the native key,
   and says so in its MDX ("the native `size` is not exposed").
3. The collision is judged against the element that receives `...rest`. `Button.size` and
   `Button.loading` are not collisions (the word is native only on other elements). Consistency
   stays with the DS vocabulary: `size` always means the `sm | md | lg` scale.
4. The native attribute is exposed only when a real use appears, and then as `html<Name>`
   (`htmlSize`), the name four of the five systems that did it chose. Chakra applies that `html*`
   prefix as one rule to every native attribute a DS prop shadows, which is the inverse of prefixing
   the DS prop (`variantSize`, item 5).
5. A prefix on the DS prop (`variantSize`) is not used.

Why: the native `size` is of little use (CSS width wins, S28; Fluent says so, S6), Omnia is not
published, no surveyed system prefixes the DS prop, and A needs zero code change.

### Against itself

- **The owner's rule is stricter than A.** "No prop reuses a native attribute name with custom
  values" is violated by `Input.size` under A, knowingly. If the owner means the rule literally, A
  fails it and the real choice is B or D. This ADR should not hide that.
- **The market norm may be a copying norm.** Nine of twenty shadow, but most are React libraries that
  inherit the same `Omit` habit, and four ecosystems later added an escape hatch (S2, S3, S4, S19, S20).
  Users do ask: a Mantine discussion asked for it (S4). That is evidence that the loss is felt, not
  only that it is harmless.
- **B and D are the only options with no `Omit`.** They keep Omnia's prop types assignable from
  `InputHTMLAttributes`, which A and C break (verified with `tsc`). For a DS that sells "native
  props pass through", that is a real structural advantage that the survey count does not weigh.
- **Runtime silence.** Under A, `size={20}` from untyped code or a loose spread is dropped without a
  warning. A and C could add a dev-only check, but that is code that B and D do not need.
- **The previous company chose B for a reason I do not know.** It may have been a polymorphic `as`
  prop, a generic wrapper, or a codegen step where `Omit` did not compose. Ask before dismissing it.
- **The `htmlSize` escape is YAGNI that may not pay.** If the first consumer asks for it, the cost is
  one prop. If the name later collides with something, it is one more API to keep.
- **Two element-dependent verdicts make the rule fuzzy.** `Button.size` is fine and `Input.size` is
  not, by the element. A reader must know React's types to apply the rule. A future `Select` (the
  native `size` there is a visible row count) would need the same `Omit`, which makes the exception
  three components wide, not one.
- **Not checked:** how often real consumers hold an `InputHTMLAttributes` value to spread. The
  strength of the TypeScript objection depends on that and I did not measure it.

### What the owner chose

The owner chose option B's variant prefix for colliding names, not A. The reason is integrator
predictability: an integrator must never have to wonder whether a prop is native. That rules out
judging a collision by the element that receives `...rest` (item 3 above), so the native set is every
HTML element, not only the rendered one. It also rules out an `Omit` that silently hides a native
key. The market fact stands: no surveyed system prefixes the DS prop; Omnia departs from it on
purpose and accepts teaching one new word.

## Decision

"Native names" are every attribute and prop name of any HTML element in React's types: the global
`HTMLAttributes`, ARIA, DOM handlers, and every element-specific attribute (`size`, `label`,
`loading`, `type`, `width`, …). SVG-only names are out of scope.

1. A component prop whose name is native keeps its native type and meaning and reaches the native
   element. A narrower subset of the native values is allowed (`Input.type` stays limited to
   `text | email | url | tel | password`).
2. A visual variant axis whose name is native is named `variant<Axis>`: `size` becomes
   `variantSize`. A variant axis whose name is not native keeps it: `intent` stays.
3. A non-variant custom prop whose name is native gets a non-native name: `Button.loading` becomes
   `pending`. `pending` is not a React native prop, and it pairs with React 19's
   `useFormStatus().pending`.
4. `data-*` attributes are the styling contract (ADR 0010) and do not change: `data-size`,
   `data-loading`, `data-intent` keep their names.
5. A type-level gate enforces the rule on every exported component, now and in future.

## Consequences

- `Input.size` and `Button.size` are now `variantSize`; `Button.loading` is now `pending`. The
  exported types `ButtonSize` and `InputSize` keep their names. Stories, tests, MDX, the override demo
  in `docs/overrides.md`, and the status lines of ADR 0009 and ADR 0010 follow.
- `Input` no longer `Omit`s `size` or `prefix`, so both reach the `<input>`, and an
  `InputHTMLAttributes` value spreads into it. Only `type` is still re-declared, narrowed.
- `data-size` and `data-loading` keep their names, so a prop and its `data-*` hook no longer always
  share a name. The override contract in each MDX says which prop each hook reflects.
- `src/native-prop-names.check.ts` derives the native names and their types from React's
  `JSX.IntrinsicElements` restricted to `HTMLElementTagNameMap`, maps every PascalCase function
  exported from `src/index.ts` to its props, and fails `pnpm typecheck` when a native-named prop's
  type is not assignable to the native one. A new component is checked without registration. It
  cannot check rule 1's "reaches the native element"; tests and review still own that.
- The gate is not imported by `src/index.ts` or `src/bundle.ts`, so it is not in `dist`, and its
  name does not match vitest's `*.test.*` pattern.
- The naming study for each new component checks its proposed prop names against this rule
  (`CLAUDE.md`). Checkbox and Switch will take `variantSize`, and a Checkbox `label` prop would have
  to be a `string` or be renamed.
- The package is unpublished, so the rename breaks no consumer. The new word `variantSize` has to be
  taught, since no surveyed system uses it.

## Sources

Opened on 2026-10-31 unless noted. Pages that returned an error are listed where relevant.

- S1 MUI: https://mui.com/material-ui/api/input-base/ ,
  https://raw.githubusercontent.com/mui/material-ui/master/packages/mui-material/src/InputBase/InputBase.d.ts
- S2 Chakra UI v3: https://chakra-ui.com/docs/components/input ,
  https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/packages/react/src/components/input/input.tsx
- S3 Chakra UI v2: https://v2.chakra-ui.com/docs/components/input
- S4 Mantine: https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/core/src/components/Input/Input.tsx ,
  https://mantine.dev/core/input/ (props table not in the fetched text),
  https://github.com/orgs/mantinedev/discussions/6269
- S5 Ant Design: https://ant.design/components/input ,
  https://raw.githubusercontent.com/ant-design/ant-design/master/components/input/Input.tsx
- S6 Fluent UI v9: https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-input/library/docs/Spec.md ,
  https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-input/library/src/components/Input/Input.types.ts
- S7 GitHub Primer: https://primer.style/product/components/text-input/ ,
  https://raw.githubusercontent.com/primer/react/main/packages/react/src/TextInput/TextInput.tsx
- S8 IBM Carbon: https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/TextInput/TextInput.tsx
- S9 Adobe React Spectrum: https://react-spectrum.adobe.com/react-spectrum/TextField.html
- S10 Shopify Polaris web components: https://shopify.dev/docs/api/app-home/polaris-web-components/forms/textfield
- S11 Atlassian: https://atlassian.design/components/textfield/code
- S12 Radix Themes: https://www.radix-ui.com/themes/docs/components/text-field
- S13 GOV.UK: https://design-system.service.gov.uk/components/text-input/
- S14 Braid (SEEK): https://seek-oss.github.io/braid-design-system/components/TextField/ ,
  https://seek-oss.github.io/braid-design-system/components/TextField/props
- S15 Twilio Paste: https://raw.githubusercontent.com/twilio-labs/paste/main/packages/paste-core/components/input/src/Input.tsx
  (the docs URL `https://paste.twilio.design/components/input` redirected to GitHub; `types.ts` returned 404)
- S16 Salesforce Lightning: https://v1.lightningdesignsystem.com/components/input/ ;
  https://developer.salesforce.com/docs/component-library/bundle/lightning-input/documentation returned 403
- S17 Shoelace: https://shoelace.style/components/input
- S18 Web Awesome: https://webawesome.com/docs/components/input/
- S19 React-Bootstrap: https://raw.githubusercontent.com/react-bootstrap/react-bootstrap/master/src/FormControl.tsx
- S20 iTwinUI: https://github.com/iTwin/iTwinUI/pull/1419
- S21 Fluent UI charting contrib: https://microsoft.github.io/fluentui-charting-contrib/docs/Implementation%20Best%20Practices
- S22 Dialtone: https://github.com/dialpad/dialtone/pull/1204
- S23 Nord Health: https://nordhealth.design/raw/design/foundations/naming.md
- S24 Lea Verou, HTML syntax guidelines: https://github.com/LeaVerou/html-syntax-guidelines
- S25 Maersk (Not verified): https://designsystem.maersk.com/foundations/component-fit and
  https://designsystem.maersk.com/foundations/component-dna/ both returned 404; the claim comes from a
  web search summary only
- S26 Bolt (Not verified): https://github.com/boltdesignsystem/bolt/wiki/Prefixing-Custom-Attributes
  returned 404; the claim comes from a web search summary only
- S27 React Hook Form `register`: https://react-hook-form.com/docs/useform/register
- S28 MDN `<input>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#size
  (the last 9,636 characters of the page were not read)
- S29 Chakra UI v3 styled factory: https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/styled-system/use-resolved-props.ts ,
  https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/styled-system/factory.tsx
- Local: `node_modules/@types/react/index.d.ts`
  (version 19.3.0), `src/components/atoms/{Input,Button,Badge}/*.tsx`, `docs/naming/checkbox.md`,
  `docs/adr/0010-override-api.md`. A throwaway `tsc --noEmit` check of the spread case was run and
  deleted; it is not part of the repo.
