# Architecture

How ds-neuter is laid out and why. Rules here are binding; the summaries in `CLAUDE.md` point at
this file for the detail.

## Folder layering

Atomic Design, strict:

```
src/
  styles/        tokens.css, reset.css, layers.css
  lib/           i18n.ts (t() + locale global + typed strings)
  translations/  en.ts, fr.ts
  components/
    atoms/       smallest building blocks (Button, Input, …)
    molecules/   small compositions of atoms (FormField, Card, …)
    organisms/   larger, self-contained sections (Dialog, AppHeader, …)
    templates/   page-level layout, no real content (DashboardTemplate)
```

A component only ever imports from its own layer or a **lower** one: molecules use atoms, organisms
use molecules and atoms, templates use everything. Never upward, never sideways within a layer
without a deliberate reason.

### Co-location

Everything a component needs sits in one folder, `components/<layer>/<Name>/`:

- `<Name>.tsx` — the component
- `<Name>.module.css` — its styles (semantic tokens only)
- `<Name>.stories.tsx` — the catalogue entry, with `play` where it earns one
- `<Name>.mdx` — bilingual authored prose
- `<Name>.test.tsx` — edge-case assertions on composed stories
- `<Name>.test.ts` — pure-logic tests (only when there is pure logic)
- `index.ts` — the public surface of the component

## Compound components — decision tree

Compound components are the default shape for anything with parts. Choose the mechanism by whether
the parts share state:

- **Shared state between parts** (open/close, selected value, validation status) → **React Context**.
  The parent owns the state and exposes it through a context the sub-parts consume. Examples:
  `Dialog` (open state, focus trap), `FormField` (id wiring, error state shared by label/input/hint).
- **No shared state**, parts are just a documented slot layout → **plain dot-notation**, no context.
  The parent attaches sub-components as static properties. Example: `Card.Header`, `Card.Body`,
  `Card.Footer` — purely structural.

Reach for Context only when there is genuinely shared state to carry. A context with nothing to share
is ceremony; use dot-notation instead.

## Token contract — two tiers

All tokens live in one file, `src/styles/tokens.css`, in two tiers:

1. **Primitive palette** — raw values, named by what they *are*: `--palette-cobalt`,
   `--palette-ink`, `--palette-space-4`, `--palette-radius-md`, `--palette-border-thick`,
   `--palette-font-sans`. The only place raw colour values exist.
2. **Semantic aliases** — named by what they *do*, referencing primitives: `--color-bg-surface`,
   `--color-text-primary`, `--color-border-focus`, `--radius-md`, `--shadow-raised`. The vocabulary
   spans four families: colour (`--color-*`), shape (`--radius-sm/md/lg`, `--border-width-regular/
   thick`, the flat `--shadow-raised`), and type (`--font-display` serif, `--font-sans` grotesk).
   The maximalist base aesthetic that fills these is recorded in ADR 0008.

**Components consume the semantic layer only.** No `*.module.css` may contain a raw `hex`, `rgb()`
or `hsl()` literal — a stylelint rule bans it (see ADR 0003). This is the fitness function that keeps
the contract real: a reskin changes tokens, never component CSS.

Themes and skins reassign **only the semantic layer** — they re-point `--color-*` / `--radius-*` /
`--shadow-*` at different primitives (or, for the pixel skin, at different values). Primitive names
and semantic names are both stable contracts; do not rename them.

The file is hand-authored now but shaped to be generated later (Style-Dictionary-style), so keep the
two tiers cleanly separated.

## Theming — two independent axes

Two orthogonal axes live on the **same preview root** element:

- **`theme` (light / dark)** → `@storybook/addon-themes` `withThemeByDataAttribute`, writing
  `data-theme="light|dark"`. Defaults to the viewer's `prefers-color-scheme`; the toolbar overrides.
- **`skin` (default / pixel)** → a **bespoke `globalTypes` decorator** writing `data-skin`.

Why two mechanisms: addon-themes exposes a single `theme` global, so a second axis cannot be another
addon-themes theme. A custom `globalTypes` global for `skin` is the correct way around that limit —
not a workaround to replace later. CSS selectors combine the two (`[data-theme][data-skin]`) to
resolve the semantic layer.

### Structural carve-out for the pixel skin

The pixel-art skin needs things that are **not colour/space tokens** and legitimately live in CSS,
not in `tokens.css`:

- the pixel `@font-face` declaration,
- `image-rendering: pixelated` on relevant surfaces,
- stepped multi-shadow stacks (faked hard pixel shadows),
- notched / stepped borders.

This is a **documented, deliberate** carve-out: these are structural style rules, not design tokens,
so forcing them through the token layer would distort it. Colour still comes from semantic tokens.

## CSS Modules + `@layer`

Styling is **CSS Modules + CSS custom properties + native `@layer`** — no Sass, no CSS-in-JS
(ADR 0002). The cascade-layer order is declared **once** in `src/styles/layers.css` (e.g. reset →
tokens → base → components → utilities) so specificity is predictable and a component never has to
fight the cascade.

## Tooling

- **ESLint** (flat config) + **Prettier** for TS/JS and formatting.
- **stylelint** for CSS, including the no-raw-color rule that enforces the token contract.
- **Vite** as the builder, **Storybook 10** (`@storybook/react-vite`) as the catalogue and test host.

See `docs/adr/` for the decisions behind these choices.
