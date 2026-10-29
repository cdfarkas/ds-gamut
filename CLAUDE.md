# CLAUDE.md — Omnia entry contract

You are building or extending **Omnia**, a portfolio-grade design system. This file is the
shared contract for every agent and subagent: you arrive with no other context, so read it before
you touch anything, and treat the linked `docs/` files as the detail behind each rule here.

## Project scope

- **Storybook 10 atomic design system**: strict Atomic Design (atoms → molecules → organisms →
  templates), compound components, and Storybook 10 as the catalogue and test harness.
- **Theming**: light/dark theme axis × neutral/pixel-art skin axis, driven entirely by a two-tier
  token contract. Two independent axes, not four hand-built themes.
- **Bilingual FR/EN**: component labels and ARIA strings, plus authored MDX prose. One language is
  shown at a time, driven by a `locale` toolbar global — never both at once.
- **Full test pyramid**: unit (pure logic) + interaction (`play`) + accessibility, all run from a
  single Storybook-driven runner.

## Simplicity ladder

Take the smallest complete change that fully works, in this order:

1. Does it need to exist at all? Drop speculative options, flags and abstractions nobody asked for.
2. Reuse what is already in this repo (a component, token, helper, pattern) the way the surrounding
   code uses it.
3. Use a platform feature or an already-installed dependency before adding anything new.
4. Prefer one clear line over a clever one.

No new abstraction, wrapper or config "for later". Finish every part the change touches (call sites,
stories, tests, fixtures) — be lazy about the solution, never about the change itself.

## Comment policy

- **Default: no comment.** Write one only when the code cannot carry the explanation — a non-obvious
  why, a workaround, a trap for the next reader. Never restate the code or narrate a change.
- **Hard cap: two lines**, in any language. Anything longer belongs in the commit body or an ADR.
- Public contract doc blocks (JSDoc on an exported symbol) and a required pragma with its one-line
  reason are the only exceptions, and still terse.

## Token contract (enforced)

Components consume **semantic `var(--…)` tokens only**. No raw `hex`, `rgb()` or `hsl()` literal may
appear in any `*.module.css`. A stylelint rule enforces this — it is a build gate, not a convention.
Tokens live in one two-tier `src/styles/tokens.css` (primitive `--palette-*` + semantic
`--color-*` / `--radius-*` / `--shadow-*`); themes and skins reassign only the semantic layer.
See `docs/ARCHITECTURE.md`. Semantic token names are a stable contract — do not rename them.

## Test convention

One runner (`@storybook/addon-vitest`, browser mode), two layers:

- `play` function on a story = a **catalogue-worthy** happy-path interaction, shown in the docs.
- `*.test.tsx` = **edge cases** on composed stories (`composeStories`), additive to the `play`.
- `*.test.ts` = **pure logic**, no rendering.

See `docs/testing.md` for the full contract.

## Accessibility gate

WCAG **2.1 AA** is the floor (EU legal baseline, EN 301 549 — European Accessibility Act). The a11y
addon runs with `a11y.test: 'error'` across **every theme and skin, pixel included** — the pixel
palette is chosen to meet 4.5:1 contrast. WCAG 2.2 rules run as `'warn'`. See ADR 0006.

## Bilingual rule

- Labels and ARIA strings go through a typed `t()` indirection over a `Record<Locale, …>`, driven by
  a `locale` toolbar global. No i18n library.
- MDX prose is authored once per component and wrapped in `<Localized fr={…} en={…}/>`
  (`src/lib/Localized.tsx`), which renders only the active language and switches live with the
  `locale` toolbar global — **never** stacked FR+EN blocks. Autodocs auto-generated blocks (JSDoc
  descriptions, arg tables) stay single-language, as authored — they do not follow the `locale`
  global — accepted. See ADR 0007.

## Governance rule

Decisions are recorded as **ADRs** in `docs/adr/`. A locked decision changes only via: (1) a reasoned
written argument, (2) verifiable evidence (a failing/passing test or a benchmark), (3) an explicit
human decision, and (4) a PR that supersedes the ADR. **No silent deviation**: if a rule blocks you,
flag it, pick a sane default, and note it for human review. See `docs/governance.md`.

## Acceptance gates

Work is done only when all four are green, the last before any human review:

- `pnpm lint` (ESLint + Prettier + stylelint, including the no-raw-color rule)
- `pnpm test` (unit + interaction + a11y)
- `pnpm build-storybook`
- **agent visual validation** — `pnpm visual-check` screenshots every state in all four
  theme×skin modes; the agent reads the images and records a per-mode PASS/CONCERNS
  verdict, fixing or flagging before handover. It never loosens a WCAG threshold to pass.
  See `docs/visual-validation.md`.

## Where the detail lives

- `docs/ARCHITECTURE.md` — folders, compound decision tree, token contract, theming, tooling.
- `docs/testing.md` — the single-runner / two-layer contract and the a11y gate.
- `docs/governance.md` — the ADR and contestation rule.
- `docs/adr/` — the recorded decisions.
