# Architecture

How Omnia is laid out and why. Rules here are binding; the summaries in `CLAUDE.md` point at
this file for the detail.

## Folder layering

Atomic Design, strict:

```
src/
  styles/        tokens.css, reset.css, layers.css
  lib/           i18n.ts (t() + locale global + typed strings), intents.ts (shared intent list)
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
- `<Name>.mdx` — authored prose, locale-switched via `<Localized>` (one language at a time)
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

1. **Primitive palette** — raw values, named by what they *are*: `--omnia-palette-cobalt`,
   `--omnia-palette-ink`, `--omnia-palette-space-4`, `--omnia-palette-radius-md`,
   `--omnia-palette-border-thick`, `--omnia-palette-font-sans`. The only place raw colour values
   exist.
2. **Semantic aliases** — named by what they *do*, referencing primitives:
   `--omnia-color-bg-surface`, `--omnia-color-text-primary`, `--omnia-color-border-focus`,
   `--omnia-radius-md`, `--omnia-shadow-raised`. The vocabulary spans four families: colour
   (`--omnia-color-*`, including the status pairs `--omnia-color-success/warning/info/danger` each
   with `--omnia-color-text-on-<status>`, ADR 0012), shape (`--omnia-radius-sm/md/lg`,
   `--omnia-border-width-regular/thick`, the flat `--omnia-shadow-raised`), and type
   (`--omnia-font-display` serif, `--omnia-font-sans` grotesk). The maximalist base aesthetic that
   fills these is recorded in ADR 0008.

Every Omnia custom property — primitive, semantic, intent and per-component — shares the `--omnia-`
namespace, so a consuming app's own `--color-primary` or `--radius-sm` never collides with it
(ADR 0013).

An **intent map** closes the file: each `[data-intent]` sets `--omnia-intent-bg`,
`--omnia-intent-bg-hover`, `--omnia-intent-bg-active` and `--omnia-intent-fg` from the semantic
tier, so every intent-coloured component reads its rest/hover/press colours from one place;
`src/lib/intents.ts` shares the list (ADR 0012).

**Components consume the semantic layer only.** No `*.module.css` may contain a raw `hex`, `rgb()`
or `hsl()` literal — a stylelint rule bans it (see ADR 0003). This is the fitness function that keeps
the contract real: a reskin changes tokens, never component CSS.

Themes and skins reassign **only the semantic layer** — they re-point `--omnia-color-*` /
`--omnia-radius-*` / `--omnia-shadow-*` at different primitives (or, for the pixel skin, at different
values). Primitive names and semantic names are both stable contracts; do not rename them.

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
- the pixel skin's notched offset shadow geometry (a non-clipped frame `::before`, offset in raw px),
- notched / stepped borders.

This is a **documented, deliberate** carve-out: these are structural style rules, not design tokens,
so forcing them through the token layer would distort it. Colour still comes from semantic tokens.

## Interaction & motion

The offset shadow is a physical affordance, so it responds to interaction — this is the house
standard, defined once on Button and reused by every future interactive atom (ADR 0009). Rest shows
the flat `--omnia-shadow-raised` (`4px`, the ground reference); hover lifts the control
`translate(-3px, -3px)` and grows the shadow to `--omnia-shadow-raised-hover` (`7px`); the signature
press slams flat — `translate(--omnia-press-offset)` (`4px`) drops the control onto its shadow while
the shadow collapses to `--omnia-shadow-pressed` (`0`).
Elevation is shadow thickness (7 > 4 > 0) with the ground fixed: `translate + shadow offset` stays `4`
in every state. The pixel skin gets the same model through a non-clipped `.frame` wrapper whose
`::before` carries the offset shadow, because the button's notch `clip-path` would clip a shadow drawn
on the button itself.

Motion is tokenised and asymmetric: hover and release settle over `--omnia-dur-fast` (200ms) with
`--omnia-ease-out` (easeOutCubic), press-in is quicker at `--omnia-dur-press` (110ms). It transitions
only `transform` / `box-shadow` / `background-color` / `border-color`, so neighbours never reflow. Interaction
motion is wrapped in `@media (prefers-reduced-motion: reduce)`, which disables transitions and transforms
while keeping the colour and shadow state cues, so states stay distinguishable without movement; the
loading spinner is exempt and keeps turning, since it is essential progress feedback. Every state holds
WCAG 2.1 AA (ADR 0006).

## CSS Modules + `@layer`

Styling is **CSS Modules + CSS custom properties + native `@layer`** — no Sass, no CSS-in-JS
(ADR 0002). The cascade-layer order is declared **once** in `src/styles/layers.css` (reset →
tokens → base → components → utilities → overrides) so specificity is predictable and a component
never has to fight the cascade.

## Overriding components

Consumers restyle components — and their internal sub-parts — through a layered, public API, never by
touching the hashed CSS-Module class names, which are private and change every build. The tiers, from
most-sanctioned to escape hatch: semantic tokens → per-component `--omnia-<name>-*` variables → a
stable `data-scope`/`data-part` attribute contract selected from `@layer overrides` (the last layer,
so consumer rules win without `!important`) → the `style` prop. Every component documents its own
contract in its `.mdx`. Full specification and the per-component contract format: `docs/overrides.md`
(ADR 0010).

## Tooling

- **ESLint** (flat config) + **Prettier** for TS/JS and formatting.
- **stylelint** for CSS, including the no-raw-color rule that enforces the token contract.
- **Vite** as the builder, **Storybook 10** (`@storybook/react-vite`) as the catalogue and test host.
- **Packaging**: `pnpm build` emits an ESM library (`dist/index.js` + `tsc` declarations) and one
  `dist/styles.css`; versions and releases go through Changesets (ADR 0011).

See `docs/adr/` for the decisions behind these choices.
