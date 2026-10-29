# Agent visual validation

A hard gate that runs **before** human review. Automated tests (unit, interaction,
a11y) prove behaviour and catch contrast from CSS, but they do not prove the design
*looks* right — colours per theme, the pixel aesthetic, legibility, focus visibility.
axe in particular does not test WCAG 2.4.7 (focus visible), so a clipped focus ring
passes the a11y gate while being invisible on screen. The agent closes that gap by
screenshotting every state in every mode and inspecting the images itself.

## The rule

**Agent visual validation passes before any human review.** If the agent's per-mode
verdict is CONCERNS or FAIL, the issue is fixed (or explicitly flagged for human
decision) before the PR is handed over. The gate never loosens a WCAG threshold to
pass — a real contrast failure is flagged, not hidden.

## How an agent runs the gate

1. `pnpm build-storybook` — produce `storybook-static/`.
2. `pnpm visual-check` — `scripts/visual-check.mjs` serves the static build and drives
   Playwright (the Chromium already installed for the test runner). For every Button
   story it screenshots the four theme×skin modes, captures the keyboard-focus state,
   and captures both locales on one representative story. Output and a `manifest.json`
   (recording the `data-theme` / `data-skin` actually applied per shot) land in
   `visual-report/`.
3. The agent **reads** each PNG (the Read tool renders images) and judges it against
   the checklist below, writing a reasoned PASS / CONCERNS verdict per mode.

Modes are driven through the Storybook iframe globals query parameter, e.g.
`iframe.html?id=atoms-button--primary&viewMode=story&globals=theme:dark;skin:pixel;locale:fr`.

## Checklist (per mode)

- Colours are correct for the theme (not the wrong theme's palette).
- The pixel skin actually looks pixel: hard edges, zero border-radius, the pixel/mono
  font, hard offset shadow, notched corners.
- Dark mode is legible.
- Text contrast reads as AA (the automated a11y gate is the hard proof; this is the
  eyes-on cross-check).
- No overflow or clipping of text or the control.
- The focus ring is visible on keyboard focus — in **every** skin, including pixel
  where a clip-path would otherwise clip an outer outline.

## Chromatic

`scripts/visual-check.mjs` is the agent's own eyes and runs with no account. Chromatic
is the human-facing visual-regression history and runs later on the maintainer's token.
`.github/workflows/chromatic.yml` is wired with the four theme×skin modes but gated on
`secrets.CHROMATIC_PROJECT_TOKEN`; without the secret the job is skipped, not failed.
The two are complementary: the agent gate blocks a bad PR before review, Chromatic
tracks pixel drift over time once a project and token exist.
