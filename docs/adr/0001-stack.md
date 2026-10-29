# ADR 0001 — Stack: React 19 + TS + Vite + Storybook 10 + pnpm + Node 22

## Status

Proposed

## Context

gamut is a greenfield, portfolio-grade design system. It needs a current, well-supported
component stack and a catalogue/test host that demonstrates recent best practice, without legacy
baggage from the Stonal `lib-design-system-react` it is inspired by (which carried deprecated Sass
and dual test runners).

Versions were verified clean on 2026-10-29: Storybook **10.6.5** (`@storybook/react-vite`) supports
React 19, Vite and the addon set (vitest, a11y, themes); react-vite peers accept Vite ^5–^8 and
React ≤19; `addon-vitest` peers accept Vitest ^4 || ^5.

## Decision

The stack is **React 19 + TypeScript + Vite + Storybook 10.6.5 (`@storybook/react-vite`)**, with
**pnpm** as the package manager and **Node 22** as the runtime.

## Consequences

- Modern, ESM-only Storybook 10 (lighter, faster) with first-class Vite integration.
- Access to recent Storybook features: stories-as-browser-tests, the a11y addon, story globals, CSF
  Factories.
- The Vitest major becomes load-bearing for the test runner and must be pinned (see ADR 0005).
- pnpm + Node 22 must be available in both Windows local and Linux CI environments.

Becomes Accepted once the Phase-1 vertical slice runs green on Windows local and Linux CI.
