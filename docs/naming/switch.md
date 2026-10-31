# Naming study — switch

Date: 2026-10-31. Method: official docs and, where a docs page was silent, the system's own source file, opened during this study. "None documented" means the pages opened do not mention it, not that the system lacks it. "Not verified" means no usable page was opened. Pages were read through a fetch tool that summarises each page, so quotes are short and cell values are as reported by that summary. Where a source file was read, the cell says so. Prop names for Omnia were checked in `node_modules/@types/react/index.d.ts` (`@types/react` 19.3.0), against ADR 0015.

## Question

Omnia needs a switch atom. `Input` and `Checkbox` are decided (bare native control; `Checkbox` is a native input inside a `<label>` with `children` as the label). Both follow ADR 0015 (native prop names) and ADR 0016 (form atoms are display only). Six sub-questions:

1. What is it called: `Switch`, `Toggle` or `ToggleSwitch`, and why do systems diverge?
2. Which element: `<input type="checkbox" role="switch">`, `<button role="switch" aria-checked>`, or the new HTML `switch` attribute on `<input type="checkbox">`? Support, accessibility and form participation.
3. Where does the label live (`children` as in `Checkbox`, or a prop), which side is it on, and is on/off text built in?
4. Switch (immediate effect) versus checkbox (submitted with a form): what does the guidance say, and what does it mean for a display-only atom?
5. Is an async/pending state needed, and what is it called under ADR 0015?
6. Sizes, invalid, disabled, readOnly, and the absence of an indeterminate state.

## Survey

14 systems, 15 rows (Radix is split into Primitives and Themes). GOV.UK has no switch component. Apple HIG is out of scope.

### Table 1 — names and structure

| System           | (1) Name                                                        | (2) Visible label lives in                                                                        | (3) Element and role                                                                                  | (4) Form participation                                                       | Src |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --- |
| MUI              | `Switch`                                                        | wrapper: `FormControlLabel` (`label`, `labelPlacement`)                                           | not named on the page                                                                                 | None documented                                                              | S1  |
| Material (M3)    | Compose `Switch`; Android `MaterialSwitch`                      | Compose: none documented; Android: `android:text`                                                 | native Android view                                                                                   | n/a                                                                          | S2  |
| Ant Design       | `Switch`                                                        | no label prop; `checkedChildren` / `unCheckedChildren` (ReactNode) show inside the track          | `<button role="switch" aria-checked>` (rc-switch source)                                              | `Form.Item` needs `valuePropName="checked"`; no hidden input seen in source | S3  |
| Mantine          | `Switch` (+ `Switch.Group`)                                     | inside: `label`, plus `description`, `error`; `labelPosition` (source)                            | `<input type="checkbox" role="switch">` (source)                                                      | native input; props not consumed are forwarded to it                         | S4  |
| shadcn/ui        | `Switch`                                                        | wrapper: `Label`, or `Field` + `FieldLabel`                                                       | not named; tabs for Base UI (default), React Aria, Radix                                              | None documented                                                              | S5  |
| Radix Primitives | `Switch.Root` + `Switch.Thumb`                                  | none documented                                                                                   | `<button type="button" role="switch" aria-checked>` (source)                                          | hidden `<input type="checkbox">`, only inside a `<form>`; `value` default `on` | S6  |
| Radix Themes     | `Switch`                                                        | wrapper: `Text as="label"` around it                                                              | inherits the primitive; not named                                                                     | None documented                                                              | S7  |
| Chakra UI        | `Switch.Root` + `HiddenInput`, `Control`, `Thumb`, `Label`, `Indicator`, `ThumbIndicator` | inside: a `Switch.Label` part                               | hidden input part; role not stated                                                                    | `name`, `value` (default `on`) on Root                                       | S8  |
| Adobe Spectrum   | `Switch`                                                        | inside: `children`; `aria-label` if none                                                          | React Aria: `label` + input; `role="switch"` not stated on the pages                                  | `name`, `value`, `form`, `isRequired`                                        | S9  |
| IBM Carbon       | `Toggle`                                                        | inside: `labelText` (+ `hideLabel`); side labels `labelA` / `labelB`                              | `<button type="button" role="switch" aria-checked>` (source)                                          | Not verified                                                                 | S10 |
| GitHub Primer    | `ToggleSwitch`                                                  | outside: a visible element referenced by a required `aria-labelledby`                             | `<button aria-pressed>`, no `role`, no `aria-checked` (source)                                        | none: no hidden input, no `name` or `value` (source)                         | S11 |
| Atlassian        | `Toggle`                                                        | outside: `<label htmlFor>` + `id`; fallback prop `label` (`aria-labelledby`)                      | native input (ref and handler typed `HTMLInputElement`); role not stated                              | `name`, `value`                                                              | S12 |
| Fluent UI v9     | `Switch`                                                        | inside: `label` slot, `labelPosition`                                                             | `<input type="checkbox" role="switch">`, opacity 0, over an `aria-hidden` indicator (spec)            | native input                                                                 | S13 |
| Shopify Polaris  | `s-switch`                                                      | inside: `label` (clicking it toggles), `accessibilityLabel`                                       | not named                                                                                             | None documented                                                              | S14 |
| GOV.UK           | none                                                            | n/a                                                                                               | n/a                                                                                                   | n/a                                                                          | S15 |

### Table 2 — props

| System           | State and change                                                    | Size                                | Invalid                                          | Disabled / readOnly                                                     | Pending                                           | On/off text                                                                 | Src |
| ---------------- | ------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- | --- |
| MUI              | `checked`, `defaultChecked`, `onChange`                             | `small` (and default)               | None documented                                  | `disabled`; readOnly not mentioned                                      | None documented                                   | none; an iOS-style demo draws "On"/"Off" with styling only                  | S1  |
| Material (M3)    | Compose: `checked`, `onCheckedChange`; Android: `isChecked`         | none documented                     | Android: none documented                         | Compose `enabled`; Android `android:enabled`                            | None documented                                   | none; `thumbContent` / `app:thumbIcon` put an icon in the thumb             | S2  |
| Ant Design       | `checked`, `defaultChecked`, `value` (alias), `onChange(checked, event)` | `medium`, `small`              | None documented                                  | `disabled`                                                              | `loading`                                         | `checkedChildren`, `unCheckedChildren`                                      | S3  |
| Mantine          | `checked`, `defaultChecked`, `onChange(event)`                      | `xs` to `xl`                        | `error` (source passes it; the page shows error text) | `disabled`, `readOnly` (clicks and Space do nothing)               | not covered                                       | `onLabel`, `offLabel` inside the track, `aria-hidden` (source); `thumbIcon` | S4  |
| shadcn/ui        | handlers not covered on the page                                    | Small and Default shown (`size`)    | `aria-invalid` on the switch, `data-invalid` on `Field` | `disabled`                                                       | None documented                                   | None documented                                                             | S5  |
| Radix Primitives | `checked`, `defaultChecked`, `onCheckedChange`                      | n/a (unstyled)                      | None documented                                  | `disabled`, `required`                                                  | None documented                                   | None documented                                                             | S6  |
| Radix Themes     | `defaultChecked`; handler not documented                            | `"1"` to `"3"` (default `"2"`)      | None documented                                  | native `disabled`                                                       | None documented                                   | None documented                                                             | S7  |
| Chakra UI        | `checked`, `onCheckedChange`                                        | `xs`, `sm`, `md`, `lg`              | `invalid`                                        | `disabled`, `readOnly`, `required`                                      | None documented                                   | parts `Switch.Indicator`, `Switch.ThumbIndicator` (with `fallback`)         | S8  |
| Adobe Spectrum   | `isSelected`, `defaultSelected`, `onChange(boolean)`                | none listed                         | `isInvalid` is listed, yet the page also says switches cannot show an error state | `isDisabled`, `isReadOnly`                         | None documented                                   | None documented                                                             | S9  |
| IBM Carbon       | `toggled`, `defaultToggled`, `onToggle(boolean)`, `onClick`         | `sm`, `md`                          | None documented                                  | `disabled`, `readOnly` (stays focusable)                                | a skeleton state for first page load only         | `labelA` / `labelB` (default "Off" / "On"), `aria-hidden` (source)          | S10 |
| GitHub Primer    | `checked`, `defaultChecked`, `onChange(boolean)`, `onClick`         | `small`, `medium`                   | None documented                                  | `disabled`; readOnly not mentioned                                      | `loading`, `loadingLabel`, `loadingLabelDelay`    | `buttonLabelOn` / `buttonLabelOff` (default "On" / "Off"), `aria-hidden`    | S11 |
| Atlassian        | `isChecked`, `defaultChecked`, `onChange(event, analyticsEvent)`    | `regular`, `large`                  | None documented                                  | `isDisabled` (leaves the tab order)                                     | `isLoading` (spinner inside)                      | None documented; the page says not to change the label by state             | S12 |
| Fluent UI v9     | `checked`, `defaultChecked`, `onChange(event, {checked})`           | `small`, `medium`                   | None documented                                  | `disabled`; `disabledFocusable`                                         | None documented                                   | None documented                                                             | S13 |
| Shopify Polaris  | `checked`, `defaultChecked`, DOM `change` event                     | not covered                         | `error` (message, announced)                     | `disabled`                                                              | None documented                                   | None documented                                                             | S14 |

Notes on cells:

- MUI: `labelPlacement` exists but its values are not listed on the page. The page never names the input type or role. `readOnly` and `loading` are not mentioned (S1).
- Material: the m3.material.io guidelines page returned only a title. Rows use the Compose docs and the Android `Switch.md` source doc. The Compose page has no label or accessibility section (S2).
- Ant: the page gives no accessibility guidance. `loading` is a prop on the page; in the rc-switch source there is a `loadingIcon` node and nothing disables the control, so the page's `loading` is wired in Ant's own wrapper, which was not opened (S3).
- Mantine: the page says it is a regular `input[type="checkbox"]`; the source adds `role="switch"`. `readOnly` is on the page. `error` is not a documented prop on the page, but the source destructures it (S4).
- shadcn: the Base UI variant is shown. `checked` and `onCheckedChange` are deferred to Base UI's docs, not opened (S5).
- Radix: the page does not name the element; the source file (`switch.tsx`) renders the button. The hidden input is rendered when the switch is in a form or has a `form` prop (S6).
- Radix Themes: inherits the primitive's props; no handler documented (S7).
- Chakra: the Root `label` prop is a set of localized accessibility strings, not visible text. Label placement follows the JSX order of parts (S8).
- Spectrum: the page lists `isInvalid` but also says switches cannot have an error state. `isEmphasized` and `validate` are also listed (S9).
- Carbon: the usage page does not document the prop names; they come from `Toggle.tsx`. The source declares no `onChange`. The default size needs a visible label and state text; the small size makes both optional and shows a check mark when on (S10).
- Primer: the accessibility page says the control is a `<button>` with `aria-pressed`, and the source agrees. The accessibility page says the `disabled` attribute is applied; a summary of the source reported `aria-disabled`, so the two differ (S11).
- Atlassian: the page does not state a role. The source file URL tried returned 404, so the element is inferred from the types on the code page (S12).
- Fluent: `disabled` and `required` are not declared in the types file read. The spec says it replaces v8 `Toggle` (S13).
- Polaris: no `onChange` prop is documented; use the `change` listener (S14).
- GOV.UK: the components list opened has no switch or toggle; the only related components are Checkboxes and Radios. Whether GOV.UK advises against a switch is **Not verified**: a backlog search returned 0 results and a web search found no GOV.UK statement (S15).

## Patterns observed

**Name.** `Switch` is used by 11 of 15 rows: MUI, Compose, Ant, Mantine, shadcn, Radix (both), Chakra, Spectrum, Fluent, Polaris. `Toggle`: Carbon and Atlassian. `ToggleSwitch`: Primer. GOV.UK has none. Android's class is `MaterialSwitch`, and the class it replaces is `SwitchMaterial`; the platform control is a switch there too (S2).

Why they diverge, as far as the sources show:

- The ARIA role, the HTML attribute and the platform controls are all named `switch` (S20, S21, S16, S2). That is the strongest argument for `Switch` and the one the majority follows.
- Fluent's spec says its `Switch` replaces the v8 `Toggle` (S13). One system moved from the `Toggle` name to `Switch`. Carbon and Atlassian kept `Toggle`. No page opened gives a reason for keeping it.
- Primer's name matches its element. It renders a `<button aria-pressed>`, which is a toggle button, not an ARIA `switch` (S11). My inference, not stated by Primer: `Toggle` is also the word for a pressed-state button, so a system with both would need a longer name for the switch.
- The Component Gallery was not opened for this study, so no count of other names ("Toggle button", "Lightswitch", and so on) is given.

**Where the visible label lives.**

- Inside the component, as a prop, children or part: Mantine `label`, Polaris `label`, Fluent `label`, Carbon `labelText`, Spectrum `children`, Chakra `Switch.Label` (6).
- In a wrapper or an outside element: MUI `FormControlLabel`, shadcn `Label` / `Field`, Radix Themes `Text as="label"`, Primer (`aria-labelledby` to an outside element), Atlassian (`htmlFor` + `id`) (5).
- Not documented: Radix Primitives, Ant (only track content), Compose.

The lean is the same as for Checkbox: more systems keep the label inside, and several wrappers coexist.

**Label side.** Fluent `labelPosition` (`above`, `after`, `before`, default `after`); Mantine `labelPosition` (the page shows Left and Right options; the prop name is from source); MUI `labelPlacement` (values not listed); Chakra by JSX order. Primer's `statusLabelPosition` (`start`, `end`) moves the On/Off text, not the label. The other systems document nothing. Carbon's default shows the label above and state text beside the switch.

**On/off text.**

- Built in as text beside or inside the track: Carbon `labelA` / `labelB`, Primer `buttonLabelOn` / `buttonLabelOff`, Mantine `onLabel` / `offLabel`, Ant `checkedChildren` / `unCheckedChildren`.
- Carbon, Primer and Mantine hide it from assistive technology (`aria-hidden` in source). The role and the checked state already carry it. Ant's page does not say.
- Primer's accessibility page asks for 4.5:1 contrast on this text (S11). Carbon's default size requires it; Carbon's small size shows a check mark in place of it (S10).
- NN/g recommends "On"/"Off" descriptors and warns that a single descriptor can be read as a label (S24). The APG says the label must not change with the state (S21). Atlassian says the same (S12). These agree: the label is stable and the state text is separate.

**Element.** The map is split. The sources show:

- `<button role="switch" aria-checked>`: Radix, Carbon, Ant (source files) (3).
- `<input type="checkbox" role="switch">`: Mantine (source), Fluent (spec) (2).
- `<button aria-pressed>` with no role: Primer (1).
- Native input, role not stated: Atlassian. Hidden input, role not stated: Chakra, Spectrum.
- Not named: MUI, shadcn, Radix Themes, Polaris, Compose.

Of the five that document a form of `role="switch"`, three use a button and two use a native input.

**Change handler.** The split follows the element, as with Checkbox. `onChange(event)` on native-input systems: MUI, Mantine, Atlassian (plus an analytics argument), Fluent (event plus `{checked}`), Polaris (DOM event). `onCheckedChange(boolean)` on headless or button systems: Radix, Chakra, Compose. `onChange(boolean)`: Spectrum, Primer, Ant (value first, event second). `onToggle(boolean)`: Carbon.

**Switch versus checkbox.** The guidance that exists points one way.

- Immediate effect: Carbon says a toggle is for a single binary setting that applies at once, and to use a checkbox with a button when a change needs confirmation (S10). Atlassian says the same, and adds that the toggle does not work inside its form component by default, because it is meant to apply at once (S12). Polaris: apply changes instantly; use a checkbox for explicit submission; do not pair a switch with a save button (S14). Android Material: effects start immediately, without saving (S2). Ant: "state change directly" for a switch, a checkbox for state marking (S3). Primer: "immediately toggle a setting" (S11). NN/g: take effect at once, and do not mix with a form that needs a submit (S24).
- Spectrum frames it by purpose, not timing: a switch for activation, a checkbox for selection. It also says switches cannot show an error state (S9).
- MUI says switches toggle a single setting and prefers them for mobile settings, and it does not address immediacy (S1). Mantine, shadcn, Chakra, Radix, Fluent and Compose: none documented.

So the guidance is about the usage context, not the control. The element is the same family, and a native checkbox with `role="switch"` posts in a form just like a checkbox.

**Pending.** Three systems have an async state: Ant `loading`, Atlassian `isLoading` (a spinner inside the toggle), Primer `loading` with `loadingLabel` and a 2000 ms announce delay. Primer's accessibility page says the spinner is not conveyed to screen readers and must be announced separately (S11). Primer also blocks the click while loading. Carbon's "skeleton" is a first-load placeholder, not an in-flight toggle. The other ten rows document nothing.

**Size.** Documented by 9 systems, each its own scale: Mantine `xs` to `xl`, Chakra `xs` to `lg`, Radix Themes `"1"` to `"3"`, Carbon `sm` / `md`, Primer `small` / `medium`, Fluent `small` / `medium`, Ant `medium` / `small`, Atlassian `regular` / `large`, MUI `small`. Compose, Spectrum, Radix Primitives and Polaris: none documented. shadcn shows two.

**Invalid.** Five systems have something: Chakra `invalid`, Mantine `error`, Polaris `error`, shadcn `aria-invalid`, Spectrum `isInvalid` (but contradicted by its own page). Android, Carbon, Primer, Atlassian, Fluent, Ant, MUI, Radix: none documented.

**Disabled and readOnly.** `disabled` everywhere (`isDisabled` in Atlassian and Spectrum, `enabled` in Compose). `readOnly`: Mantine, Chakra, Carbon, Spectrum (`isReadOnly`). Fluent offers `disabledFocusable`. Atlassian's disabled toggle leaves the tab order. Carbon's read-only stays focusable and passes contrast.

**Mixed state.** No system opened offers one on a switch. MDN's `switch` role page says `aria-checked` is required with values `true` and `false`, and that `mixed` is treated as `false` (S20). The APG pattern describes only `true` and `false` (S21). MDN's checkbox page says that on a native `switch` the `:indeterminate` pseudo-class never matches (S16). WebKit says the same (S19).

## Accessibility notes

- **MUI**: "All form controls should have labels"; without a visible label use `aria-label` via `slotProps.input` (S1).
- **Material**: Android passes the text to accessibility services and says extra content labels are usually unnecessary. Compose: no section (S2).
- **Ant**: no guidance on the page (S3).
- **Mantine**: set `aria-label` when there is no `label`; a bare `<Switch />` is shown as wrong (S4).
- **shadcn**: only `aria-invalid` is documented (S5).
- **Radix Primitives**: follows the ARIA switch role; Space and Enter both toggle. Enter works through the button's native click (S6).
- **Radix Themes**: label-wrapper pattern only; `highContrast` helps in light mode only (S7).
- **Chakra**: the Root `label` prop is for accessibility strings. No ARIA or keyboard detail (S8).
- **Spectrum**: provide a visible label, otherwise `aria-label`, or `aria-labelledby`. The React Aria examples include `forced-colors` styles and `data-focus-visible` rings (S9).
- **Carbon**: Tab to focus, Enter or Space to change. Both the switch and its label are clickable. Read-only keeps the control focusable (S10).
- **Primer**: `aria-labelledby` is required. The label is permanent and visible. Space toggles. The spinner is not announced, so announce loading separately. Status text needs 4.5:1 (S11).
- **Atlassian**: associate the label with `id` and `htmlFor`; explain why a disabled toggle is unavailable, with visually hidden text; `descriptionId` for `aria-describedby` (S12).
- **Fluent**: the native input needs no extra ARIA; the indicator is `aria-hidden`; disabled switches take no focus unless `disabledFocusable` (S13).
- **Polaris**: `details` and `error` are announced; `labelAccessibilityVisibility="exclusive"` hides the label visually and keeps it for screen readers (S14).

**Standards and platform facts.**

- **WAI-ARIA APG switch pattern**: role `switch`; Space changes the state (required), Enter optionally. If the switch is an HTML `input[type="checkbox"]`, use the native `checked`, not `aria-checked`. The label does not change with the state. The accessible name comes from content, `aria-labelledby` or `aria-label` (S21).
- **MDN `switch` role**: `aria-checked` is required; `mixed` is treated as `false`; `aria-readonly` is supported (S20).
- **ARIA in HTML**: `input type=checkbox` allows the roles `menuitemcheckbox`, `option` and `switch`. "Authors MUST NOT use the aria-checked attribute" on it; use `checked` (S22). Read through the first 100000 of 172302 characters of the page; the checkbox row was within that range.
- **WCAG 1.4.1 Use of Color (A)**: colour must not be the only visual means of conveying information. A lightness difference counts as another distinction when it reaches 3:1; a cue that depends on telling hues apart needs an additional indicator (S25).
- **WCAG 1.4.11 Non-text Contrast (AA)**: 3:1 for the visual cues that show a control exists and for state indicators; inactive (disabled) components are exempt. This is the summary in `docs/naming/checkbox.md` (S17 there), opened on 2026-10-30 and not re-read for this study. Whether the on/off fill difference itself needs 3:1 is the owner's stricter reading; this study did not re-open the WCAG text to see whether it requires it.
- **WCAG 1.3.1 and 4.1.2 (A)**: programmatic label; name, role and state exposed. Not re-read.
- **MDN `readonly`**: the attribute applies to text-like inputs, `date`-like inputs and `number`. It does not apply to `checkbox`. The page also notes that disabled controls cannot receive focus and are not submitted with the form (S23).

### The HTML `switch` attribute

| Fact                                                                                                                     | Source |
| ------------------------------------------------------------------------------------------------------------------------ | ------ |
| Syntax: boolean attribute `switch` on `<input type="checkbox">`.                                                          | S16, S19 |
| Safari 17.4 and Safari on iOS 17.4 (released 2024-03-05). Chrome, Chrome Android, Edge, Firefox, Firefox Android: **not supported**. Baseline status "Limited availability". Chromium tracking bug 41484737. | S17 |
| MDN calls it "experimental" with "limited browser support"; its own compat table did not render in the fetched text, so MDN gave no versions. | S16 |
| Where unsupported, "the attribute is ignored": a normal checkbox. `checked`, `name`, `value` and form submission behave as a checkbox. | S16, S19 |
| WebKit: exposes the ARIA `switch` role, announces On/Off. MDN's wording is that it "allows user agents to expose `switch` ARIA semantics"; its technical summary still lists the implicit role as `checkbox`. | S19, S16 |
| `:indeterminate` never matches a switch.                                                                                  | S16, S19 |
| `appearance: none` gives full styling control; with default appearance only `accent-color` applies (to the track). `::thumb` and `::track` are behind a flag. | S19 |
| Chrome's own guide recommends the attribute plus a `<label>`, and a polyfill (`input-switch-polyfill`) loaded only after feature detection; the polyfill sets `role="switch"`. The guide does not say whether native support does. | S18 |
| Spec: the WHATWG pull request 9546 is the linked specification. The HTML Standard's own text was not found in the part of the page read (the first 100000 of 317535 characters). **Not verified** that it is merged. | S17 |
| React: `@types/react` 19.3.0 has no `switch` attribute on any HTML element (the only `switch` key is the SVG tag at line 4438). React 19.3.1 server-renders `switch=""` as an attribute; `switch={true}` logs "Received `true` for a non-boolean attribute" and is dropped. Checked locally with `renderToStaticMarkup`. | local check |
| caniuse: the search page returned an entry title but no per-browser data. Not used.                                       | S26    |

## Options for Omnia

Two accepted ADRs constrain every option (same as `docs/naming/checkbox.md`):

- **ADR 0015**: a prop named like an attribute of any HTML element keeps its native type and meaning. A colliding variant axis becomes `variant<Axis>`. A colliding non-variant prop gets a non-native name. `src/native-prop-names.check.ts` fails `pnpm typecheck` otherwise.
- **ADR 0016**: form atoms are display only. `invalid` becomes `aria-invalid`; native props and `ref` pass through; the atom ships no error text and no validation.

Names checked in `node_modules/@types/react/index.d.ts`:

- **Native** (so they keep the native type): `size` (`number`, on `input`, `select`), `label` (`string`, on `option`, `optgroup`, `track`), `loading` (`"eager" | "lazy"`, on `img`, `iframe`), `readOnly` (`boolean`), `checked`, `defaultChecked`, `disabled`, `required`, `name`, `value`, `children` (`ReactNode`), `title`, `content`.
- **Not native** (no attribute of that name on any HTML element type): `variantSize`, `invalid`, `pending`, `stateText`, `onLabel`, `offLabel`, `labelPosition`, `labelPlacement`, `onCheckedChange`, `indeterminate`, `thumbIcon`, `hideLabel`.
- `switch` as an attribute: absent from the types (see above). `aria-*` and `role` are native by definition and pass through.

### Shared base for A, B and C

Native `<input type="checkbox">` inside a styled track, wrapped in a root `<label>`, as `Checkbox` is.

| Prop                                                  | Type                                    | Native name?                                              | Where it lands                                                                                     |
| ----------------------------------------------------- | --------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `variantSize`                                         | `'sm' \| 'md' \| 'lg'` (`SwitchSize`)   | `size` is native, so renamed (as `Input`, `Checkbox`, `Button`) | root `data-size`                                                                             |
| `invalid`                                             | `boolean`                               | no                                                        | `aria-invalid="true"` on the input, `data-invalid` on the root; a caller's own `aria-invalid` wins |
| `children`                                            | `ReactNode`                             | native name, `ReactNode` type, same meaning               | the visible label inside the root `<label>`; never reaches the input                               |
| `checked`, `defaultChecked`                           | `boolean`                               | native, unchanged                                         | the input                                                                                          |
| `disabled`, `required`, `name`, `value`, `onChange`, `onBlur` | native                          | native, unchanged                                         | the input                                                                                          |
| `ref`                                                 | `Ref<HTMLInputElement>`                 | native name                                               | the input (ADR 0016)                                                                               |
| `className`, `style`                                  | native                                  | native name, root target (as `Checkbox`)                  | the root                                                                                           |
| `role`                                                | native `string`, left in the type       | native name, same meaning                                 | the atom sets `role="switch"` before the spread, so a caller's `role` would win (as `aria-invalid`) |
| `type`                                                | not exposed                             | omitted, fixed to `checkbox`                              | n/a                                                                                                |
| `indeterminate`                                       | not offered                             | not a React prop                                          | none: ARIA `switch` has no mixed state (S20, S21)                                                  |

Other behaviour, common to the three: data attributes follow `Checkbox` (`data-scope="switch"`, `data-part`, `data-size`, `data-invalid`, `data-disabled`); no error text and no validation (ADR 0016); the visible track and thumb are drawn by CSS on the input (`appearance: none`) as `Checkbox` draws its box; no `readOnly` handling (see the devil's advocate).

### A. `Switch`, native input with `role="switch"`, nothing else

```tsx
<Switch name="notifications" defaultChecked>Email notifications</Switch>
<Switch aria-label="Dark mode" checked={dark} onChange={(e) => setDark(e.target.checked)} />
```

The shared base and no more props.

- Pro: the same shape as `Checkbox`: one rule for "the text of a control" (`children`, as `Button` and `Checkbox`). No new word, no new gate decision.
- Pro: native `checked`, `name`, `value`, `required`, `onChange` and `ref` reach the input, which is what ADR 0016 and React Hook Form's `register` need. ARIA in HTML allows `role="switch"` on this input and says to use `checked`, not `aria-checked` (S22).
- Pro: Mantine and Fluent ship the same element (S4, S13).
- Con: only two of the fifteen rows document this element. The three button-based systems are the better-known ones (S3, S6, S10).
- Con: how screen readers announce `<input type="checkbox" role="switch">` was not tested here.
- Con: no state text and no pending state, so a consumer needing either builds it outside the atom.

### B. A, plus `pending` and `stateText`

```tsx
<Switch name="sync" pending={saving} stateText>Sync</Switch>
```

| Extra prop  | Type      | Native name? | Where it lands                                                                                                 |
| ----------- | --------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| `pending`   | `boolean` | no (`loading` is native on `img` and `iframe`, so ADR 0015 rule 3 gives `pending`, as `Button`) | `aria-busy="true"` on the input, `data-pending` on the root, a spinner in the thumb |
| `stateText` | `boolean` | no           | a `<span aria-hidden="true">` beside the track showing `t('switch.on')` or `t('switch.off')`                    |

Strings to add to `src/translations/en.ts` and `fr.ts`: `switch.on`, `switch.off`, and (for the announcement) `switch.loading`, as `button.loading` exists for `Button`. French values are the owner's to pick.

- Pro: Ant, Atlassian and Primer all ship a pending state; Carbon, Primer and Mantine ship state text, hidden from assistive technology. This is the closest to what the market ships.
- Pro: the on/off cue is then not only thumb position and colour. NN/g recommends On/Off descriptors (S24).
- Con: `pending` needs a design decision A does not: `disabled` removes the control from the form post and from focus (S23), so `Button`'s "disabled while pending" is wrong here. The alternatives are `aria-disabled` plus blocking the click, or `aria-busy` alone. How assistive technology treats `aria-busy` on a switch is not verified. Primer says the spinner is not conveyed and needs a separate announcement (S11), which means a live region in an atom.
- Con: `stateText` adds text that needs 4.5:1 contrast (S11) in all four theme and skin modes, in a pixel skin with a small font. It adds two translated strings to a library where only `button.loading` exists.
- Con: a variant, B2, replaces the built-in strings with consumer-supplied `onLabel` / `offLabel` (`ReactNode`, not native), as Mantine does. No Omnia string, no `t()`, but the consumer owns the translation and the contrast.
- Con: both props are speculative today: nothing in the repo asks for them.

### C. A, with the native `switch` attribute

The atom renders `<input type="checkbox" switch role="switch">`, or `switch` alone.

- Pro: the platform's own answer. Safari exposes the switch role natively (S19). Non-supporting browsers treat it as a checkbox (S16), so it degrades.
- Pro: if Chrome and Firefox ship it, the markup is already right.
- Con: Safari 17.4 and later only (S17). Chrome, Edge and Firefox ignore it, so in those browsers the attribute does nothing. With `switch` alone those browsers expose a plain `checkbox`; to get a switch role there `role="switch"` is needed anyway, and then the attribute is redundant everywhere.
- Con: `@types/react` has no `switch` attribute (checked). A cast or a module augmentation is needed, and React 19.3.1 only renders it with a string value (`switch=""`).
- Con: with `appearance: none`, which the atom needs for its own skins, Safari's native switch rendering is off. What Safari then exposes for the role is not verified.
- Con: MDN marks it experimental, and the HTML Standard's merge is not verified here.

### D. `<button role="switch" aria-checked>` with a hidden input

```tsx
<Switch name="notifications" checked={on} onCheckedChange={setOn}>Email notifications</Switch>
```

| Prop                                     | Type                                  | Native name? | Where it lands                                                         |
| ---------------------------------------- | ------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| `checked`, `defaultChecked`              | `boolean`                             | native       | the button's `aria-checked`                                            |
| `onCheckedChange`                        | `(checked: boolean) => void`          | no           | called on click and Space                                              |
| `name`, `value`, `required`, `disabled`  | native                                | native       | a hidden `<input type="checkbox">` (form post) and the button          |
| `ref`                                    | `Ref<HTMLButtonElement>`              | native name  | the button                                                             |

- Pro: the most common element among the systems that document `role="switch"`: Radix, Carbon, Ant (S3, S6, S10). The `role` is set by the author, not inferred by the browser.
- Con: it breaks ADR 0016's premise that `ref`, `name`, `onChange`, `onBlur` and `required` reach one real input. React Hook Form's `register` reads the value through the DOM `ref`; a hidden input cannot be focused on error.
- Con: Radix renders the hidden input only inside a form (S6) and Primer renders none at all (S11), so form participation is the weak point of this family.
- Con: the atom has to handle Space, Enter and `aria-checked` itself. `Switch` could not copy `Checkbox`'s ref, label and CSS.
- Con: `onChange` is no longer the native event. `onCheckedChange` is a new word.
- Listed for completeness. It conflicts with the owner's constraint that atoms stay native HTML.

## Recommendation

Opinion, built on the facts above: **take option A. Name it `Switch`. Element: native `<input type="checkbox">` with `role="switch"` set by the atom, in a root `<label>`, `children` as the label.** `variantSize`, `invalid`, native props and `ref` as in the shared base. No `indeterminate`. No `pending`, no `stateText`, no `labelPosition` in the first version. The label is on the inline-end side of the track.

Answers, one per sub-question:

1. **Name.** `Switch`: 11 of 15 rows, the ARIA role name, the HTML attribute name, the platform name, and Fluent's replacement of `Toggle`. `Toggle` is two rows and `ToggleSwitch` is one.
2. **Element.** Native input plus `role="switch"`. ARIA in HTML allows the combination and says to use `checked` (S22). The `switch` attribute is Safari-only and not typed in React (S17, local check): not now. `<button role="switch">` conflicts with ADR 0016 and with the native-atoms rule. Form participation is the `Checkbox` one: `name` and `value` post when checked, since a switch on this element is a checkbox to the form.
3. **Label.** `children`, as `Checkbox`, with the whole row as the click target. Label at the end (logical start-to-end order, so right in LTR). A `labelPosition` prop is deferred; Fluent and Mantine show the name. State text is not built in: thumb position is the non-colour cue, the label does not change with the state (S21), and AT gets the state from the role. If the owner wants redundancy, a check mark in the thumb for the on state (Carbon small, Android `thumbContent`, Mantine `thumbIcon`) costs no string and no contrast pair on text.
4. **Semantics.** The sources agree that a switch changes a setting at once, and a checkbox is submitted (S2, S3, S10, S12, S14, S24). Omnia's atom is display only (ADR 0016): it cannot enforce this, so the usage rule goes in the MDX: use `Switch` for a setting that applies at once, `Checkbox` for a choice submitted with a form. The atom still carries native `name` and `value`.
5. **Pending.** Not in the first version: three of fifteen rows have it, and the correct behaviour on a native input (not `disabled`) is a separate design. If added, the name is `pending`, as `Button`.
6. **Sizes, invalid, disabled, readOnly, mixed.** `variantSize: 'sm' | 'md' | 'lg'`, as the other atoms. `invalid` as ADR 0016 fixes it. `disabled` native. `readOnly`: see below. No mixed state (S20, S21, S16).

Devil's advocate on that pick:

- **The element evidence is thin.** Two systems ship the native input with the role; three ship a button. I picked A on Omnia's own rules (native atoms, ADR 0016), not on the survey. A button-based switch is the majority choice among systems that document the role.
- **Screen-reader behaviour is not verified.** Nothing in this study ran `<input type="checkbox" role="switch">` through a screen reader or the accessibility tree. The build has to check the tree, and the a11y gate (ADR 0006) runs axe on every mode.
- **`role` is overridable.** If `role="switch"` is set before the spread, a caller can replace it and silently get a checkbox again. If it is set after, `role` is no longer a pass-through. I recommend before the spread, as `aria-invalid` is; the choice is the owner's.
- **`switch` attribute: wait or skip?** If Chromium and Firefox ship it, the native control is better than a styled input. As of the sources it is Safari-only, and the Chromium bug status was not read. Revisit later; it is a non-breaking addition.
- **Immediate effect is documentation, not code.** A `Switch` inside a form with a submit button breaks Atlassian's and NN/g's guidance (S12, S24), and Omnia's atom allows it. If the owner wants the rule enforced, that is a `FormField` concern, not an atom concern.
- **`children` hides a missing label.** As in `Checkbox`: empty children render a nameless input, and the types do not flag it. Mantine's page marks a bare `<Switch />` as wrong (S4). The label matters more here than for a checkbox, since a switch has no text in or beside the track by default.
- **No state text means a colour-and-position cue only.** WCAG 1.4.1 allows a lightness difference of 3:1 as an additional distinction, and a thumb that moves is a shape cue (S25); that is my reading, the study did not test it. In the pixel skin, with 3:1 for the track edge against the surface and for the thumb against the track in both states, the on/off difference has to be checked in all four modes. `src/styles/contrast.test.ts` covers tokens, not this pair.
- **`invalid` on a switch is thin.** Spectrum says a switch cannot show an error state (S9), Android has none, and Carbon, Primer, Fluent, Atlassian have none documented. ADR 0016 names `Switch` as a taker of `invalid`, so A keeps it. Whether `aria-invalid` is supported on role `switch` was not verified.
- **`readOnly` is a trap, and `Checkbox` has it too.** MDN says `readonly` does not apply to a checkbox (S23), yet `InputHTMLAttributes` types `readOnly` and the atom passes it to the input, where it does nothing. Carbon, Mantine, Chakra and Spectrum implement a real read-only. ARIA `switch` supports `aria-readonly` (S20). Options for the owner: implement it (block the toggle, set `aria-readonly`; the name stays `readOnly`, a boolean, so the gate passes), or document that it is inert. Not decided here. Not tested in a browser.
- **Duplication.** `Switch` and `Checkbox` share the ref, the label, the sizes and most of the CSS. No system in the survey makes the switch a mode of the checkbox; Radix Themes calls it an alternative to the checkbox (S7). I kept two atoms. Whether to share internals is not decided here.
- **Name risk.** If the owner prefers the vocabulary of the in-house or Carbon-like systems, `Toggle` is a defensible name. The cost is that only two of fifteen rows use it, and a name that overlaps with a toggle button (my inference, not sourced).

Why not B now: it is the closest to the market, and it is also the only option with two untested behaviours (pending on a native input, state text contrast in the pixel skin). Both can be added later without breaking A's props.

Not decided here: the visual spec (track shape, thumb travel, pixel-skin thumb), RTL behaviour of the thumb, a `labelPosition` prop, `Switch.Group`, whether `readOnly` is implemented, French strings, whether types enforce an accessible name, how refs are shared with `Checkbox`, the touch target size.

## Decision

Option A (owner, 2026-10-31).

`Switch` takes the shared base only: `variantSize`, `invalid`, `children` (the label, after the track), native props and `ref` on the input; no `indeterminate`, `pending`, state text or `readOnly` handling.

## Sources

All opened 2026-10-31 unless noted.

- S1 MUI: https://mui.com/material-ui/react-switch/
- S2 Material: https://developer.android.com/develop/ui/compose/components/switch , https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/Switch.md , https://m3.material.io/components/switch/guidelines (title only)
- S3 Ant Design: https://ant.design/components/switch , https://raw.githubusercontent.com/react-component/switch/master/src/index.tsx
- S4 Mantine: https://mantine.dev/core/switch/ , https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/core/src/components/Switch/Switch.tsx
- S5 shadcn/ui: https://ui.shadcn.com/docs/components/switch
- S6 Radix Primitives: https://www.radix-ui.com/primitives/docs/components/switch , https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/switch/src/switch.tsx
- S7 Radix Themes: https://www.radix-ui.com/themes/docs/components/switch
- S8 Chakra: https://chakra-ui.com/docs/components/switch
- S9 Spectrum / React Aria: https://react-spectrum.adobe.com/react-spectrum/Switch.html , https://react-aria.adobe.com/Switch
- S10 Carbon: https://carbondesignsystem.com/components/toggle/usage/ , https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/Toggle/Toggle.tsx
- S11 Primer: https://primer.style/product/components/toggle-switch/ , https://primer.style/product/components/toggle-switch/accessibility/ , https://raw.githubusercontent.com/primer/react/main/packages/react/src/ToggleSwitch/ToggleSwitch.tsx
- S12 Atlassian: https://atlassian.design/components/toggle/usage , https://atlassian.design/components/toggle/code
- S13 Fluent UI v9 (GitHub source): https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-switch/library/docs/Spec.md , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-switch/library/src/components/Switch/Switch.types.ts
- S14 Polaris: https://shopify.dev/docs/api/app-home/polaris-web-components/forms/switch
- S15 GOV.UK: https://design-system.service.gov.uk/components/ , https://github.com/alphagov/govuk-design-system-backlog/issues?q=toggle+OR+switch (0 results; repository archived)
- S16 MDN `<input type="checkbox">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox
- S17 Web Platform Features Explorer, switch control: https://web-platform-dx.github.io/web-features-explorer/features/switch-control/
- S18 Chrome, "Build accessible switch controls": https://developer.chrome.com/docs/modern-web-guidance/guides/forms/switch
- S19 WebKit, "An HTML switch control": https://webkit.org/blog/15054/an-html-switch-control/
- S20 MDN ARIA `switch` role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/switch_role
- S21 WAI-ARIA APG switch pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- S22 ARIA in HTML: https://www.w3.org/TR/html-aria/ (first 100000 of 172302 characters read)
- S23 MDN `readonly`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly
- S24 NN/g, toggle-switch guidelines: https://www.nngroup.com/articles/toggle-switch-guidelines/
- S25 WCAG 2.1 Understanding 1.4.1: https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- S26 caniuse search (no data returned): https://caniuse.com/?search=input%20switch
- WCAG 1.4.11, 1.3.1 and 4.1.2: see S17-S19 of `docs/naming/checkbox.md` (opened 2026-10-30, not re-read here).

Could not open (404, empty, or title only): m3.material.io switch guidelines (title only), the Atlassian toggle source file (404), caniuse per-browser data, the MDN compat table for `input` `switch` (placeholder only), the HTML Standard's checkbox section (the fetched text was truncated before it), a GOV.UK statement on switches (none found). Not opened: Base UI's Switch docs (behind the shadcn default), the Compose `material3` package reference, the Component Gallery, Fluent v9 Storybook, Apple HIG (out of scope). Not tested: any browser, screen reader or accessibility tree.
