# ADR 0009 — Interaction & motion states

## Status

Proposed

## Context

The maximalist base aesthetic (ADR 0008) gives controls a flat, blur-free offset shadow
(`--shadow-raised`, `4px 4px 0`). In a neo-brutalist language that offset shadow is a physical
affordance — it says the control sits above the page — but it never changed on hover or press, so
interaction felt static. A design system that ships an opinionated shadow must make it respond, and
must do so once, as a reusable house standard rather than a per-component flourish.

## Decision

Button owns the canonical interaction choreography; every future interactive atom reuses the same
tokens and the same rest → hover → press story.

- **Rest** — the offset shadow (`--shadow-raised`), no transform.
- **Hover** — the control lifts `translate(-1px, -1px)` and the offset shadow grows to
  `--shadow-raised-hover` (`6px 6px 0`); the fill brightens via the existing `--color-accent-hover` /
  `--color-danger-hover` tokens. "Rises to meet you."
- **Active / press** — the control collapses onto its shadow: `translate(--press-offset)` (4px, equal
  to the rest shadow offset) while the shadow goes flat (`--shadow-pressed`, `0 0 0`). The fill
  darkens to the `-active` token. This is the signature press — the control presses into the page.
- **Focus-visible** — the focus ring from ADR 0006 is kept. In the pixel skin a `clip-path` would clip
  an outer outline, so the ring is inset; it is now a thicker ring (`--border-width-thick`) set further
  in (`outline-offset: -7px`) so a band of fill colour separates the parchment ring from the parchment
  frame and it reads clearly in the dark-pixel mode.
- **Disabled** — flat: no shadow, no transform, muted fill (house style still prefers not disabling).
- **Loading** — the spinner is unchanged; a loading button is `disabled`, so every interaction rule
  (`:not(:disabled)`) already suppresses the press transform.

Motion is asymmetric: hover and release settle smoothly over `--dur-fast` (200ms) with
`--ease-out` (`cubic-bezier(.33, 1, .68, 1)`, easeOutCubic), while press-in runs faster over
`--dur-press` (110ms, set on `:active`) so clicks stay immediate. It transitions only
`transform` / `box-shadow` / `background-color` / `border-color` (plus `filter`, for the pixel
skin's stepped shadow) so neighbours never reflow. The
pixel skin harmonises: its stepped hard shadow (a `drop-shadow` stack) grows on hover and collapses
to `none` on press, keeping zero radius and the notched silhouette.

The interaction values live as tokens in `tokens.css` (`--dur-fast`, `--dur-press`, `--ease-out`, `--press-offset`,
`--shadow-raised-hover`, `--shadow-pressed`); the `:hover` / `:active` / `:focus-visible` rules live in
`Button.module.css`, because interaction is a component concern. No raw colour appears in component
CSS — the token contract (ADR 0003) is unchanged.

## Accessibility

All motion is wrapped so `@media (prefers-reduced-motion: reduce)` disables transitions and the
lift/press transforms. The state cues survive without movement: hover still brightens the fill and
grows the shadow (an instant change), press still darkens the fill and flattens the shadow, and the
neutral intent darkens its border on press. Every state keeps its WCAG 2.1 AA contrast (ADR 0006); the
gate is never loosened to accommodate a state colour.

## Consequences

- Button's props and public API are unchanged — the choreography is pure CSS plus tokens.
- The motion tokens join the stable contract; like the rest they are not renamed without a superseding
  ADR.
- Future interactive atoms (Input, Switch, links) inherit this standard by consuming the same tokens
  instead of inventing their own motion.
