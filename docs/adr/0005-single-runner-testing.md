# ADR 0005 — Single-runner, two-layer testing (addon-vitest + composeStories)

## Status

Proposed

## Context

The LDSR this project learns from ran two test toolchains, which doubled config and drifted. gamut
wants a full pyramid (unit + interaction + a11y) with one runner, and tests that live next to the
stories they cover so they cannot rot separately.

Storybook 10's `@storybook/addon-vitest` runs stories as browser tests, making the story the shared
subject for catalogue, interaction and a11y.

## Decision

A **single runner** — `@storybook/addon-vitest` in browser mode (Playwright Chromium via
`@vitest/browser-playwright@4`) — with **two layers**:

- stories carry a happy-path `play` (catalogue-worthy interaction) plus automatic a11y and visual
  checks;
- `*.test.tsx` adds edge cases on composed stories (`composeStories`), and `*.test.ts` covers pure
  logic.

`setProjectAnnotations([preview])` runs in `beforeAll` so composed stories inherit theme/skin/locale.

## Consequences

- One toolchain, one config; tests co-located with components.
- The Vitest major is load-bearing and pinned (4); the browser provider and the Storybook addon must
  track it.
- Component behaviour is tested in a real browser, not jsdom — more faithful, slightly heavier.

Becomes Accepted once the Phase-1 slice runs the full `pnpm test` green on Windows local and Linux CI.
