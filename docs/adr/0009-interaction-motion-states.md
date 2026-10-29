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
- **Hover** — the control lifts `translate(-3px, -3px)` and the offset shadow grows to
  `--shadow-raised-hover` (`7px 7px 0`); the fill brightens via the existing `--color-accent-hover` /
  `--color-danger-hover` tokens. "Rises to meet you."
- **Active / press** — the control slams flat: `translate(--press-offset)` (4px, equal to the rest
  shadow offset) drops it onto its own shadow while the shadow collapses to `--shadow-pressed`
  (`0 0 0`). The fill darkens to the `-active` token. This is the signature press — the control drops
  onto the page and its elevation disappears.

Elevation is encoded by shadow thickness on one axis, with the ground fixed: the shadow's outer edge
sits at the same place in every state, so `translate + shadow offset` is constant (rest `0 + 4`,
hover `-3 + 7`, press `4 + 0`, all `4`). Thickness reads hover 7 > rest 4 > press 0; the page never
moves, only the control rises and slams flat. The neutral intent has no shadow and keeps a subtle
`translate(-1px, -1px)` hover / `translate(1px, 1px)` press.
- **Focus-visible** — the focus ring from ADR 0006 is kept. In the pixel skin a `clip-path` would clip
  an outer outline, so the ring is inset; it is now a thicker ring (`--border-width-thick`) set further
  in (`outline-offset: -7px`) so a band of fill colour separates the parchment ring from the parchment
  frame and it reads clearly in the dark-pixel mode.
- **Disabled** — flat: no shadow, no transform, muted fill (house style still prefers not disabling).
- **Loading** — a loading button is `disabled`, so every interaction rule (`:not(:disabled)`) already
  suppresses the press transform and its shadow. The spinner is essential progress feedback, so its
  spin runs unconditionally — it is not gated behind `prefers-reduced-motion: no-preference`.

Motion is asymmetric: hover and release settle smoothly over `--dur-fast` (200ms) with
`--ease-out` (`cubic-bezier(.33, 1, .68, 1)`, easeOutCubic), while press-in runs faster over
`--dur-press` (110ms, set on `:active`) so clicks stay immediate. It transitions only
`transform` / `box-shadow` / `background-color` / `border-color` so neighbours never reflow.

The pixel skin keeps the notched silhouette and zero radius, but its hard offset shadow needs a
different mechanism: a `clip-path` notch on the button clips any shadow drawn on the button itself
(`box-shadow`, `filter`, or a pseudo-element the clip also contains), which is why the earlier
`drop-shadow` stack was invisible. The shadow therefore lives on a non-clipped wrapper (`.frame`)
behind the button — a `::before` carrying the same notch `clip-path`, offset `4px 4px` and filled
with `--color-border-strong`. It is static; the button's own hover (`-3px`) and press (`+4px`)
transforms slide it across that fixed shadow, so the visible thickness grows to `7` on hover and
collapses to `0` on press — the same slam model, driven by the same tokens.

The interaction values live as tokens in `tokens.css` (`--dur-fast`, `--dur-press`, `--ease-out`, `--press-offset`,
`--shadow-raised-hover`, `--shadow-pressed`); the `:hover` / `:active` / `:focus-visible` rules live in
`Button.module.css`, because interaction is a component concern. No raw colour appears in component
CSS — the token contract (ADR 0003) is unchanged.

## Accessibility

Interaction motion is wrapped so `@media (prefers-reduced-motion: reduce)` disables transitions and the
lift/press transforms. The state cues survive without movement: hover still brightens the fill and
grows the shadow (an instant change), press still darkens the fill and flattens the shadow, and the
neutral intent darkens its border on press. The loading spinner is the one exception — it keeps
spinning, because a dead static spinner would stop conveying that the action is in progress. Every
state keeps its WCAG 2.1 AA contrast (ADR 0006); the gate is never loosened to accommodate a state
colour.

## Consequences

- Button's props and public API are unchanged — the choreography is pure CSS plus tokens.
- The motion tokens join the stable contract; like the rest they are not renamed without a superseding
  ADR.
- Future interactive atoms (Input, Switch, links) inherit this standard by consuming the same tokens
  instead of inventing their own motion.
