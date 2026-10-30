# Naming study — single-line text input

Date: 2026-10-30. Method: official docs opened during this study. "None documented" means the pages opened do not mention it, not that the system lacks it. "Not verified" means no usable page was opened. Page text was read through a fetch tool that summarises each page, so quotes are short and cell values are as reported by that summary.

## Question

Omnia needs a bare single-line text control (an atom). A `FormField` molecule (label + hint + error message, wired by React Context) is already planned, so the atom is the control only. What should it be called, and what should its props be called? Four sub-questions:

- Is the common name the bare control or a bundle with label, hint and error?
- Where does the label/hint/error bundle live, and what is that wrapper called?
- Is multi-line a separate component or a prop?
- Are password, search and number separate components or `type` values?

## Survey

### Table 1 — names and structure

| System          | (1) Name: bare or bundle                                  | (2) Label/hint/error lives in            | (3) Multi-line                          | (4) Password / search / number                                   | Src |
| --------------- | --------------------------------------------------------- | ---------------------------------------- | --------------------------------------- | ---------------------------------------------------------------- | --- |
| MUI             | `TextField` = bundle; bare = `Input`, `OutlinedInput`     | `TextField`; or `FormControl` + parts    | `multiline` prop on `TextField`         | `type`; number: separate Number Field; password, search: none    | S1  |
| Material (M3)   | Compose `TextField` (+ `OutlinedTextField`)               | Compose: `label` param; Views: layout    | Compose: `lineLimits`; Views: none      | password: `SecureTextField` (Compose); others none documented    | S2  |
| Ant Design      | `Input` = bare                                            | `Form.Item`                              | `Input.TextArea` (sub-component)        | `Input.Password`, `Input.Search`; `InputNumber` separate         | S3  |
| Mantine         | `TextInput` = bundle; `Input` = base, not for direct use  | `TextInput` (via `Input.Wrapper`)        | `Textarea` (separate)                   | `PasswordInput` separate (or `type`); number, search: not verified | S4  |
| shadcn/ui       | `Input` = bare                                            | `Field` + `FieldLabel` + `FieldError`    | `Textarea` page in sidebar, not opened  | only `type="file"` shown; others none documented                 | S5  |
| Radix Themes    | `TextField.Root`                                          | none documented                          | `TextArea` (separate)                   | none documented                                                  | S6  |
| Chakra UI       | `Input` = bare                                            | `Field.Root` + `Field.Label` + parts     | `Textarea` (separate)                   | `type` values not listed; `PasswordInput`, `NumberInput` named only in nav | S7  |
| Fluent UI v9    | `Input` = bare                                            | `Field`                                  | `Textarea` (separate)                   | `type` limited to text-like values; others none documented       | S8  |
| Atlassian       | "Text field" = bare                                       | `Field` (Form) + separate label          | "Text area" (separate)                  | password, number: no guidance; search: placeholder rule only     | S9  |
| Shopify Polaris | `s-text-field` = bundle                                   | `s-text-field` (`label`, `details`, `error`) | `s-text-area` (separate)            | password and search fields are separate; number: not mentioned   | S10 |
| GitHub Primer   | `TextInput` = bare                                        | `FormControl`                            | `Textarea` (separate)                   | `type="number"` mentioned; password, search: none documented     | S11 |
| IBM Carbon      | "Text input" = bundle                                     | built in (`labelText`, `helperText`)     | `TextArea` (separate)                   | `PasswordInput`, `Search`, `NumberInput` separate in React       | S12 |
| Adobe Spectrum  | `TextField` = bundle (React Aria: wrapper + `Input`)      | `TextField` (`label`, `description`, `errorMessage`) | `TextArea` (separate)       | `SearchField`, `NumberField` separate; `type` has password       | S13 |
| GOV.UK          | "Text input" = bundle                                     | built in (`label`, `hint`, `errorMessage`) | "Textarea" (separate)                 | number: `inputmode`, avoid `type="number"`; others none         | S14 |
| Apple HIG       | not verified                                              | not verified                             | not verified                            | not verified                                                     | S15 |

### Table 2 — props

| System          | Size scale                          | Invalid state                                    | Prefix / suffix adornments                                | Src |
| --------------- | ----------------------------------- | ------------------------------------------------ | --------------------------------------------------------- | --- |
| MUI             | `size` (only `"small"` shown)       | `error` (+ `helperText`)                         | `InputAdornment`; `startAdornment` not named on the page  | S1  |
| Material (M3)   | none documented                     | Views: `setError()`; Compose: not covered        | Views: `prefixText`, `suffixText`, `startIconDrawable`    | S2  |
| Ant Design      | `size`: large, medium, small        | `status`: `error` or `warning`                   | `prefix`, `suffix`; `addonBefore/After` deprecated        | S3  |
| Mantine         | `size`: xs, sm, md, lg, xl          | `error` (boolean or node)                        | `leftSection`, `rightSection`                             | S4  |
| shadcn/ui       | none documented                     | `aria-invalid` on `Input`; `data-invalid` on `Field` | `InputGroup`                                          | S5  |
| Radix Themes    | `size`: "1", "2", "3"               | none (no invalid or error prop)                  | `TextField.Slot` with `side` left or right                | S6  |
| Chakra UI       | `size`: 2xs to 2xl                  | `invalid` on `Field.Root`                        | `InputGroup` with `startElement`, `endElement`            | S7  |
| Fluent UI v9    | `size`: small, medium, large        | `validationState` on `Field` (error, warning, success, none) | `contentBefore`, `contentAfter`          | S8  |
| Atlassian       | none documented (`appearance` only) | `isInvalid`                                      | `elemBeforeInput`, `elemAfterInput`                       | S9  |
| Shopify Polaris | not covered on the page             | `error` (string)                                 | `prefix`, `suffix`, `icon`                                | S10 |
| GitHub Primer   | `size`: small, medium, large        | `validationStatus`: error or success             | `leadingVisual`, `trailingVisual`, `trailingAction`       | S11 |
| IBM Carbon      | xs 24px, sm 32px, md 40px, lg 48px  | `invalid` + `invalidText`; also `warn`           | none documented                                           | S12 |
| Adobe Spectrum  | no size prop (dimension props only) | `isInvalid`; v3 also `validationState`           | `icon` only                                               | S13 |
| GOV.UK          | widths, not heights (`govuk-input--width-N`) | `errorMessage` param                    | `prefix`, `suffix` params                                 | S14 |
| Apple HIG       | not verified                        | not verified                                     | not verified                                              | S15 |

Notes on cells:

- Atlassian: the opened pages call it "Text field". The exact code identifier was not on the pages, so `Textfield` is not confirmed here (S9).
- MUI: `type="number"` is discouraged on the page, which points to Number Field built on Base UI (S1). Password and search appear only as demo labels.
- MUI: the `TextField` page lists FormControl, Input, FilledInput, InputLabel, OutlinedInput and FormHelperText as the parts `TextField` is composed of. `InputBase` is not in that list (S1).
- Material: the m3.material.io pages returned only a title. Rows use the Android Compose and Material Android docs (S2). Compose `supportingText`, `isError`, icons and prefix/suffix are not on the page opened.
- Mantine: `TextInput` page says "Input" is a base and "you should not use Input in your application" in most cases (S4). `NumberInput` and search were not opened.
- shadcn: `Textarea` is only a sidebar entry on the pages opened (S5). Sizes are not mentioned.
- Chakra: the `Input` page does not mention an `invalid` prop. `invalid` lives on `Field.Root` (S7).
- Fluent: `Input` has no built-in label; `Field` supplies label, hint and validation message (S8).
- Carbon: the usage page calls Password a "modifier" with a visibility toggle, while the React Storybook prop list names `PasswordInput` as a separate component. The two sources disagree (S12). The `TextArea` usage page returned 404; the text input page describes text area as the multi-line variant.
- Spectrum: React Spectrum v3 has no `size` prop; React Aria has `Input` and `TextArea` as children of a `TextField` wrapper (S13).
- GOV.UK: prefix and suffix are hidden from screen readers, so the unit goes in the label (S14).
- Apple: the HIG page returned only a title or a 404. Search snippets (not opened pages) suggest HIG treats placeholder as a hint and wants a separate label, but this is not verified (S15).
- The Component Gallery lists these names for the same component: Input (the most common), Text input, Text field, TextField / Textfield, TextInput, Input field, Input text, Text box, Text Field Wrapper (S16).

## Patterns observed

Of the 15 systems, 14 gave a usable answer for (1). Apple did not.

**Name of the bare control.** Bare control and bundle are often the same word, so the name alone does not say which one you get.

1. **`Input`**: bare control. Ant, shadcn, Chakra, Fluent (4 systems). MUI and Mantine also have an `Input`, but it is the low-level part, not the main entry point.
2. **`TextField` / `s-text-field`**: bundle in MUI, Spectrum, Polaris. Radix uses `TextField.Root` with no label parts documented.
3. **`TextInput` / "Text input"**: bundle in Mantine, Carbon, GOV.UK. Bare in Primer.
4. **"Text field"** in Atlassian: bare control with a separate Field.

So the word does not predict the structure. The 6 bundle systems are MUI, Mantine, Polaris, Carbon, Spectrum, GOV.UK. The 6 bare-plus-wrapper systems are Ant, shadcn, Chakra, Fluent, Atlassian, Primer. Material has a `label` slot inside its text field in Compose, so it leans to bundle. Radix documents neither.

**Wrapper names** (bare-plus-wrapper systems and bundle systems that also expose the parts):

- `Field`: shadcn, Chakra (`Field.Root`), Fluent, Atlassian (4)
- `FormControl`: Primer, MUI (2)
- `Form.Item`: Ant (1)
- `Input.Wrapper`: Mantine (1)

None of the opened pages uses the name `FormField`. It is a direct equivalent of `Field` and `FormControl`.

**Multi-line.** 11 of 15 systems document a separate component (Ant as a sub-component `Input.TextArea`). MUI is the only one that uses a prop (`multiline`), and MUI also ships a separate `TextareaAutosize` utility. Compose uses a `lineLimits` setting instead of a separate component. Not verified for Material Views and Apple.

**Password, search, number.**

- Number is the type most often split out: Ant `InputNumber`, MUI Number Field, Spectrum `NumberField`, Carbon `NumberInput`. GOV.UK and MUI both advise against `type="number"` (GOV.UK recommends `inputmode`). Atlassian, Mantine and Polaris pages give no number rule.
- Password: separate in Ant, Mantine, Carbon (React), Polaris, Compose. A `type` value in Spectrum / React Aria. Mantine says `TextInput` with `type="password"` also works if no toggle is needed.
- Search: separate in Ant, Spectrum, Carbon, Polaris.
- No system in the sample makes the three separate atoms and also drops `type`. The usual split is: a few `type` values (text, email, url, tel, password) on the main control, and number and search as their own components.

**Size.** 7 systems document a scale (MUI names only `small`). Three-step small/medium/large or sm/md/lg: Ant, Fluent, Primer, Carbon (plus xs). Longer: Mantine xs to xl, Chakra 2xs to 2xl. Radix uses "1" to "3". Spectrum and GOV.UK use dimensions or widths, not a size scale. MUI documents only `size="small"`. Omnia's `Button` already uses `sm`, `md`, `lg`.

**Invalid state.** Names split four ways.

- `invalid` / `isInvalid` (boolean): Chakra, Atlassian, Spectrum, Carbon (with `invalidText` for the message).
- `error`: MUI (boolean, paired with `helperText`), Mantine and Polaris (accept a message, not only a boolean).
- `status` / `validationStatus` / `validationState`: Ant, Primer, Fluent, Spectrum v3. These carry more than two values (warning, success).
- Native attribute only: shadcn (`aria-invalid`), with `data-invalid` on the wrapper for styling.

Radix documents no invalid prop.

**Adornments.** No two systems agree on a name that is not on this list.

- `prefix` / `suffix`: Ant, Polaris, GOV.UK. Material Views uses `prefixText` / `suffixText`. In Polaris and GOV.UK these are text, not icons.
- `leftSection` / `rightSection`: Mantine.
- `startElement` / `endElement`: Chakra (on `InputGroup`).
- `contentBefore` / `contentAfter`: Fluent.
- `elemBeforeInput` / `elemAfterInput`: Atlassian.
- `leadingVisual` / `trailingVisual`: Primer.
- `InputAdornment`: MUI. `TextField.Slot`: Radix. `InputGroup`: shadcn.
- Carbon: none documented. Spectrum: `icon` only.

## Accessibility notes

- **MUI**: link the input to its label and helper text with `for`/`id` and `aria-describedby`. A `TextField` needs a unique `id`, or it has no associated label until hydration. The page does not discuss placeholder as label (S1).
- **Material (Android)**: label (hint) and helper text are "strongly encouraged". Error text is announced by default as a polite live region (S2).
- **Ant**: no label or aria guidance on the Input page; `OTP` has an `autoComplete` prop (S3).
- **Mantine**: without a `label`, the input is not announced properly; `aria-label` is an alternative. On `Input`, with `Input.Wrapper`, set `id` on both. `aria-describedby` and `aria-invalid` are not covered on the pages opened (S4).
- **shadcn**: set `aria-invalid` on the input itself "for assistive technologies". `htmlFor` must match `id`. `aria-describedby` and `role="alert"` do not appear (S5).
- **Radix Themes**: no label or aria guidance (S6).
- **Chakra**: no accessibility section on `Input` or `Field`; `aria-invalid` and `aria-describedby` not described (S7).
- **Fluent**: `Input` has no built-in label; use `id` + `htmlFor`, `aria-label` or `aria-labelledby`. `Field` sets `id`, `aria-labelledby`, `aria-describedby` (hint and message) and `aria-invalid` on the control when `validationState` is `error`. The validation message gets `role="alert"` in the error state (S8).
- **Atlassian**: "Make sure all fields have a visible label." "Don't use placeholder text", with an exception for search with an icon and an accessible label. Custom validation errors: validate on blur, use `aria-live` polite (S9).
- **Polaris**: `details` and `error` are announced to screen readers. `labelAccessibilityVisibility="exclusive"` hides the label visually but keeps it for screen readers. `autocomplete` is a prop (S10).
- **Primer**: a visible label is required; a hidden label only if equivalent visible text exists. Placeholder "is never an acceptable substitute for a label". Captions and validation are linked with `aria-describedby`. `validationStatus="error"` renders `aria-invalid="true"`. Invalid state must not be conveyed by colour alone. Personal-data inputs need `autocomplete` (S11).
- **Carbon**: visible label required unless exempted. Placeholder is not a label substitute. Helper text is exposed with `aria-describedby`. No details on `aria-invalid` or error announcement (S12).
- **Spectrum**: provide a visible `label`; otherwise "an `aria-label` must be provided". React Aria wires `aria-labelledby`, `aria-describedby`, `aria-errormessage`; `aria-invalid` is not named on the page. `autoComplete` is a prop (S13).
- **GOV.UK**: labels are required, usually visible, above the input. `aria-describedby` links the hint and error ids. Avoid placeholder text. Set `autocomplete` where an input purpose applies (cites WCAG 1.3.5). Do not disable paste (S14).
- **Apple**: not verified (S15).

**Standards.**

- **WCAG 1.3.1 Info and Relationships (A)**: structure must be machine-readable. The Understanding page recommends technique H44, a `label` element associated with the control (S17).
- **WCAG 3.3.1 Error Identification (A)**: the field in error is identified and the error is described in text (S17).
- **WCAG 3.3.2 Labels or Instructions (A)**: labels or instructions are provided when content requires input. The page does not mention placeholders, but says a label must be presented to all users, so an accessible name that only assistive technology reads may not satisfy it (S17).
- **WCAG 4.1.2 Name, Role, Value (A)**: controls expose name, role, state and value. Native controls do this by default (S17).
- **WCAG 1.3.5 Identify Input Purpose (AA)**: the purpose of fields collecting user data must be determinable, which `autocomplete` provides (S17).
- **WAI-ARIA APG**: no textbox or searchbox pattern among its 30 patterns; a Spinbutton pattern exists (S18). The APG names-and-descriptions page prefers a native `label` with `for`/`id`, uses `aria-describedby` for descriptions, and advises against relying on `placeholder` or `title`: a label "does not disappear visually when the user focuses the form control" (S18).

Common denominator: a visible, associated `label`; hint and error linked with `aria-describedby`; `aria-invalid` on the control when invalid; no placeholder as a label; `autocomplete` on personal-data fields. Only Fluent documents the error message being announced with `role="alert"`; Material Android documents a polite live region; Atlassian documents `aria-live` polite for custom validation. The rest are silent or undocumented on the pages opened.

## Options for Omnia

Shared base for every option: size `sm | md | lg` (same as `Button`), a boolean invalid prop, `disabled`, native `<input>` props passed through. Two traps from React's own types, checked in `node_modules/@types/react`: `InputHTMLAttributes` already has `size?: number` (the native visible-width attribute), and `HTMLAttributes` already has `prefix?: string` (an RDFa attribute). A custom `size` or `prefix` prop must `Omit` those keys.

**A. Bare `Input` now, `FormField` molecule later.**

```tsx
<FormField id="email">
  <FormField.Label>Email</FormField.Label>
  <Input type="email" />
  <FormField.Hint>…</FormField.Hint>
  <FormField.Error>…</FormField.Error>
</FormField>
```

Props: `size`, `invalid`, `startAdornment`, `endAdornment`, native `type` for text-like values.

- Pro: `docs/ARCHITECTURE.md` already names the `Input` atom and the `FormField` molecule, so this needs no doc change.
- Pro: same split as shadcn, Chakra, Fluent, Atlassian, Primer, Ant (6 systems). It fits the Context-based `FormField`, which wires `id` and `aria-describedby` into the control the way Fluent's `Field` does.
- Pro: `Input` is the most common name in the Component Gallery list (S16).
- Con: a bare `Input` used alone has no label. Nothing but docs and a story prevents an unlabelled field (the WCAG 3.3.2 and 1.3.1 risk). Users coming from the six bundle systems find no one-component path.
- Con: until `FormField` ships, the atom depends on the caller to wire `id` and `aria-describedby`.

**B. `TextField` as a bundle (label, hint, error built in).**

```tsx
<TextField label="Email" hint="…" error="…" type="email" />
```

- Pro: matches MUI, Spectrum, Polaris. One component, labelling cannot be forgotten.
- Con: duplicates the planned `FormField`, so `Select`, `Textarea` and others would each repeat the bundle, or `FormField` is dropped. That reverses the roadmap.
- Con: the bare control is then not available to build search bars or table filters, where the label is elsewhere.
- Con: `TextField` already names three different structures (MUI bundle, Radix `TextField.Root`, Compose `TextField`), so the name does not tell the structure (see Patterns).

**C. `TextInput` as the bare control.**

Same API as A, different name.

- Pro: reads unambiguously as a text control. Mantine and Primer use it (Primer's is bare, Mantine's is a bundle).
- Con: only two systems use it, with opposite structures. Longer than `Input`.
- Con: `ARCHITECTURE.md` would change. It buys one clarification (text, not checkbox) that `type` already gives.

**D. `Input` with an optional built-in `label` shortcut.**

```tsx
<Input label="Email" />
```

- Pro: one-line path for the simple case, like Fluent `Field label=` or Spectrum.
- Con: two ways to label the same control, and two places to maintain the aria wiring. No system in the sample offers both on the same bare component (Mantine's `TextInput` bundles, its `Input` does not).
- Con: breaks the "bare control" definition the roadmap already set.

## Recommendation

Opinion, built on the facts above: take option A. Name the atom `Input`, keep it bare, and put label, hint and error on `FormField` (a Context wrapper that gives the control its `id` and `aria-describedby`). Props: `size` (`sm | md | lg`), `invalid` (boolean), `startAdornment` / `endAdornment` (ReactNode), and `type` limited to text-like values (`text`, `email`, `url`, `tel`, `password`). Multi-line becomes a separate `Textarea` atom later. Number and search become their own components later if needed: MUI and GOV.UK both advise against `type="number"`. Set `aria-invalid` from `invalid`.

Devil's advocate on that pick:

- Six systems bundle the label, and the bundle is the safer default for people who forget the label. Option A makes the unlabelled field easy to write. The only guard is docs and a `FormField` story. A dev-mode warning when `Input` has no accessible name (no `aria-label`, no label from `FormField`) would close that gap, but it is extra code and the survey shows no precedent for it.
- `Input` is the most generic name in the list. It will also be read as `type="checkbox"` or `type="range"` unless the type is narrowed.
- `invalid` vs `error` vs `status` split the systems four ways. Boolean `invalid` leaves no room for `warning`, which Ant, Fluent and Carbon support. If warning is wanted later, it is a breaking change.
- Adornment names have no majority (see Patterns). `startAdornment` / `endAdornment` is not sourced: the MUI page opened does not name those props. It is a proposal to confirm, not a documented default.
- "`ARCHITECTURE.md` already says `Input`" is a reason of convenience, not evidence. It carries no weight against the survey if the owner prefers another name.

Not decided here: visual spec, whether `type="password"` includes a visibility toggle, character counter, clear button, and the exact `FormField` API.

## Decision

Option A, chosen by the owner on 2026-10-30: `Input` is the bare single-line control, the native
`<input>` plus optional start and end adornments. Label, hint and error live on a future `FormField`
molecule, which gets its own plan when its turn comes. Props: `size` (`sm | md | lg`), boolean
`invalid`, `startAdornment` / `endAdornment`, and `type` limited to `text | email | url | tel |
password`. Multi-line becomes a separate `Textarea` atom; number and search get their own components
if they are needed.

## Sources

All opened 2026-10-30.

- S1 MUI: https://mui.com/material-ui/react-text-field/ , https://mui.com/material-ui/react-textarea-autosize/ , https://mui.com/material-ui/react-number-field/
- S2 Material: https://developer.android.com/develop/ui/compose/text/user-input , https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/TextField.md
- S3 Ant Design: https://ant.design/components/input , https://ant.design/components/input-number
- S4 Mantine: https://mantine.dev/core/text-input/ , https://mantine.dev/core/input/ , https://mantine.dev/core/password-input/ , https://mantine.dev/core/textarea/
- S5 shadcn/ui: https://ui.shadcn.com/docs/components/input , https://ui.shadcn.com/docs/components/field
- S6 Radix Themes: https://www.radix-ui.com/themes/docs/components/text-field , https://www.radix-ui.com/themes/docs/components/text-area
- S7 Chakra: https://chakra-ui.com/docs/components/input , https://chakra-ui.com/docs/components/field , https://chakra-ui.com/docs/components/textarea
- S8 Fluent UI v9 (GitHub sources): https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-input/library/docs/Spec.md , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-field/library/docs/Spec.md , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-textarea/library/docs/Spec.md
- S9 Atlassian: https://atlassian.design/components/textfield/usage , https://atlassian.design/components/textfield/code , https://atlassian.design/components/textarea/usage , https://atlassian.design/components/form/examples
- S10 Polaris: https://shopify.dev/docs/api/app-home/polaris-web-components/forms/textfield
- S11 Primer: https://primer.style/product/components/text-input/ , https://primer.style/product/components/text-input/accessibility/ , https://primer.style/product/components/form-control/ , https://primer.style/product/components/textarea/
- S12 Carbon: https://carbondesignsystem.com/components/text-input/usage/ , https://carbondesignsystem.com/components/text-input/accessibility/ , https://react.carbondesignsystem.com/?path=/docs/components-textinput--overview , https://carbondesignsystem.com/components/search/usage/
- S13 Spectrum: https://react-spectrum.adobe.com/react-spectrum/TextField.html , https://react-aria.adobe.com/TextField , https://react-aria.adobe.com/TextField/useTextField
- S14 GOV.UK: https://design-system.service.gov.uk/components/text-input/ , https://design-system.service.gov.uk/components/textarea/
- S15 Apple HIG: none opened successfully (see below).
- S16 Component Gallery: https://component.gallery/components/text-input/
- S17 WCAG 2.1 Understanding: https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html , https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html , https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html , https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html , https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html
- S18 WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/patterns/ , https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/

Could not open (404, empty, or title only): Apple HIG text fields (developer.apple.com returned a title only; developer-mdn.apple.com returned "Page Not Found"), m3.material.io text-fields overview and guidelines (title only), Carbon text-area usage page (404). Not opened: shadcn Textarea page, Mantine NumberInput and search pages, Polaris `s-text-area`, `s-password-field` and `s-search-field` pages, Fluent v9 Storybook pages.
