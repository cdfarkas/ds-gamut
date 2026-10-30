# ADR 0008 — Maximalist base aesthetic under the WCAG 2.1 AA gate

## Status

Proposed — the danger colour (coral) is amended by ADR 0012 (signal red); token names are superseded in part by ADR 0013 (`--omnia-` prefix).

## Context

The base aesthetic was a neutral blue-on-white default — safe, but it did not demonstrate that the
token contract (ADR 0003) and the accessibility gate (ADR 0006) survive an opinionated, high-energy
visual language. A design system earns its contract by proving a bold reskin changes values only, not
component CSS, and still passes the same hard a11y gate.

The chosen direction is **disciplined maximalism**: a clashing-but-controlled palette (electric
cobalt, coral, violet on warm cream / near-black ink), expressive mixed typography (a serif display
face against a grotesk for body and controls), and ornamental shape (expressive radius, chunky
borders, a flat blur-free offset shadow) — held together by strong structure and legible controls.

The non-negotiable constraint: every text/surface pairing, in **all four** theme×skin modes, still
meets WCAG 2.1 AA (4.5:1 body text, the a11y gate from ADR 0006). "More is more" never buys a
contrast exemption.

## Decision

We adopt disciplined maximalism as the base aesthetic, expressed entirely through the semantic token
layer of `src/styles/tokens.css` (ADR 0003 unchanged):

- **Colour** — primitives gain hero accents (cobalt/coral/violet/lime/cyan) and warm cream/ink
  neutrals; semantic `--color-*` names are unchanged and reassigned per theme and skin. Shades were
  tuned so each rendered text pairing clears 4.5:1: danger carries **ink** text on coral (cream fails
  at 3.4:1), primary carries **cream** text on cobalt, and the pixel skin blocks (deep violet, deep
  blood) carry **parchment** text.
- **Type** — two new semantic tokens, `--font-display` (Fraunces) and `--font-sans` (Space Grotesk),
  self-hosted via `@fontsource-variable/*` (no CDN, so offline / Linux CI / Chromatic all resolve the
  same font). Body and controls use the sans; headings use the display serif; the pixel skin keeps
  its mono/pixel face.
- **Shape** — an expressive radius scale (`--radius-sm/md/lg`, controls 10px / cards 14px, pixel skin
  0), a chunky `--border-width-thick`, and `--shadow-raised` redefined as a flat, blur-free offset
  shadow that recolours per theme through `--color-border-strong`.

WCAG 2.1 AA via axe (`a11y.test: 'error'`) stays the hard gate across every theme and skin. A failing
pairing is retuned to pass; the threshold is never loosened.

## Consequences

- The token contract is proven against a demanding palette: the only component CSS change was
  swapping Button's border to the new `--border-width-thick` / `--color-border-strong` tokens; the
  look is otherwise entirely token-driven. Button's props and public API are unchanged.
- Shades are an accessibility input, not a free choice — danger text polarity flips to dark on the
  bright coral because that is the pairing that passes. Future accents inherit the same discipline.
- Two self-hosted variable-font dependencies are added; they ship their own woff2, so there is no
  runtime network dependency and CI/Chromatic render deterministically.
- New semantic vocabulary (`--radius-lg`, `--border-width-*`, `--font-display`, `--font-sans`) joins
  the stable contract; like the existing names it must not be renamed without a superseding ADR.
