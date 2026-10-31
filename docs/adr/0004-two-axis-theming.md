# ADR 0004 — Two-axis theming: addon-themes `theme` + bespoke `skin` global

## Status

Superseded by ADR 0017

## Context

The system has two orthogonal styling axes: **theme** (light/dark) and **skin** (neutral/pixel). We
want both toggleable independently in the Storybook toolbar, both resolving against the semantic
token layer, and both applied on the same preview root.

`@storybook/addon-themes` exposes a **single** `theme` global. A second axis therefore cannot be
another addon-themes theme — treating skin as a theme would collapse the two axes into one list of
four and lose independence.

## Decision

Use **two mechanisms on the same preview root**:

- **`theme`** via addon-themes `withThemeByDataAttribute`, writing `data-theme` (defaults to
  `prefers-color-scheme`, toolbar overrides),
- **`skin`** via a **bespoke `globalTypes` decorator**, writing `data-skin`.

CSS resolves the semantic layer from the `[data-theme]` × `[data-skin]` combination.

## Consequences

- Theme and skin toggle independently; all four combinations (light/dark × neutral/pixel) are
  reachable and testable.
- A small amount of bespoke decorator code for the skin global — this is the correct way around the
  single-`theme` limit, not a temporary hack.
- Visual regression must cover all four combinations on representative stories.
