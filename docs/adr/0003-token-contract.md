# ADR 0003 — Two-tier token contract + stylelint no-raw-color fitness function

## Status

Proposed — token names superseded in part by ADR 0013 (`--omnia-` prefix).

## Context

A reskin (neutral ↔ pixel, light ↔ dark) only works if component styles never hard-code values. The
LDSR this project learns from treated "use tokens" as a convention, so raw values leaked into
component CSS and the theme could not be swapped cleanly.

A contract that is only documented is a wish. It needs a fitness function that fails the build.

## Decision

Tokens are defined in one `src/styles/tokens.css` in **two tiers**: primitive `--palette-*` (raw
values) and semantic `--color-*` / `--radius-*` / `--shadow-*` (aliases referencing primitives).
**Components consume the semantic layer only.** A **stylelint rule bans raw `hex`/`rgb`/`hsl` in
`*.module.css`**, making the contract a build gate.

Themes and skins reassign only the semantic layer. The file is hand-authored but shaped
Style-Dictionary-style for later generation.

## Consequences

- Reskinning changes tokens, never component CSS — the contract is enforced, not hoped for.
- Semantic token names become a stable public contract; renaming one is a breaking change.
- Authors must add a semantic token when they need a new value, rather than inlining it — a small,
  deliberate friction that keeps the system coherent.
- The structural pixel-skin carve-out (fonts, `image-rendering`, stepped shadows, notched borders)
  is the documented exception that stays in CSS, not tokens (see `docs/ARCHITECTURE.md`).

Becomes Accepted once the Phase-1 slice shows the stylelint rule passing with real components.
