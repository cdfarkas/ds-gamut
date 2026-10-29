# ADR 0002 — Styling: CSS Modules + `@layer` (no Sass, no CSS-in-JS)

## Status

Proposed

## Context

The system needs scoped component styles, a predictable cascade, and token-driven theming across two
axes (theme × skin). Options considered: Sass (as in the LDSR this project learns from), a CSS-in-JS
runtime, or plain CSS Modules with native platform features.

Sass is now effectively legacy for this use and adds a compile step for little gain over native
custom properties and nesting. CSS-in-JS adds a runtime cost and complicates SSR/token theming for no
benefit here.

## Decision

Styling is **CSS Modules + CSS custom properties + native `@layer`**. No Sass. No CSS-in-JS. The
cascade-layer order is declared once in `src/styles/layers.css`.

## Consequences

- Scoped class names from CSS Modules; theming through custom properties; predictable specificity
  from a single declared layer order.
- No preprocessor and no style runtime to ship or maintain.
- Relies on native `@layer` support in the target browsers (met by the Chromium test target and
  current evergreen browsers).
- Component CSS must consume semantic tokens only (enforced separately — see ADR 0003).
