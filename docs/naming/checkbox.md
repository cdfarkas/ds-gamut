# Naming study — checkbox

Revised 2026-10-31 for ADR 0015 (native prop names) and ADR 0016 (form atoms are display only). The survey, patterns, accessibility notes and Sources below are the 2026-10-30 record and are unchanged; Options for Omnia and Recommendation are rewritten.

Date: 2026-10-30. Method: official docs opened during this study. "None documented" means the pages opened do not mention it, not that the system lacks it. "Not verified" means no usable page was opened. Page text was read through a fetch tool that summarises each page, so quotes are short and cell values are as reported by that summary. Where a source file (not a docs page) was read, the cell says so.

## Question

Omnia needs a checkbox atom. `Input` is already decided as a bare control with label, hint and error on a future `FormField` molecule, and `Switch` follows right after as a separate atom. Seven sub-questions:

- What is it called (`Checkbox`, `CheckBox`, plural, other), and is it one component or a bundle?
- Does the checkbox carry its own visible label, or stay bare and get its label from outside?
- How is the mixed state named and rendered?
- What are the state and change-handler props called?
- Is there a group component, and is it an atom or a molecule?
- Native `<input type="checkbox">` or `<button role="checkbox">`?
- How do size, invalid and disabled compare with what `Input` already uses?

## Survey

14 systems, 15 rows (Radix is split into Primitives and Themes). Apple HIG was not in the scope for this study.

### Table 1 — names and structure

| System          | (1) Name                                              | (2) Visible label lives in                                       | (3) Group                                                   | (4) Element                                                  | Src |
| --------------- | ----------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | --- |
| MUI             | `Checkbox`                                            | wrapper: `FormControlLabel` (`control`, `label`)                 | `FormGroup` (generic wrapper)                               | not named on the page                                        | S1  |
| Material (M3)   | Compose `Checkbox` + `TriStateCheckbox`; Android `MaterialCheckBox` (XML `<CheckBox>`) | Compose: none, a `Text` beside it in a `Row`    | none documented                                             | native Android view                                          | S2  |
| Ant Design      | `Checkbox`                                            | not documented as a prop (only a `label` style slot)             | `Checkbox.Group` (`options`, `value` array)                 | `input[type="checkbox"]` (named under the group `name`)      | S3  |
| Mantine         | `Checkbox` (+ `.Group`, `.Indicator`, `.Card`)        | inside: `label` prop (JSX allowed)                               | `Checkbox.Group` (`Input.Wrapper` props)                    | native `input[type="checkbox"]`                              | S4  |
| shadcn/ui       | `Checkbox`                                            | wrapper: `Field` + `FieldLabel`                                  | none: repeat `Field`                                        | not named; tabs for Base UI (default), React Aria, Radix     | S5  |
| Radix Primitives | `Checkbox.Root` + `Checkbox.Indicator`               | none documented                                                  | none documented                                             | `<button role="checkbox">` (source) + hidden input           | S6  |
| Radix Themes    | `Checkbox`                                            | wrapper: `Text as="label"` around it                             | `CheckboxGroup.Root` + `CheckboxGroup.Item`                 | inherits the primitive; not named                            | S7  |
| Chakra UI       | `Checkbox.Root` + `HiddenInput`, `Control`, `Indicator`, `Label` | inside: a `Checkbox.Label` part; single ones go in `Field.Root` | `CheckboxGroup`, inside `Fieldset.Root` + `Fieldset.Legend` | hidden input part (`HiddenInput`)                            | S8  |
| Adobe Spectrum  | `Checkbox`                                            | inside: `children` are the label                                 | `CheckboxGroup`                                             | React Aria: `<label>` + hidden input (CSS comment)           | S9  |
| IBM Carbon      | `Checkbox`                                            | inside: `labelText` (required), `hideLabel`                      | `CheckboxGroup` = `<fieldset>` + `<legend>` (`legendText`)  | `<input type="checkbox">` (source)                           | S10 |
| GitHub Primer   | `Checkbox`                                            | wrapper: `FormControl` + `FormControl.Label`                     | `CheckboxGroup` (fieldset legend)                           | native `<input type="checkbox">`                             | S11 |
| Atlassian       | `Checkbox`                                            | inside: `label` prop                                             | none documented                                             | not named                                                    | S12 |
| GOV.UK          | "Checkboxes" (plural, is the group)                   | inside: each item's `text`                                       | the component itself: `<fieldset>` + `<legend>`            | `<input type="checkbox">` + `<label for>`                    | S13 |
| Shopify Polaris | `s-checkbox`                                          | inside: `label` prop (children allowed)                          | none documented (`s-stack` layout)                          | not named                                                    | S14 |
| Fluent UI v9    | `Checkbox`                                            | inside: `label` prop (string, JSX or object)                     | none documented                                             | native `<input type="checkbox">`, opacity 0, over a `<span>` | S15 |

### Table 2 — props

| System          | Mixed state                                                | State and change                                        | Size                                     | Invalid                                         | Disabled           | Src |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- | ------------------ | --- |
| MUI             | `indeterminate` (+ `indeterminateIcon`)                    | `checked`, `defaultChecked`, `onChange`                 | `size="small"` only                      | an error example exists; prop not named         | `disabled`         | S1  |
| Material (M3)   | Compose: `TriStateCheckbox` + `ToggleableState`; Android: `checkedState` | Compose: `checked`, `onCheckedChange`     | none documented                          | Android: `errorShown`                           | Compose: `enabled` | S2  |
| Ant Design      | `indeterminate`                                            | `checked`, `defaultChecked`, `onChange(e)`              | none documented                          | none documented                                 | `disabled`         | S3  |
| Mantine         | `indeterminate` (ignores `checked`)                        | `checked`, `defaultChecked`, `onChange`                 | `xs` to `xl`                             | `error` (boolean or message)                    | `disabled`         | S4  |
| shadcn/ui       | not mentioned                                              | `checked`, `defaultChecked`, `onCheckedChange`          | none documented                          | `aria-invalid` on the box, `data-invalid` on `Field` | `disabled`    | S5  |
| Radix Primitives | `checked="indeterminate"` (`boolean \| 'indeterminate'`)  | `checked`, `defaultChecked`, `onCheckedChange`          | n/a (unstyled)                           | none documented                                 | `disabled`         | S6  |
| Radix Themes    | `checked="indeterminate"`                                  | `defaultChecked`; handler not documented                | `"1"` to `"3"` (default `"2"`)           | none documented                                 | native `disabled`  | S7  |
| Chakra UI       | `checked` set to indeterminate (per page text)             | `checked`, `defaultChecked`, `onCheckedChange`          | `xs`, `sm`, `md`, `lg`                   | `invalid` on `Checkbox.Root`                    | `disabled`, `readOnly` on Root | S8 |
| Adobe Spectrum  | `isIndeterminate` (presentational only)                    | `isSelected`, `defaultSelected`, `onChange(boolean)`    | none documented                          | `isInvalid`                                     | `isDisabled`       | S9  |
| IBM Carbon      | `indeterminate` (sets the DOM property, source)            | `checked`, `defaultChecked`, `onChange(evt, {checked, id})` | none documented                      | `invalid` + `invalidText`; also `warn`          | native `disabled`; also `readOnly` | S10 |
| GitHub Primer   | `indeterminate` ("native indeterminate state")             | `checked`, `defaultChecked`, `onChange`                 | none documented                          | `validationStatus` (`error` \| `success`), ARIA only | `disabled`    | S11 |
| Atlassian       | `isIndeterminate` (does not touch `isChecked`)             | `isChecked`, `defaultChecked`, `onChange(e, analyticsEvent)` | none documented                     | `isInvalid` (+ `isRequired`)                    | `isDisabled`       | S12 |
| GOV.UK          | none documented                                            | `checked` per item; native form post                    | standard or small (CSS class)            | `errorMessage` on the group                     | not covered        | S13 |
| Shopify Polaris | `indeterminate`, `defaultIndeterminate`                    | `checked`, `defaultChecked`, DOM `change` event         | not covered                              | `error` (message, announced)                    | `disabled`         | S14 |
| Fluent UI v9    | `checked="mixed"`                                          | `checked`, `onChange` (signature not described)         | `medium`, `large`                        | none documented                                 | not covered        | S15 |

Notes on cells:

- MUI: the page never names the underlying `<input>`; extra attributes go through `slotProps.input` (S1).
- Material: the m3.material.io guidelines page returned only a title. Rows use the Compose docs and the Android `Checkbox.md` source doc. `enabled` is from the Compose signature anchors, not from the page body (S2).
- Ant: the page lists `Checkbox.Group` props `options` (with `label`, `value`, `disabled`), `value`, `defaultValue`, `name`, `onChange(checkedValue[])`. `Form.Item` needs `valuePropName="checked"` (S3).
- shadcn: the docs default to Base UI; Radix and React Aria are tabs. The page names neither the element nor the role (S5).
- Radix Primitives: the docs page does not name the rendered element. The source file (`checkbox.tsx`) renders a `button` with `role="checkbox"` and `aria-checked` set to `'mixed'` when indeterminate. A hidden `<input type="checkbox">` is rendered after it when the button is in a form or is not yet mounted (S6).
- Radix Themes: the page says it inherits the primitive's props but documents no change handler (S7).
- Chakra: the page text says to set `checked` to `indeterminate`. The code block was not in the fetched text, so `checked="indeterminate"` is inferred from the text (S8).
- Spectrum: React Spectrum v3 `isIndeterminate` "stays visible regardless of user interaction". React Aria says the same ("presentational only"). Neither page says how mixed reaches assistive technology (S9).
- Carbon: the React Storybook page returned only a title. Props and elements come from the `Checkbox.tsx` and `CheckboxGroup.tsx` source files. The usage page says "error" where the prop is `invalid` (S10).
- Primer: the Checkbox page says individual checkboxes have no validation styles; show validation on the group (S11).
- Atlassian: a disabled checkbox is discouraged if it must stay in the tab order (S12).
- GOV.UK: the group has `fieldset`, `hint`, `errorMessage` and `items` params; items have `value`, `text`, `hint`, `checked`, `conditional`, `behaviour` (S13).
- Polaris: no `onChange` prop is documented; use the `change` listener. `details` shows help text under the field (S14).
- Fluent: the spec file was read from GitHub (S15). It does not say whether mixed sets `aria-checked`.
- The Component Gallery lists these other names for the component: "Checkboxes" (GOV.UK, NHS, ONS and others), "Checkbox card" (Blueprint, Chakra), "Checkbox Button" (Lightning), "Checkbox Wrapper" (Porsche), "CheckBox" (Grommet) (S16).

## Patterns observed

**Name.** The single word `Checkbox` is used by 11 of 14 systems (MUI, Ant, Mantine, shadcn, Radix, Chakra, Spectrum, Carbon, Primer, Atlassian, Fluent). The rest are platform spellings: Polaris `s-checkbox`, Compose `Checkbox`, Android `<CheckBox>`/`MaterialCheckBox`. GOV.UK says "Checkboxes" because its component is the whole group. Capital-B `CheckBox` appears only in Android XML and Grommet (S16). No system opened uses a name that is not a spelling of "checkbox".

**Where the visible label lives.** The label of a checkbox sits beside the box, not above it, and it is part of the click target (Carbon, Atlassian: the label is part of the clickable area).

- Inside the component, as a prop, children or part: Mantine `label`, Fluent `label`, Atlassian `label`, Polaris `label`, Carbon `labelText`, Spectrum `children`, Chakra `Checkbox.Label`, GOV.UK item `text` (8).
- In a wrapper around the control: MUI `FormControlLabel`, Primer `FormControl`, shadcn `Field` + `FieldLabel`, Radix Themes `Text as="label"` (4).
- Not documented: Radix Primitives, Ant (only a style slot), Compose (a `Text` in a `Row`).

This is the opposite lean from `Input`. For text inputs the survey was split 6 bundle to 6 bare. For checkboxes, 8 of the 12 systems that document a label put it inside the component. Even so, the wrappers exist: Chakra says to put single checkboxes in `Field.Root`, and shadcn pairs `Checkbox` with `Field`. So "label inside" and "wrapper adds hint and error" coexist.

The prop name for the inside label is not unanimous: `label` (Mantine, Fluent, Atlassian, Polaris), `labelText` (Carbon), `children` (Spectrum). Mantine, Fluent and Polaris accept JSX in it, for links.

**Mixed state: name.**

- A boolean prop beside `checked`: MUI, Ant, Mantine, Carbon, Primer, Polaris use `indeterminate`; Atlassian and Spectrum use `isIndeterminate` (8).
- A third value of the checked prop: Radix (both), Chakra `"indeterminate"`, Fluent `"mixed"` (4).
- A separate type: Compose `TriStateCheckbox` with `ToggleableState` (`On`, `Off`, `Indeterminate`); Android `checkedState`.
- GOV.UK: not mentioned.

Everyone who documents the effect on the value agrees it is presentation only. Mantine ignores `checked` while `indeterminate` is set, Atlassian does not change `isChecked`, Polaris takes the form value from `checked`, Spectrum calls it presentational. MDN says the same: it is "purely a visual change" and submission depends on `checked` alone (S19). The APG reserves mixed for a parent checkbox that summarises a group; each option stays two-state (S18).

**Mixed state: rendering.** Two techniques are visible.

- Native input with the DOM `indeterminate` property: Carbon (source sets it through a ref callback), Primer ("native indeterminate state"). MDN: it cannot be set with an HTML attribute, only from script (S19). `@types/react` has no `indeterminate` key on `InputHTMLAttributes`, checked in `node_modules/@types/react/index.d.ts`, so React cannot pass it as a prop.
- `aria-checked="mixed"` on a `<button role="checkbox">`: Radix (source). Primer's accessibility page also says its component applies `aria-checked="mixed"`, on top of a native input.

Not stated on the pages opened: MUI, Ant, Mantine, Spectrum/React Aria, Fluent, Atlassian, Polaris. Whether a user click clears the mixed state is not stated on the MDN page either.

**Change handler and value props.**

- `checked` + `defaultChecked` are the dominant names (every web system opened except Atlassian and Spectrum; Radix Themes documents only `defaultChecked`). Atlassian says `isChecked`, Spectrum `isSelected`/`defaultSelected`.
- Native-shaped `onChange(event)`: MUI, Ant, Mantine, Primer, Atlassian (plus an analytics argument), Carbon (event plus `{checked, id}`).
- `onCheckedChange(checked)`: Radix, shadcn, Chakra, Compose. This follows the Radix model, where the element is a button and there is no native change event on it.
- `onChange(boolean)`: Spectrum. DOM `change` event: Polaris.

So the split is by element. Systems on a native input keep `onChange`; systems on a button or headless state machine use `onCheckedChange`.

**Group.** 7 systems ship a named group component: Ant `Checkbox.Group`, Mantine `Checkbox.Group`, Chakra `CheckboxGroup`, Radix Themes `CheckboxGroup.Root`, Spectrum `CheckboxGroup`, Carbon `CheckboxGroup`, Primer `CheckboxGroup`. GOV.UK's component is the group. MUI has a generic `FormGroup`. shadcn, Polaris, Atlassian, Radix Primitives and Fluent document none.

- Value model, where documented: an array of strings in the group's `value` and `onChange(string[])` (Ant, Mantine, Spectrum, Primer).
- Group-level label, hint, error: Mantine (`label`, `description`, `error`), Spectrum (`label`, `description`, `errorMessage`), Carbon (`legendText`, `helperText`, `invalidText`), Primer (`CheckboxGroup.Label`, `Caption`, `Validation`), GOV.UK (`fieldset.legend`, `hint`, `errorMessage`). Primer says validation goes on the group, not on single boxes.
- Element: `<fieldset>` + `<legend>` for Carbon (source), Primer (page), GOV.UK, Chakra (via `Fieldset`) and MDN. The APG describes `role="group"` with `aria-labelledby` (S18). Mantine and Spectrum do not name the element.

**Size.** Documented in 5 systems and each is a different scale: Mantine `xs` to `xl`, Chakra `xs` to `lg`, Radix Themes `"1"` to `"3"`, Fluent `medium` and `large`, MUI `small` only. Ant, Spectrum, Carbon, Primer and Atlassian document none. GOV.UK has standard and small by CSS class. `Input` already uses `sm | md | lg`.

**Invalid.** The split matches the one in the Input study.

- `invalid` / `isInvalid`: Chakra, Carbon, Atlassian, Spectrum.
- `error`: Mantine, Polaris (accept a message).
- `validationStatus`: Primer, ARIA only.
- Native `aria-invalid` only: shadcn.
- Android: `errorShown`. Radix, Ant, Fluent: none documented.

`Input` uses a boolean `invalid`, which sets `aria-invalid` and `data-invalid`.

**Disabled.** `disabled` in most web systems, `isDisabled` in Atlassian and Spectrum, `enabled` in Compose. Atlassian advises against a disabled checkbox that must stay in the tab order.

## Accessibility notes

- **MUI**: "All form controls should have labels", usually with `FormControlLabel`. Without a visible label, put `aria-label`, `aria-labelledby` or `title` through `slotProps.input`. The page links the WAI-ARIA checkbox pattern (S1).
- **Material (Android)**: text is passed to accessibility services automatically; `errorAccessibilityLabel` exists for error announcements. The Compose page has no accessibility section (S2).
- **Ant**: no accessibility guidance on the page (S3).
- **Mantine**: provide `label` or `aria-label`; an unlabelled checkbox is not accessible. `Checkbox.Indicator` cannot be focused (S4).
- **shadcn**: `aria-invalid` on the box and `data-invalid` on the `Field`. Nothing else (S5).
- **Radix Primitives**: follows the tri-state checkbox pattern; Space toggles. The page does not say how to associate a label (S6).
- **Radix Themes**: no accessibility section; only the label-wrapping pattern (S7).
- **Chakra**: wrap single checkboxes in `Field.Root` for labels and helper text; wrap groups in a fieldset with a legend. The page warns that `Field.Root` around a `CheckboxGroup` can cause interaction issues. No ARIA or keyboard detail (S8).
- **Spectrum**: provide a visible label, otherwise `aria-label`; or `aria-labelledby`. The invalid state is "only communicated via a color change" in the default style, so say it another way too. `aria-describedby` and `aria-errormessage` are supported (S9).
- **Carbon**: label always needed in code, for one box or a group. Space toggles, Tab moves. Labels under three words. Both box and label are clickable (S10).
- **Primer**: visible, permanent label, right of the box; the accessible name must contain the visible text. Native `<input type="checkbox">` with a `<label>`; caption linked with `aria-describedby`; `disabled` attribute must be present. Space toggles (S11).
- **Atlassian**: error messages for required or invalid checkboxes; do not use a disabled checkbox if it must stay in the tab order (S12).
- **GOV.UK**: group in a `fieldset` with a `legend`; hints one short sentence, no links (screen readers read them out); conditionally revealed content can fail WCAG 4.1.2 (S13).
- **Polaris**: `details` and `error` are announced; `labelAccessibilityVisibility="exclusive"` hides the label visually but keeps it for screen readers; `accessibilityLabel` adds context (S14).
- **Fluent**: follows the WAI-ARIA checkbox pattern; the native input needs no extra ARIA; the indicator is `aria-hidden` (S15).

**Standards.**

- **WCAG 1.4.11 Non-text Contrast (AA)**: 3:1 against adjacent colours for the visual cues that show a control exists and for state indicators. The tick in a checkbox is named as an example; a 2.7:1 light-grey border fails. Inactive (disabled) components are exempt. A state change must not drop below 3:1 with its surroundings (S17).
- **WCAG 1.3.1 and 4.1.2 (A)**: a programmatic label, and name, role and state exposed. The two Understanding pages were opened for the Input study on the same date and are not re-read here (S17).
- **WAI-ARIA APG checkbox pattern**: role `checkbox`; `aria-checked` is `true`, `false` or `mixed`; Space changes the state; the name comes from content, `aria-labelledby` or `aria-label`. A visible group label goes on a `role="group"` with `aria-labelledby`. The page gives no rule that prefers native over ARIA (S18).
- **MDN**: explicit `for`/`id` or nesting in `<label>`; clicking the label toggles the box; related boxes in `fieldset` + `legend` (S19).

Common denominator: a visible label that is part of the click target and in the accessible name; mixed state is presentation, never the value; groups are a `fieldset` + `legend` (or `role="group"`); errors for a group belong on the group (Primer, GOV.UK). Only Primer says it sets `aria-checked="mixed"` on top of a native input; the rest are silent.

## Options for Omnia

Revised 2026-10-31. Two accepted ADRs now constrain every option:

- **ADR 0015** (`docs/adr/0015-native-attribute-prop-names.md`): a prop named like an attribute of any HTML element keeps its native type and meaning. A colliding variant axis becomes `variant<Axis>`. A colliding non-variant prop gets a non-native name. `src/native-prop-names.check.ts` fails `pnpm typecheck` otherwise.
- **ADR 0016** (`docs/adr/0016-form-and-validation-strategy.md`): form atoms are display only. `invalid` becomes `aria-invalid`; native props and `ref` pass through; the atom ships no error text and no validation.

Names checked in `node_modules/@types/react/index.d.ts` for this revision:

- **Native**: `size` (`number`, on `input` and `select`), `label` (`string`, on `option`, `optgroup`, `track`), `title`, `content`, `children` (`ReactNode`), `checked`, `defaultChecked`, `required`, `name`, `value`.
- **Not native** (no attribute of that name on any HTML element type): `indeterminate`, `invalid`, `labelText`, `text`, `description`, `hint`, `helperText`. `legend` and `caption` appear only as tag names.

### Shared base for every option

Native `<input type="checkbox">` inside a styled box. The options differ only in how the visible label is given.

| Prop                                                   | Type                                  | Native name?                                                                 | Where it lands                                                                                          |
| ------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `variantSize`                                          | `'sm' \| 'md' \| 'lg'` (`CheckboxSize`) | `size` is native, so renamed (as `Input` and `Button` already are)           | root `data-size` (the `data-*` name does not change, ADR 0015 rule 4)                                   |
| `invalid`                                              | `boolean`                             | no                                                                           | `aria-invalid="true"` on the input, `data-invalid` on the root; a caller's own `aria-invalid` wins, as in `Input` |
| `indeterminate`                                        | `boolean`                             | no (not a React prop name)                                                   | the DOM `indeterminate` property of the input, plus `data-indeterminate`; never changes the form value  |
| `checked`, `defaultChecked`                            | `boolean`                             | native, unchanged: no tri-value `checked`                                    | the input                                                                                               |
| `disabled`, `required`, `name`, `value`, `onChange`, `onBlur` | native                         | native, unchanged                                                            | the input                                                                                               |
| `ref`                                                  | `Ref<HTMLInputElement>`               | native name, same meaning                                                    | the input, merged with the atom's own ref (ADR 0016)                                                    |
| `className`, `style`                                   | native                                | native name, root target (as in `Input`)                                     | the root                                                                                                |
| `type`                                                 | not exposed                           | omitted from the native type, fixed to `checkbox`                            | n/a                                                                                                     |

Other behaviour:

- Data attributes follow `Input`: `data-scope="checkbox"`, `data-part`, `data-size`, `data-invalid`, `data-disabled`, plus `data-indeterminate`.
- `size` is no longer omitted from the native type, so a native `size={20}` would reach the input and do nothing on a checkbox.
- `indeterminate` and `checked` stay two separate booleans. If both are set, `indeterminate` is shown and the value is still `checked` (Mantine's rule).
- No `errorMessage`, `helperText` or validation prop (ADR 0016). A single box in error only gets `invalid`. The message is the consumer's, rendered by a future `FormField.Error`.
- A group error is a later `CheckboxGroup` concern: `<fieldset>` + `<legend>`, as Primer and GOV.UK do.

| Option | Label API                                       | Extra props beyond the base                      |
| ------ | ----------------------------------------------- | ------------------------------------------------ |
| A      | none, label from outside                        | none                                             |
| B      | `children`                                      | `children?: ReactNode`                           |
| C1     | `label`, typed `string`                         | `label?: string`                                 |
| C2     | a non-native name (`labelText`, `text`, others) | one of `labelText?`, `text?`, `labelContent?: ReactNode` |
| D      | `Checkbox.Label` part                           | parts; which part takes the native props is open |

**A. Bare `Checkbox`, label from outside (same as `Input`).**

```tsx
<label>
  <Checkbox name="terms" /> Accept the terms
</label>

<FormField id="terms">
  <Checkbox name="terms" />
  <FormField.Label>Accept the terms</FormField.Label>
  <FormField.Error>…</FormField.Error>
</FormField>
```

- Pro: identical to the decided `Input` shape. `FormField` owns every label, hint and error, and (ADR 0016) hands `id`, `aria-describedby`, `aria-invalid` and `required` down by Context. One rule for all atoms.
- Pro: no label prop to name, so ADR 0015 has nothing to say. The atom stays the smallest and `Switch` can copy it.
- Con: only 4 systems keep the label outside (MUI, Primer, shadcn, Radix Themes), and 3 more document nothing. The label of a checkbox is the click target, so every caller builds the `<label>` wrapper by hand, or `FormField` needs a second, horizontal layout.
- Con: an unlabelled checkbox is easy to write. The WCAG 1.3.1 and 4.1.2 risk is higher than for `Input`, since a bare box has no text at all.

**B. `Checkbox` with `children` as the label (Spectrum model).**

```tsx
<Checkbox name="terms">Accept the terms</Checkbox>
<Checkbox name="all" indeterminate aria-label="Select all" />
```

The root is a `<label>` wrapping the input, the box and the children, so the whole row is the click target. Without children, `aria-label` or `aria-labelledby` is required (documented, not enforced by types). `children` is a native name, but it is typed `ReactNode` and keeps its meaning, so the gate passes. It is destructured and never reaches the void `<input>`.

- Pro: after ADR 0015 this is the only label API that needs no new word and no gate decision.
- Pro: `Button` already takes its label as `children: ReactNode`, so the repo has one rule for "the text of a control".
- Pro: one line for the common case. The click target is correct by construction. Rich content (links) works without an extra prop.
- Con: one system opened (Spectrum) uses `children` this way; Carbon, Mantine, Fluent, Atlassian and Polaris use a prop. The survey cannot be called in B's favour, only not against it (see C2).
- Con: `children` on a form control hides whether a label exists. Empty children is silent.
- Con: same double-naming trap as C below if the caller also adds `FormField.Label`.

**C. A label prop.** `label` is no longer free: it is native on `option`, `optgroup` and `track`, typed `string`.

```tsx
<Checkbox name="terms" labelText="Accept the terms" />
<Checkbox name="all" indeterminate aria-label="Select all" />
```

Same structure as B (root is a `<label>`). Two ways to keep a label prop under ADR 0015:

- **C1. Keep `label`, typed `string`.** Passes the gate, since `string` is assignable to the native type. It follows the letter of rule 1 only: `<input>` has no `label` attribute, so the prop does not "reach the native element", and ADR 0015 says in its Consequences that a Checkbox `label` would have to be a `string` or be renamed. It also loses `ReactNode`, which Mantine, Fluent and Polaris accept for links. Listed for completeness, not recommended.
- **C2. A non-native name, `ReactNode`.** Candidates, all checked against React's types:
  - `labelText`: Carbon's name (S10). Not in React's types. Mild misnomer: it takes nodes, and "Text" suggests a string. Carbon's own type was not re-read for this revision.
  - `text`: GOV.UK's item parameter (S13). Not an HTML attribute prop in React's types. Very generic; it would also be the obvious name for a later description line, so the two would blur.
  - `labelContent`: no system in the survey uses it; it is invented here. It says what the type is, and it costs a new word on top of `variantSize`.

Pros and cons of C2:

- Pro: the label is a named prop, so a missing one is visible at the call site and in the story controls.
- Con: the `label` family (Mantine, Fluent, Atlassian, Polaris; 4 systems) is gone. Each remaining spelling is one system (`labelText` Carbon, `text` GOV.UK, `children` Spectrum), so the survey no longer favours C over B.
- Con: a second vocabulary to teach in a library that already has to teach `variantSize` (ADR 0015 accepts that cost, not this one).
- Con: as in B, a `FormField.Label` around a labelled checkbox gives it two names.
- Con: a description line later (Primer caption, Polaris `details`) needs a second prop. `description` and `hint` are free names.

**D. Compound `Checkbox` with a `Checkbox.Label` part.**

```tsx
<Checkbox name="terms">
  <Checkbox.Control />
  <Checkbox.Label>Accept the terms</Checkbox.Label>
</Checkbox>
```

- Pro: Chakra's model; no label prop at all, so ADR 0015 is not involved. Room for `Checkbox.Description`.
- Con: parts share the input id, so it needs React Context. The decision tree in `docs/ARCHITECTURE.md` allows Context for shared state; a bare id is thin.
- Con: ADR 0016 requires `name`, `onChange`, `onBlur`, `required` and `ref` to reach the real input. With parts, either the root takes them and forwards by Context, or `Checkbox.Control` takes them. That is one more decision, and a wrong pick breaks React Hook Form's `register`.
- Con: heavy for the simplest control in the library; one system opened (Chakra) does it. Easy to forget the label part.

**Element sub-decision (applies to all options).** Native `<input type="checkbox">` versus `<button role="checkbox">`.

- Native: Mantine, Fluent, Carbon, Primer, GOV.UK, Ant and (by their hidden input) Spectrum and Chakra. Space, focus, form post, `required` and the label click come from the browser. Primer's guidance names a native input plus `<label>` as the way to get role and state. Cost: a native box cannot be restyled directly, so the visible box is a sibling element or an appearance reset, a CSS choice that is not covered here.
- Button: Radix (source). Needs `role`, `aria-checked`, a Space handler and a hidden input to post in a form. It exists so a headless library controls state and renders any element.
- Omnia's rule that atoms stay native HTML points to native. ADR 0016 points the same way: native `name`, `value`, `checked` and `required` are what `FormData` and React 19 actions read. This study found no source that prefers the ARIA version for a plain checkbox.

## Recommendation

Opinion, built on the facts above and the two ADRs: **take option B with the native input. Name it `Checkbox`.** The root is a `<label>` wrapping the input, a decorative box and the `children`.

Props: the shared base (`variantSize`, `invalid`, `indeterminate`, `disabled`, `required`, `name`, `value`, `checked`, `defaultChecked`, `onChange`, `onBlur`, `ref`) plus `children?: ReactNode` as the visible label. Mixed state is the DOM `indeterminate` property set from the prop; the value stays `checked`. A group is a later molecule, `CheckboxGroup`: `<fieldset>` + `<legend>`, carrying the group `name`, the group `disabled` and the group error. `Switch` copies the same shape.

**This changes the earlier recommendation.** The first draft recommended C with `label`. It rested on two facts that ADR 0015 removed:

- `label` was the largest spelling (4 systems) and collided with nothing. It now collides with `option`, `optgroup` and `track`.
- The cheap fixes are weaker. `label: string` keeps the name but drops `ReactNode` and breaks rule 1's "reaches the native element". Any other name is a one-system spelling, the same weight as `children`.

What did not change: native input, mixed state as a DOM property, `CheckboxGroup` later, and the reason for not taking A.

Why B and not A: the label of a checkbox is the click target and part of its name. 8 of the 12 systems that document a label put it inside the component. `Input` bare and `Checkbox` labelled is a fact-based asymmetry. ADR 0016 does not change that: `FormField` supplies ids, `aria-describedby` and `aria-invalid` by Context either way.

Why B and not C2: with `label` gone the survey is a tie, so the tie-breakers are local. `Button` already uses `children` for its text, B adds no vocabulary and no gate risk, and the call site reads like JSX. If the owner prefers a named, visible prop, C2 with `labelText` is the fallback and its cost is the misnomer.

Devil's advocate on that pick:

- **The evidence for `children` is one system.** True: Spectrum. Each C2 spelling is also one system. The pick rests on the repo's own habit (`Button`) and on adding no word, not on the survey. If the owner values market vocabulary over internal consistency, there is no winner here.

- **A missing label is silent.** Empty `children` renders a nameless input. Types do not flag it. A union that requires `children`, `aria-label` or `aria-labelledby` is possible and not designed here. The a11y gate (ADR 0006) should flag an unnamed input in a story; not tested in this study.

- **It breaks the rule just set for `Input`.** If the owner wants one rule for every atom, A is the honest choice, and the cost is a horizontal `FormField` layout plus a hand-written `<label>` in simple cases.

- **Double naming is a real trap.** `children` inside a `FormField.Label` gives two names, and nothing in types prevents it. The `FormField` study has to say whether `FormField` renders a label for an atom that has its own. That is the same weakness as C2 and the opposite of A.

- **Rich children is a feature and a trap.** Nothing stops a link or a button inside the label. Not tested here how that behaves in each browser and screen reader.

- **`indeterminate` beside `checked` allows a nonsense pair.** Radix's single tri-value prop rules it out, but ADR 0015 now forbids it for Omnia: `checked` would take values the native one does not, and `defaultChecked` and the native `onChange` would go with it. So the boolean pair is the only form left. Mantine documents the rule that `indeterminate` wins; Omnia would copy it.

- **The ref is a trap.** The atom needs its own ref to set the `indeterminate` property, and ADR 0016 says it must merge refs so a form library's `ref` still lands on the input. A bug there silently breaks React Hook Form's `register`. It needs a test with a callback ref and an object ref. How to merge is not decided here.

- **Native `indeterminate` exposure to assistive technology is not settled by the sources.** Primer adds `aria-checked="mixed"`, Carbon's source sets only the DOM property. This needs a check in the accessibility tree during the build, along with whether a click clears the mixed state (the MDN page does not say). Neither is verified here.

- **`invalid` on a lone checkbox is thin.** Primer says single boxes carry no validation styles, and puts them on the group. Omnia keeps `invalid` on the atom because ADR 0016 fixes its meaning across atoms (the "accept the terms" case). The message and the group case wait for `FormField.Error` and `CheckboxGroup`. Until both exist, callers assemble the `fieldset` and the message by hand. The native `required` bubble is unstyled; ADR 0016 leaves the `noValidate` and `:user-invalid` question open.

- **Contrast is a design risk.** A checked box with a tick needs 3:1 for the box edge against the surface, and 3:1 for the tick against the fill, in all four modes (WCAG 1.4.11, S17; `src/styles/contrast.test.ts` already covers boundary and indicator tokens).

Not decided here: visual spec, the shape of the tick and dash, whether the root is a `span` or `label` when no text is given, whether types enforce an accessible name, how refs are merged, `readOnly` (not verified for native checkboxes), `required` asterisk, the exact `CheckboxGroup` and `FormField` APIs, a later `description` prop, and the Card variant (Chakra, Mantine and Blueprint have a checkbox card).

## Decision

Option B (owner, 2026-10-31).

`Checkbox` renders a native `<input type="checkbox">` inside a root `<label>`; `children` is the visible label, plus `variantSize`, `invalid`, `indeterminate` and every native input prop (`ref` included) on the input.

## Sources

All opened 2026-10-30 unless noted.

- S1 MUI: https://mui.com/material-ui/react-checkbox/
- S2 Material: https://developer.android.com/develop/ui/compose/components/checkbox , https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/Checkbox.md , https://m3.material.io/components/checkbox/guidelines (title only)
- S3 Ant Design: https://ant.design/components/checkbox
- S4 Mantine: https://mantine.dev/core/checkbox/
- S5 shadcn/ui: https://ui.shadcn.com/docs/components/checkbox
- S6 Radix Primitives: https://www.radix-ui.com/primitives/docs/components/checkbox , https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/checkbox/src/checkbox.tsx
- S7 Radix Themes: https://www.radix-ui.com/themes/docs/components/checkbox , https://www.radix-ui.com/themes/docs/components/checkbox-group
- S8 Chakra: https://chakra-ui.com/docs/components/checkbox
- S9 Spectrum / React Aria: https://react-spectrum.adobe.com/react-spectrum/Checkbox.html , https://react-spectrum.adobe.com/react-spectrum/CheckboxGroup.html , https://react-aria.adobe.com/Checkbox
- S10 Carbon: https://carbondesignsystem.com/components/checkbox/usage/ , https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/Checkbox/Checkbox.tsx , https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/CheckboxGroup/CheckboxGroup.tsx
- S11 Primer: https://primer.style/product/components/checkbox/ , https://primer.style/product/components/checkbox/accessibility/ , https://primer.style/product/components/checkbox-group/
- S12 Atlassian: https://atlassian.design/components/checkbox/usage , https://atlassian.design/components/checkbox/code
- S13 GOV.UK: https://design-system.service.gov.uk/components/checkboxes/
- S14 Polaris: https://shopify.dev/docs/api/app-home/polaris-web-components/forms/checkbox
- S15 Fluent UI v9 (GitHub source): https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-checkbox/library/docs/Spec.md
- S16 Component Gallery: https://component.gallery/components/checkbox/
- S17 WCAG 2.1 Understanding: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html (opened now); https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html , https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html (opened for `docs/naming/input.md`, not re-read here)
- S18 WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- S19 MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox

Could not open (404, empty, or title only): m3.material.io checkbox guidelines (title only), the Carbon React Storybook checkbox page (title only), the Compose `material3` package reference (too large, the Checkbox entries were not reached). Not opened: Fluent v9 Storybook pages, Ant group examples, Mantine `Checkbox.Card` details, Radix Themes `CheckboxGroup` change-handler docs, Material 3 spec accessibility page, Apple HIG (out of scope).
