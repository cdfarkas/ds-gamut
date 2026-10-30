# ADR 0012 — Status colour tokens

## Status

Proposed — token names superseded in part by ADR 0013 (`--omnia-` prefix).

## Context

Badge, and later any component that carries a status, needs status colours beyond the single
`--color-danger`. Those colours must be global semantic tokens (ADR 0003), not per-component values,
so every component reskins from one place across the theme and skin axes (ADR 0004).

Naming survey of how major design systems name their status colours:

- **MUI**: `success`, `warning`, `info`, `error` — https://v4.mui.com/customization/palette/
- **Atlassian**: `success`, `warning`, `information`, `danger` — https://atlassian.design/foundations/color
- **Primer**: `success`, `attention`, `accent`, `danger` — https://primer.style/foundations/color/overview
- **Carbon**: `support-success`, `support-warning`, `support-info`, `support-error` — https://carbondesignsystem.com/elements/color/tokens
- **Polaris**: `success`, `caution`, `info`, `critical` — https://polaris.shopify.com/design/colors/palettes-and-roles
- **Spectrum**: `positive`, `notice`, `informative`, `negative` — https://spectrum.adobe.com/page/color-system

`danger` is already a stable name (ADR 0003) shared with Atlassian and Primer, and is kept. Coral, the
danger colour until now, read as pink next to the new status colours.

## Decision

We add the semantic colours `--color-success`, `--color-warning` and `--color-info`, each paired with
`--color-text-on-<status>`, alongside the unchanged `--color-danger` / `--color-text-on-danger`.

New primitives: `--palette-mint`, `--palette-amber`, `--palette-pixel-forest`, `--palette-pixel-ochre`,
`--palette-pixel-navy`. Info reuses the existing `--palette-cyan`.

Per-mode values, with the WCAG contrast of the text-on pair:

- **Light and dark neutral**: bright fills with ink text — mint 10.56:1, amber 10.74:1, cyan 12.57:1.
- **Pixel** (inherited unchanged by dark + pixel, as danger is today): deep blocks with parchment text —
  forest 5.58:1, ochre 5.03:1, navy 7.05:1.

Button carries the status intents too — owner decision 2026-10-30, reversing the earlier Badge-only
choice in this same PR. Each status therefore has `-hover` / `-active` tokens, built on new primitives:
`--palette-mint-hover` / `-active`, `--palette-amber-hover` / `-active`, `--palette-cyan-hover` / `-active`,
`--palette-pixel-forest-deep` / `-dark`, `--palette-pixel-ochre-deep` / `-dark` and
`--palette-pixel-navy-deep` / `-dark`. Dark + pixel inherits the pixel values, as danger does.

Contrast of the text-on colour, hover / active:

- **Light and dark neutral** (ink text): mint 9.25 / 7.92, amber 9.81 / 8.65, cyan 11.26 / 10.04.
- **Pixel** (parchment text): forest 7.05 / 8.80, ochre 6.27 / 7.72, navy 8.62 / 10.35.

For context, Carbon, Primer, Polaris and Spectrum keep buttons to action intents plus one destructive
variant (Carbon button usage: https://carbondesignsystem.com/components/button/usage), while MUI allows
status buttons and Atlassian allows a warning button
(https://developer.atlassian.com/platform/forge/ui-kit-2/button).

Owner decision 2026-10-30: the danger/error colour moves from coral to signal red in light and dark
neutral. New primitives `--palette-red*` replace coral behind `--color-danger`; the name is unchanged and
ink text is kept. Ink contrast: light 5.33:1 rest, 5.10:1 hover, 4.71:1 active; dark 5.76:1 rest, 5.44:1
hover, 5.33:1 active. Pixel (blood red) is unchanged. This amends the coral-danger detail of ADR 0008.

Intent map (owner decision 2026-10-30): an intent's rest, hover, press and text colours are defined once,
at the end of `src/styles/tokens.css` in `@layer tokens`. Each `[data-intent='<intent>']` sets
`--omnia-intent-bg`, `--omnia-intent-bg-hover`, `--omnia-intent-bg-active` and `--omnia-intent-fg` from
the semantic tokens, and every intent-coloured component reads its colours from there. The intent list
itself is shared in TypeScript as `intents` / `Intent` (`src/lib/intents.ts`), which `BadgeIntent` and
`ButtonIntent` alias. The `omnia-` prefix avoids collisions with consumer variables once the package is
published.

Amendment 2026-10-30: `--omnia-color-danger-border` is the danger colour for non-text UI (the
invalid Input border). It aliases `--omnia-color-danger` except in dark + pixel, where blood red is
2.42:1 on pixel night and fails WCAG SC 1.4.11; there it is `--omnia-palette-red-bright` (5.76:1).

## Consequences

- The new names join the stable token contract: renaming them needs a superseding ADR.
- Any component with a status consumes these pairs instead of defining its own colours.
- Status buttons signal the outcome or nature of an action; colour is never the only signal, the label
  carries the meaning.
- Pixel ochre is the tightest pairing (5.03:1). If parchment changes, retune the ochre; never loosen the
  accessibility gate (ADR 0006).
- Colour is never the only signal: a status component's text must still carry the meaning.
- A new intent, or a new intent-coloured component, is added once in the intent map and the `intents`
  list. The `--omnia-intent-*` names join the stable contract. A TypeScript config applied as inline
  styles was rejected: inline styles beat `@layer overrides`, which would break the override API
  (ADR 0010).
