# Testing

One runner, two layers, one accessibility gate. The goal is a full test pyramid — unit, interaction,
accessibility — without a second test toolchain to maintain.

## Single runner

All tests run through **`@storybook/addon-vitest`** in **browser mode**. Stories *are* the test
subjects: a story renders a component in a real browser, and the same story feeds the catalogue, the
interaction tests, and the a11y checks. There is no separate jsdom unit runner and no separate e2e
runner for component behaviour.

Browser mode runs on Playwright's Chromium via **`@vitest/browser-playwright@4`**, with
`playwright install chromium` providing the browser. The **Vitest major is pinned** (4) because the
browser provider and the Storybook addon track the Vitest major; an accidental bump breaks the
runner. Keep them aligned.

## Two layers

### Layer 1 — stories (`*.stories.tsx`)

A story is the primary artefact. Each story is:

- **catalogue** — the rendered example shown in Storybook,
- **interaction** — a `play` function for the **happy path**, written so it reads as documentation of
  how the component is used (catalogue-worthy, not an exhaustive edge-case dump),
- **a11y** — automatically checked by the a11y addon (see below),
- **visual** — a snapshot target for visual regression.

### Layer 2 — tests next to the story

- **`*.test.tsx` — edge cases on composed stories.** Import the stories with `composeStories` and
  assert the cases that would clutter a `play`: error states, boundary inputs, keyboard edge paths.
  These are **additive** to the `play`, never a re-run of it.
- **`*.test.ts` — pure logic.** Functions with no rendering (formatters, reducers, `t()` lookups)
  are tested directly. No DOM.

### Inheriting globals in composed stories

Composed stories must pick up the project's decorators — theme, skin and locale — or an edge-case
test would render in an unthemed, unskinned, locale-less context and assert the wrong thing. Call
`setProjectAnnotations([preview])` inside a `beforeAll` so every `composeStories` result inherits the
same `theme` / `skin` / `locale` setup the Storybook preview applies.

## Accessibility gate

- **Floor: WCAG 2.1 AA** — the EU legal baseline (EN 301 549 v3.2.1, European Accessibility Act).
- The a11y addon runs with **`a11y.test: 'error'`**: a 2.1 AA violation fails the run.
- Enforced across **every theme and every skin — pixel included**. The pixel palette is chosen to
  meet the 4.5:1 contrast ratio so it passes the same gate as the neutral skin; it is not exempt.
- axe computes contrast **from the CSS**, so the result is deterministic across Windows local and
  Linux CI — the gate is not render-flaky.
- **WCAG 2.2 rules run as `'warn'`** — surfaced for awareness, not yet blocking.

## Agent visual validation

Automated tests prove behaviour and derive contrast from CSS, but they do not prove the
design *looks* right, and axe does not cover WCAG 2.4.7 (focus visible). So a fourth,
**agent-run** gate sits before human review: `pnpm build-storybook` then
`pnpm visual-check` screenshots every state in all four theme×skin modes, and the agent
reads the images and records a per-mode PASS / CONCERNS verdict. It never loosens a WCAG
threshold to pass. See `docs/visual-validation.md`.

## Acceptance

All four gates must be green, the last before the PR is handed to a human:

- `pnpm lint` (ESLint + Prettier + stylelint, including the no-raw-color rule)
- `pnpm test` (unit + interaction + a11y)
- `pnpm build-storybook`
- agent visual validation (`pnpm visual-check` + the agent's per-mode verdict)
