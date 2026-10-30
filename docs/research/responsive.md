# Responsive strategy study — breakpoints, container queries, utilities, hooks

Date: 2026-10-30. Method: official docs opened with a fetch tool during this study (it returns a
summary of each page, so values are as that summary reported them), local files read in this
worktree, and three small throwaway experiments run outside the repo. "Not verified" or "none
documented" means the pages opened do not say, not that the system lacks it. A WebSearch summary
was never used as a source for a fact; it only pointed to URLs.

## Question

The owner asked (French): "la strategie responsive. Quels breakpoints ? Classes et hooks
utilitaires ? A definir ... avant de continuer". Omnia has no breakpoints, no media query beyond
`prefers-*`, and no utility classes today. The next components are Input, Checkbox, Switch, Link,
then FormField, Card, Tabs, Dialog and a settings-form page template.

## Omnia facts that constrain the choice

All verified in this worktree.

- Styling is CSS Modules inside `@layer components`; no Sass, no CSS-in-JS (ADR 0002). The layer
  order in `src/styles/layers.css` already reserves a `utilities` layer, currently empty.
- Every custom property uses the `--omnia-` prefix (ADR 0013). `package.json` has `react` and
  `react-dom` as the only peer dependencies. The library ships one `dist/styles.css`.
- `src/styles/tokens.css` has no breakpoint, container or viewport token. The only `@media` rules
  in `src` are `prefers-reduced-motion` (Button) and `prefers-color-scheme` (Introduction.css).
- `.stylelintrc.json` extends `stylelint-config-standard`, which sets `media-feature-range-notation`
  to `context`. A scratch test confirmed `@media (min-width: 48em)` fails lint and
  `@media (width >= 48em)` passes. Any breakpoint written in CSS must use the range form.
- WCAG 2.1 AA is the floor, tested by the a11y addon in all four theme x skin modes.
- `scripts/visual-check.mjs` opens every story at a fixed 440 x 220 viewport (device scale 2).
  The script never renders narrower than 440 CSS px, and the Vitest Storybook runner defaults to
  1200 x 900 (read in the addon source), so no story is tested narrow today.

## 1. Breakpoints

Mobile-first means the unprefixed style is the smallest layout and each breakpoint adds styles at
`min-width`. Sources are listed at the end (S-codes).

| System                  | Names                                                          | Values                                                                                      | Unit                                  | Min-width / mobile-first                                  | Src |
| ----------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------- | --- |
| MUI                     | xs sm md lg xl                                                 | 0, 600, 900, 1200, 1536                                                                     | px                                    | Not stated; `up` is inclusive, `down` exclusive           | S1  |
| Chakra UI v3 (3.37.0)   | base sm md lg xl 2xl                                           | Pages conflict: 480/768/1024/1280/1536 px, or 30/48/62/80/96 rem                            | px or rem (conflict)                  | Yes                                                       | S2  |
| Mantine                 | xs sm md lg xl                                                 | 36, 48, 62, 75, 88 em (576, 768, 992, 1200, 1408 px)                                        | em                                    | Yes (style props apply "at that breakpoint and above")    | S3  |
| Radix Themes            | initial, xs sm md lg xl (only initial/md/xl confirmed as keys) | 0, 520, 768, 1024, 1280, 1640                                                               | px                                    | Yes, page says values are min-width based                 | S4  |
| Ant Design              | xs sm md lg xl xxl xxxl                                        | below 576, 576, 768, 992, 1200, 1600, 1920                                                  | px                                    | Yes ("follow Bootstrap 4 rules")                          | S5  |
| Bootstrap 5.3           | xs sm md lg xl xxl                                             | 0, 576, 768, 992, 1200, 1400                                                                | px                                    | Yes, mobile-first; max-width queries subtract 0.02px      | S6  |
| Tailwind CSS            | sm md lg xl 2xl                                                | 40, 48, 64, 80, 96 rem (640 to 1536 px)                                                     | rem                                   | Yes, plus `max-*` variants                                | S7  |
| IBM Carbon              | Small Medium Large X-Large Max                                 | 320, 672, 1056, 1312, 1584 px (20, 42, 66, 82, 99 rem)                                      | px and rem                            | Not stated                                                | S8  |
| Shopify Polaris         | none documented                                                | none documented                                                                             | none documented                       | none documented                                           | S9  |
| GitHub Primer           | xsmall small medium large xlarge xxlarge                       | 320, 544, 768, 1012, 1280, 1400 px; viewport ranges narrow <768, regular >=768, wide >=1400 | rem tokens; px in the React hook      | Page says breakpoints are no longer tied to min-width     | S10 |
| Atlassian (primitives)  | xxs xs sm md lg xl                                             | range starts 0, 30, 48, 64, 90, 110.5 rem; each range ends 0.01 below next                  | rem                                   | Ranges with min and max; min-width not stated in the file | S11 |
| Fluent UI v9            | none documented                                                | none documented                                                                             | none documented                       | none documented                                           | S12 |
| Adobe Spectrum S2       | xs sm md lg xl 2xl (+ `default`)                               | 480, 640, 768, 1024, 1280, 1536                                                             | written in px, emitted as rem (px/16) | Yes                                                       | S13 |
| GOV.UK Frontend         | mobile tablet desktop                                          | 320, 641, 769                                                                               | px in settings; mixin converts to em  | `$from` is min-width, `$until` is max-width               | S14 |
| Material 3 (size class) | compact medium expanded large extra-large                      | below 600, 600, 840, 1200, 1600                                                             | dp (Android doc)                      | Each class starts at an inclusive lower bound             | S15 |

Notes on cells:

- Chakra: `chakra-ui.com/docs/theming/breakpoints` (page version 3.37.0) and the GitHub source file
  list px (480, 768, 1024, 1280, 1536). `chakra-ui.com/docs/styling/responsive-design` (also 3.37.0)
  lists rem (30, 48, 62, 80, 96) and says rem is used to follow user font size. The two disagree on
  unit and on `lg` (1024 vs 992). Not resolved here.
- Radix: the page labels the rows initialPhones, xsPhones, smTablets, mdTablets, lgLaptops,
  xlDesktops. Only the keys `initial`, `md`, `xl` appear in its example.
- Material 3: `m3.material.io` returned 404, so the numbers come from the Android Compose page.
- Atlassian: the official docs pages returned empty; the numbers come from the published
  `@atlaskit/primitives` 18.1.0 constants file.
- Spectrum: the S2 docs page lists the six values; the theme source file writes them as
  `px / 16` rem.

Patterns observed (13 systems gave values):

1. 9 of 13 have a threshold at 768 px: Chakra, Mantine, Radix, Ant, Bootstrap, Tailwind, Primer,
   Atlassian, Spectrum. MUI (600/900), Carbon (672), GOV.UK (641/769) and Material (600/840) do not.
2. Every system that states a direction is min-width (mobile-first). Primer says its breakpoints are
   no longer tied to that approach and prefers three viewport ranges.
3. Units split. Written and used in px: MUI, Radix, Ant, Bootstrap. Em or rem in the output:
   Mantine (em), Tailwind (rem), Atlassian (rem), Primer tokens (rem), Spectrum (rem), GOV.UK (em,
   converted by the mixin). Carbon documents both. Chakra's own pages conflict.
4. Smallest step above zero sits between 480 and 576 px in 7 systems (Chakra, Spectrum, Atlassian,
   Radix 520, Ant, Bootstrap, Mantine). Largest common step is 1200 to 1280 px.
5. Names: `sm md lg xl` is the shared vocabulary in 8 systems (Chakra, Mantine, Ant, Bootstrap,
   Tailwind, Spectrum, MUI, Atlassian; Radix's keys are only partly confirmed). Carbon, Primer,
   GOV.UK and Material use their own words.

## 2. Media queries vs container queries

Which systems document container queries:

| System                                                   | Container queries documented                                                             | Src                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| Tailwind CSS v4                                          | Yes: `@container` plus `@sm`, `@md`... variants with their own size scale (16 to 80 rem) | S7                             |
| MUI (v9.5.0)                                             | Yes: `theme.containerQueries.up('sm')` returns `@container (min-width: 600px)`           | S1                             |
| Mantine                                                  | Yes: write `@container` in CSS; `rem()` and `em()` work, CSS variables do not            | S3                             |
| Shopify Polaris                                          | Yes: `<s-query-container>` and prop values like `@container (inline-size > 500px) a, b`  | S9                             |
| Bootstrap                                                | Breakpoints page does not mention them                                                   | S6                             |
| Radix Themes                                             | Breakpoints page does not mention them                                                   | S4                             |
| Spectrum S2                                              | Styling page does not mention them                                                       | S13                            |
| Primer                                                   | Layout and Stack pages do not mention them                                               | S10                            |
| Chakra, Ant, Carbon, Atlassian, Fluent, GOV.UK, Material | none documented on the pages opened                                                      | S2, S5, S8, S11, S12, S14, S15 |

This table shows what docs offer authors. It does not show that those systems use container
queries inside their own components; that is not verified for any of them.

Browser support:

- **Size container queries** (`container-type: inline-size`, `@container (width > 700px)`, `cqi`
  units): MDN's `@container` page carries "Baseline: Widely available", available across browsers
  since February 2023 (S16). web.dev lists Chrome 105, Edge 105, Firefox 110, Safari 16 (S16). The
  web-features data records a Baseline low date of 2023-02-14 and a high date of 2025-08-14 (S17).
- **Style queries** (`@container style(--x: y)`): usable for custom properties only. Chrome 111,
  Edge 111, Safari 18, Firefox 151; web-features marks the feature Baseline "low" since
  2026-05-19, so it is newly available, not widely available (S17). Chrome's guide says queries on
  regular CSS properties are not implemented in any browser (S17). Omnia already exposes theme and
  skin as `data-theme` / `data-skin` attributes, so a style query would add nothing today.
- MDN says `container-type: inline-size` applies layout, style and inline-size containment (S16).
  My reading, not from a page opened: inline-size containment means the box cannot take its width
  from its content, so every container needs a width given by its parent.
- Mantine says CSS variables do not work inside `@container` conditions (S3), and a Fluent
  maintainer says the same of media queries (S12). Thresholds are literal values either way.

## 3. Sharing breakpoint values between CSS and JS

| System      | Mechanism                                                                                                 | Src |
| ----------- | --------------------------------------------------------------------------------------------------------- | --- |
| MUI         | JS theme object; `theme.breakpoints.up/down/...` return media-query strings                               | S1  |
| Chakra      | JS config (`theme.breakpoints`); `system.breakpoints.up()` returns the query                              | S2  |
| Mantine     | JS theme plus a second, static copy in PostCSS (`postcss-simple-vars`); docs say update both by hand      | S3  |
| Bootstrap   | Sass map `$grid-breakpoints` and mixins; output is literal values; no JS story on the page                | S6  |
| Tailwind    | `--breakpoint-*` variables inside `@theme`; Tailwind reads them at build time to generate the rules       | S7  |
| Primer      | Tokens as CSS custom properties (`--breakpoint-*`, `--viewportRange-*`); the React hook hard-codes px     | S10 |
| GOV.UK      | Sass map `$govuk-breakpoints` and a mixin that converts px to em                                          | S14 |
| Spectrum S2 | Build-time style macro; conditions defined once in the theme source                                       | S13 |
| Atlassian   | JS constants file in `@atlaskit/primitives` (ranges per breakpoint)                                       | S11 |
| Ant Design  | Theme tokens `screen[XS..XXXL]` can be overridden                                                         | S5  |
| Fluent v9   | None official; an issue says breakpoints would need their own object because CSS variables cannot be used | S12 |

Primer's source comment says its hook uses px because the `@primer/primitives` tokens use `em` inside
`calc()`, which fails in Chrome (S10).

### `@custom-media` status

- **Spec**: Media Queries Level 5, section 10. The page opened is a W3C Working Draft; section 10
  is not marked at risk. Example form: `@custom-media --narrow-window (max-width: 30em);` then
  `@media (--narrow-window) { ... }` (S18).
- **Browsers**: web-features lists "Custom media queries" as limited availability, with no browser
  supporting it (Chromium bug 40781325, Firefox bug 2048216, WebKit bug 233820) (S17). The MDN page
  URL tried returned 404.
- **postcss-custom-media**: `npm view` on 2026-10-30 gives 12.0.3 (modified 2026-10-01), peer
  `postcss ^8.4`, node `>=20.19.0`. Its README: output drops the `@custom-media` rule unless
  `preserve` is set, and definitions in other files are invisible unless supplied through the
  PostCSS Global Data plugin (S19). Omnia has postcss 8.5.32 installed, not this plugin.
- **Lightning CSS**: supported as a draft, off by default, enabled with `drafts: { customMedia: true }`;
  the docs say the syntax may still change (S19).

### What Vite 8 does here (read from `node_modules`)

- Vite 8.3.5 defaults `css.transformer` to `"postcss"`. CSS Modules therefore compile through
  PostCSS today. Vite's docs mark `css.transformer` and `css.lightningcss` experimental (S19).
- `lightningcss` 1.33.0 is a regular dependency of Vite, so it is already installed. It is not in
  Omnia's `package.json`. Vite's production CSS minifier already is Lightning CSS (any
  `cssMinify` value other than `"esbuild"`); the library build sets `cssMinify: false`.
- No `postcss.config.*` and no `vite.config.*` exist. `vite.lib.config.ts` serves `pnpm build`
  only. Storybook's builder loads a Vite config with `loadConfigFromFile` and would find none.
  Vite searches for a PostCSS config from `config.root`, so one root `postcss.config.js` would
  reach Storybook, Vitest and the library build. The Lightning route needs
  `css.transformer` plus `css.lightningcss` in `vite.lib.config.ts`, a `viteFinal` in
  `.storybook/main.ts`, and probably `vitest.config.ts` (whether the Storybook Vitest project
  reuses `viteFinal` was not verified).

Three throwaway experiments (scratch folder, repo untouched, Lightning CSS 1.33.0, Vite 8.3.5):

1. Calling Lightning CSS directly with `drafts.customMedia: true` but no `targets` leaves
   `@media (--md)` unresolved. With `targets` set it rewrites to `@media (min-width: 48em)`.
   Vite sets default targets, so this does not bite inside Vite.
2. A Vite library build with `css.transformer: 'lightningcss'` and `drafts.customMedia: true`:
   `a.module.css` does `@import './breakpoints.css'` and its output becomes
   `@media (width >= 48em)`. `b.module.css` without the `@import` fails the build with
   "Custom media query --omnia-md is not defined". Each CSS Module must import the definitions,
   and a forgotten import is a loud error, not silent breakage.
3. `stylelint` with the repo's own config accepted a `@custom-media` rule. A scratch config with
   `media-feature-name-value-allowed-list` (built into stylelint 17.16.0) rejected a width value
   outside the allowed list, in the range notation the repo requires. That gives a no-dependency
   way to enforce a fixed breakpoint set on literal queries.

Not tested: the whole Omnia suite under the Lightning CSS transformer (class-name hashing and
`:global` handling differ from PostCSS Modules), and postcss-custom-media (not installed).

Adding a dependency needs a reason. For Lightning CSS there is none to add. For
postcss-custom-media the reason would have to be "avoid repeating 3 to 4 literals", which is thin.

## 4. Utilities: classes, props, CSS-only

| System                              | Responsive utility classes                                 | Responsive props                                                                | Src               |
| ----------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------- |
| Tailwind                            | Yes: `md:w-32`, `max-md:`, `@md:` container variants       | none documented                                                                 | S7                |
| Bootstrap                           | Yes: `.d-md-none`, `.d-{breakpoint}-{value}`               | none documented                                                                 | S6                |
| GOV.UK                              | Yes: grid classes with a suffix, e.g. `-from-desktop`      | none documented                                                                 | S14               |
| Chakra                              | none documented                                            | Yes: `{ base, md }`, array form, `hideFrom`, `hideBelow`, `mdToXl`, `lgOnly`    | S2                |
| Radix Themes                        | none documented                                            | Yes: `size={{ initial: "3", md: "5" }}`                                         | S4                |
| Mantine                             | Yes: `mantine-hidden-from-{x}`, `mantine-visible-from-{x}` | Yes: `w={{ base, sm }}`, `hiddenFrom`, `visibleFrom`; docs warn they are slower | S3                |
| Ant Design                          | none documented                                            | Yes: `gutter`, `align`, `justify` and Col sizes take breakpoint objects         | S5                |
| Primer                              | none documented on pages opened                            | Yes: Stack props typed `ResponsiveValue<...>` with `narrow/regular/wide` keys   | S10               |
| Spectrum S2                         | none documented                                            | Build-time object keys (`default`, `md`, `lg`) in the style macro               | S13               |
| Polaris                             | none documented                                            | Container-query strings inside prop values                                      | S9                |
| MUI                                 | not verified (breakpoints and hook pages only)             | not verified                                                                    | S1                |
| Carbon, Atlassian, Fluent, Material | none documented                                            | none documented (Material: Compose `WindowSizeClass` API in code)               | S8, S11, S12, S15 |

CSS-only behaviour inside components (a component that adapts with no prop and no class): none of the
pages opened say which of their components do this. The one related statement is Primer's: its
`useResponsiveValue` hook is marked deprecated in source in favour of `getResponsiveAttributes` with
CSS media queries (S10). Treat "which systems self-adapt" as not verified.

## 5. Hooks

| System                                                         | Hook                                   | What the docs say about SSR and hydration                                                                               | Src                          |
| -------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| MUI                                                            | `useMediaQuery`                        | Needs two renders for hydration; default value is `false`; `noSsr` skips the double render; `ssrMatchMedia` emulates it | S1                           |
| Mantine                                                        | `useMediaQuery`, `useMatches`          | Returns `false` on the server; pass an initial value and `getInitialValueInEffect`; may cause hydration mismatch in SSR | S3                           |
| Chakra v2 docs                                                 | `useBreakpointValue`                   | Works in SSR by default but can flash a wrong variant; `fallback` defaults to `base`; `ssr: false` for client-only apps | S2                           |
| Chakra v3                                                      | `useBreakpoint` / `useBreakpointValue` | Official v3 hook page returned 404. Source: `fallback` defaults to `"base"`, `ssr` option forwarded to `useMediaQuery`  | S2                           |
| Ant Design                                                     | `Grid.useBreakpoint`                   | Page says nothing about SSR                                                                                             | S5                           |
| Primer                                                         | `useResponsiveValue` (deprecated)      | Calls `useMedia(query, false)` per range; source carries a TODO "Improve SSR support"                                   | S10                          |
| Fluent v9                                                      | none (v8 had `useResponsiveMode`)      | Maintainer: hook solutions usually cause SSR problems, prefer `@media` because it does not change the DOM               | S12                          |
| Radix, Bootstrap, Tailwind, GOV.UK, Carbon, Polaris, Atlassian | none documented                        | not applicable                                                                                                          | S4, S6, S7, S8, S9, S11, S14 |
| Spectrum                                                       | not verified (react-aria page 404)     | not verified                                                                                                            | S13                          |

React's own contract for external stores (S20): `useSyncExternalStore(subscribe, getSnapshot,
getServerSnapshot?)`. `getServerSnapshot` is used only on the server and during hydration, and must
return the same value on both sides; omitting it makes server rendering throw. The `matchMedia` API
takes a query string with each feature in parentheses, exposes `matches`, and fires a `change`
event on the `MediaQueryList` (S16).

Implementation sketch for Omnia (not written to `src`):

```ts
import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
```

- `serverValue = false` makes the mobile-first layout the first render, in line with mobile-first
  CSS and with MUI, Mantine and Chakra defaults.
- My reading of the React contract: during hydration React uses the server value, then re-renders
  with the real one, so there is no mismatch warning but there can be one frame of the wrong layout.
  That frame is the cost the Chakra, Mantine and MUI pages describe.
- A `breakpoints` constant would sit beside it so callers write
  ``useMediaQuery(`(width >= ${breakpoints.md})`)`` instead of a literal.

## 6. Accessibility

- **SC 1.4.10 Reflow (AA)**: content must work without two-dimensional scrolling at a width of
  320 CSS px (vertical scrolling content) and 256 CSS px height (horizontal scrolling content). The
  page ties 320 to a 1280 px window at 400% zoom. Responsive layouts that move content are fine as
  long as nothing is lost. Parts that need two dimensions (maps, diagrams, video, games, data tables)
  are excepted; individual table cells still must fit (S21).
- **SC 1.4.4 Resize Text (AA)**: text can be enlarged to 200% without assistive technology and
  without loss of content. The page does not ban px; it judges the rendered result. Each layout
  variant (breakpoint) must still allow 200%. It lists F94 (viewport units used to size text) as a
  common failure (S21).
- **Em vs px in media queries**: the Media Queries spec section 1.3 says relative lengths in a media
  query resolve against the initial font-size, not any element's styling (S18). So `48em` follows the
  browser's default font-size setting and `768px` does not. Measured behaviour from two blog
  experiments (S22):
  - Chrome and Firefox: px queries stay fixed when the default font size changes; em and rem queries
    move with it.
  - Safari: the older test (Zell Liew; no date in the text fetched) found a rem bug; the 2023
    retest found px, em and rem all fixed unless the user
    sets a minimum font size, and the author called Safari "still an outlier".
  - Conclusion of the 2023 post: no clear winner; use em to follow user font size, px for
    consistency across browsers.
- Primer's responsive page adds: support a 320 px minimum width and 256 px minimum height, and avoid
  pointer-type queries (`coarse`/`fine`) to change an interface (S10).

## 7. Testing

### Storybook 10

- Viewport is a core module imported from `storybook/viewport`; `.storybook/main.ts` lists no
  viewport addon and the module exists in `node_modules/storybook/dist/viewport` (S23).
- Default options (`MINIMAL_VIEWPORTS`): `mobile1` 320 x 568, `mobile2` 414 x 896, `tablet`
  834 x 1112, `desktop` 1280 x 1024 (S23).
- A story pins a viewport through `globals`, the same mechanism Omnia already uses for
  `theme` and `skin` (see `Badge.stories.tsx` lines 72 to 76):

  ```ts
  export const OnPhone: Story = {
    globals: { viewport: { value: 'mobile1', isRotated: false } },
  };
  ```

  A viewport set this way cannot be changed from the toolbar (S23).

- Vitest: `@storybook/addon-vitest` 10.6.5 reads the story's viewport global or parameter and calls
  `page.viewport(width, height)` in browser mode (read in `dist/vitest-plugin/test-utils.js`). With
  no viewport it uses 1200 x 900. It only applies a viewport whose `styles` give both width and
  height; px, %, vw, vh, em and rem are parsed. So a `mobile1` story runs its `play` and the a11y
  check at 320 px.
- Whether any axe rule checks Reflow is not verified. A narrow story's `play` can assert
  `document.documentElement.scrollWidth <= clientWidth` to cover SC 1.4.10 directly.
- A component container query reacts to the container, not the viewport, so those stories need a
  fixed-width wrapper (a decorator or a `width` style), not a viewport global.

### `scripts/visual-check.mjs`

Read, not changed. It creates one page with `viewport: { width: 440, height: 220 }` and
`deviceScaleFactor: 2`, loops `stories x modes`, and opens
`iframe.html?id=...&globals=theme:..;skin:..;locale:..`. Whether a `viewport:` global in that
iframe URL resizes the content is not verified; the manager frame resizes the iframe, not the
bare iframe page.

A narrow pass can use Playwright directly. Playwright 1.64.1's own typings say
`page.setViewportSize` resizes the page and that the size should be set before navigating:

1. Add a `sizes` list, e.g. `[{ key: 'w440', width: 440, height: 220 }, { key: 'w320', width: 320, height: 568 }]`.
2. Before each `open()`, call `await page.setViewportSize(...)`, and add a size suffix to the file
   name and a `viewport` field to `manifest.json`, so shots and manifest stay matched.
3. Run the narrow size only for stories that opt in (a `responsive` flag in the `stories` list),
   because all 13 stories x 4 modes is 52 shots and doubling it adds noise.
4. Include one `locale: 'fr'` shot at 320 px per responsive story; French labels may wrap
   differently (to check, not assumed).
5. Add "no horizontal scroll at 320 px" and "no clipped focus ring" to the per-mode checklist in
   `docs/visual-validation.md`.

## What the roadmap needs (analysis)

My reading of what each next component needs; nothing here is from a surveyed page.

| Component              | Responsive need                                                      | Mechanism that fits                      |
| ---------------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| Input                  | Fill the available width                                             | Fluid CSS, no breakpoint                 |
| Checkbox, Switch, Link | Fixed control plus wrapping label or text                            | Fluid CSS, no breakpoint                 |
| FormField              | Label above the input when narrow, beside it when wide               | Container query on the field             |
| Card                   | Stacked media or actions when narrow, side by side when wide         | Container query on the card              |
| Tabs                   | Tab list overflows when narrow (scroll, wrap, or collapse to a menu) | Container query; JS only for a menu      |
| Dialog                 | Width capped to the viewport; full-screen sheet on small viewports   | `min()` for width; viewport media query  |
| Settings-form template | Column count, sidebar collapse, page padding                         | Viewport media query (or root container) |

So the four atoms need no breakpoint at all. Container queries cover three molecules. Viewport
queries are needed by the template and probably Dialog. No component in the list needs JavaScript
today.

## Options for Omnia

### A. Mobile-first em breakpoints, container queries inside components, one hook, no utility classes

API:

- A fixed scale, written once as named queries (see the strongest-option values below). CSS uses it
  as `@media (width >= 48em)`; JS gets `breakpoints` and `useMediaQuery(query, serverValue = false)`.
- Components with a width-dependent layout use `@container` with a threshold local to the component
  (no shared name, because `var()` cannot be used there).
- No responsive props, no utility classes.

Sharing mechanism, three sub-choices:

| Sub-option | How the scale is shared                                                                          | Cost                                                             |
| ---------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| A1         | `@custom-media` in `src/styles/breakpoints.css`, Lightning CSS transformer, `@import` per module | Config in 3 places; experimental Vite option; draft spec; 0 deps |
| A2         | Same, with postcss-custom-media 12.0.3 and a root `postcss.config.js`                            | 1 new devDependency; Global Data or per-file import              |
| A3         | Literal `@media (width >= 48em)` plus a stylelint allow-list and a `breakpoints.ts` sync test    | 0 deps, 0 Vite config; the literal is repeated per use           |

Pros:

- Matches the common mobile-first reading in the survey (all systems that state a direction) and the
  `sm md lg xl` vocabulary of 8 systems (Section 1).
- Em in `@media` follows the user's font size in Chrome and Firefox (S22), which supports SC 1.4.4.
- Container queries fit three of the molecules on the roadmap and are Baseline widely available.
- The hook is tiny and follows React's documented store contract.

Cons:

- Two mechanisms (media and container) to teach and test; container stories need a width wrapper.
- A1 and A2 depend on a draft feature no browser implements; the output is literal so consumers are
  unaffected, but the build tool becomes load-bearing.
- Em has no proven benefit in Safari (S22).
- Container thresholds are magic numbers per component.

### B. Container queries only, no global breakpoints, no hook

Pros:

- Smallest API: one concept, no shared scale, nothing to keep in sync, no SSR issue.
- A component adapts to where it is placed, which suits a design system.

Cons:

- Dialog and the page template adapt to the viewport; a top-layer dialog has no useful ancestor to
  query (my reading), so B needs `@media` anyway for them.
- Every container needs a parent-given width (inline-size containment, S16), a hazard for inline atoms.
- JS cannot react to a container size without a resize observer; Tabs collapsing to a menu would
  need one.

### C. Responsive props (`{ base, md }` style)

Pros:

- Familiar to Chakra, Radix, Mantine and Primer users (S2, S3, S4, S10).
- Typed, discoverable API.

Cons:

- Every layout prop becomes `T | Responsive<T>`. Omnia's atoms have almost no layout props, and the
  roadmap has no layout primitive (no Stack or Grid) to carry them.
- Needs either per-instance generated CSS or a JS hook. Mantine says its responsive props are less
  performant and should be avoided in large lists (S3); Primer deprecated its hook (S10).
- Mantine's `size` prop is not responsive (S3), a reminder that most props would not be either.

### D. Utility-class layer in `@layer utilities`

Pros:

- The empty `utilities` layer is already reserved.
- Gives consumers layout control with no JS (Bootstrap, Tailwind, Mantine's `visible-from` classes).

Cons:

- A public class-name API that needs the `omnia-` prefix (ADR 0013 logic), stories, tests and ADRs,
  and adds bytes to every consumer's `styles.css`.
- Nothing on the roadmap needs it, and consumers on Tailwind or Bootstrap already have it.
- Against the simplicity ladder in `CLAUDE.md` ("no new abstraction for later").
- A smaller variant (only show/hide at a breakpoint) is cheaper, but it still needs the scale.

### Proposed scale for the strongest option (A)

Min-width, mobile-first, written in `em` (1em = 16px at the default font size). Base (below `sm`)
must work at 320 px.

| Name | Value | Pixels | Closest matches in the survey                                     |
| ---- | ----- | ------ | ----------------------------------------------------------------- |
| sm   | 30em  | 480    | Chakra sm 480, Spectrum xs 480, Atlassian xs 30rem                |
| md   | 48em  | 768    | 9 of 13 systems (see Section 1)                                   |
| lg   | 64em  | 1024   | Tailwind lg, Spectrum lg, Chakra lg (px page), Atlassian md 64rem |
| xl   | 80em  | 1280   | Tailwind xl, Spectrum xl, Chakra xl, Primer xlarge 80rem          |

- Ship only the steps a component uses; `md` and `lg` are the likely first two. Adding a step needs an
  ADR line, not a rewrite.
- If A1 is chosen, name them `--omnia-bp-sm`, `--omnia-bp-md`, ... to keep the `--omnia-` prefix.
- Container thresholds are local to a component, in `rem` (em inside `@container` was not verified
  here; check on first use).

## Recommendation

Opinion, built on the facts above: take A, staged, with A3 as the sharing mechanism.

1. Adopt the four-step scale above as the only allowed media-query widths, enforced by a
   `media-feature-name-value-allowed-list` rule in stylelint. Zero dependencies, zero Vite changes.
2. Build Input, Checkbox, Switch and Link fluid, with no breakpoints, and check them at 320 px.
3. Use container queries for FormField, Card and Tabs; use viewport `@media` for Dialog and the
   settings template.
4. Add `breakpoints.ts` and `useMediaQuery` when the first component needs JavaScript, not before.
   Add a `*.test.ts` that reads the CSS scale and compares it with the constant.
5. No responsive props and no utility classes.
6. Move to A1 (`@custom-media` through Lightning CSS) only if literals spread to roughly a dozen
   files. The output is literal CSS, so the change is mechanical and reversible.
7. Add the narrow-viewport pass to `visual-check.mjs` (Section 7) before the first molecule ships.

Why not the others: B leaves Dialog and the template without a mechanism; C and D add public APIs
that no roadmap component asks for.

Devil's advocate on that pick:

- **Em may buy nothing for some users.** The one 2023 retest says Safari ignores the default font
  size for em queries. If Safari matters, px is equal in behaviour there and simpler to read, and
  Bootstrap, MUI, Ant and Radix ship px.
- **Container queries are documented widely, proven little.** I could not verify that any surveyed
  system uses them inside its own components, so Omnia would be early. Inline-size containment can
  break an atom that is expected to size to its content.
- **No utilities means the template hand-writes layout.** Omnia has no Stack or Grid. The settings
  page may be the first sign that a small layout primitive is missing, and that is a bigger
  decision than a class layer.
- **This is desk research.** No Omnia component was rendered below 440 px in this study, so Button
  and Badge at 320 px are untested. The recommendation could change after the first 320 px shots.
- **The hook may never be needed.** Exporting `useMediaQuery` is public API; the staged plan delays
  it for that reason, but a delayed hook can also arrive in a rush.
- **A3 trades a tool for discipline.** The allow-list catches wrong values, not a missing
  breakpoint; the sync test only holds if someone keeps it.

Not decided here: the exact container thresholds, whether a layout primitive (Stack) is wanted,
the `sm` step (drop it if no component needs it), and the ADR number (the next free one is 0014).

## Decision

2026-10-30, chosen by the owner from the options above. Recorded in
[ADR 0014](../adr/0014-responsive-strategy.md).

- **Approach A.** A mobile-first breakpoint scale for viewport `@media` (Dialog, page template).
  Container queries inside components whose layout depends on their width (FormField, Card, Tabs),
  with thresholds local to each component. Atoms (Input, Checkbox, Switch, Link) stay fluid with no
  breakpoint. `useMediaQuery` and `breakpoints.ts` come only when a first component needs
  JavaScript, not now. No responsive props, no utility classes.
- **Unit em.** sm 30em (480px), md 48em (768px), lg 64em (1024px), xl 80em (1280px), `min-width`
  mobile-first, written in range notation `(width >= 48em)` as the repo's stylelint requires.
- **Sharing A3.** Literal values in `@media`, enforced by stylelint's built-in
  `media-feature-name-value-allowed-list`. No new dependency, no Vite config. Revisit
  `@custom-media` (A1) only if literals spread to about a dozen files.
- Also adopted: the 320 CSS px pass in `scripts/visual-check.mjs` (Section 7).

## Sources

All opened 2026-10-30. Fetched pages are summarised by the fetch tool.

- S1 MUI: https://mui.com/material-ui/customization/breakpoints/ , https://mui.com/material-ui/react-use-media-query/ , https://mui.com/material-ui/customization/container-queries/
- S2 Chakra UI: https://chakra-ui.com/docs/theming/breakpoints , https://chakra-ui.com/docs/styling/responsive-design , https://chakra-ui.com/docs/theming/customization/breakpoints , https://chakra-ui.com/docs/theming/overview , https://v2.chakra-ui.com/docs/hooks/use-breakpoint-value , https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/packages/react/src/theme/breakpoints.ts , https://app.unpkg.com/@chakra-ui/react@3.34.0/files/dist/esm/hooks/use-breakpoint.js
- S3 Mantine: https://mantine.dev/styles/responsive/ , https://mantine.dev/hooks/use-media-query/
- S4 Radix Themes: https://www.radix-ui.com/themes/docs/theme/breakpoints
- S5 Ant Design: https://ant.design/components/grid , https://ant.design/components/grid#api
- S6 Bootstrap: https://getbootstrap.com/docs/5.3/layout/breakpoints/ , https://getbootstrap.com/docs/5.3/utilities/display/
- S7 Tailwind CSS: https://tailwindcss.com/docs/responsive-design
- S8 IBM Carbon: https://carbondesignsystem.com/elements/2x-grid/overview/
- S9 Shopify Polaris: https://shopify.dev/docs/api/polaris , https://shopify.dev/docs/api/polaris/using-polaris-web-components (the old polaris-react tokens URL redirects to the first)
- S10 GitHub Primer: https://primer.style/product/primitives/size/ , https://primer.style/product/getting-started/foundations/layout/ , https://primer.style/product/getting-started/foundations/responsive/ , https://primer.style/product/hooks/useResponsiveValue/ , https://primer.style/product/components/stack/ , https://raw.githubusercontent.com/primer/react/main/packages/react/src/hooks/useResponsiveValue.ts , https://primer.style/product/getting-started/react/
- S11 Atlassian: https://app.unpkg.com/@atlaskit/primitives@18.1.0/files/dist/esm/responsive/constants.js
- S12 Fluent UI v9: https://github.com/microsoft/fluentui/issues/24289
- S13 Adobe Spectrum: https://react-spectrum.adobe.com/styling , https://react-spectrum.adobe.com/styling.md , https://react-spectrum.adobe.com/.well-known/skills/react-spectrum-s2/SKILL.md , https://raw.githubusercontent.com/adobe/react-spectrum/main/packages/%40react-spectrum/s2/style/spectrum-theme.ts
- S14 GOV.UK: https://design-system.service.gov.uk/styles/layout/ , https://frontend.design-system.service.gov.uk/sass-api-reference/
- S15 Material 3 / Android: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- S16 Platform docs: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries , https://developer.mozilla.org/en-US/docs/Web/CSS/@container , https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries , https://web.dev/blog/cq-stable , https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using , https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
- S17 Support data: https://raw.githubusercontent.com/web-platform-dx/web-features/main/features/container-queries.yml.dist , https://raw.githubusercontent.com/web-platform-dx/web-features/main/features/container-style-queries.yml.dist , https://web-platform-dx.github.io/web-features-explorer/features/custom-media-queries , https://developer.chrome.com/docs/css-ui/style-queries
- S18 CSS specs: https://drafts.csswg.org/mediaqueries-5/ (section 10, read in two parts), https://drafts.csswg.org/mediaqueries-4/#mq-features , https://drafts.csswg.org/css-variables/ (two parts read; no sentence found on `var()` in media conditions)
- S19 Tooling: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media , https://lightningcss.dev/transpilation.html , https://lightningcss.dev/docs.html , https://vite.dev/config/shared-options.html
- S20 React: https://react.dev/reference/react/useSyncExternalStore
- S21 W3C: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html , https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html
- S22 Blog experiments: https://keithjgrant.com/posts/2023/05/px-vs-em-in-media-queries/ , https://zellwk.com/blog/media-query-units/
- S23 Storybook: https://storybook.js.org/docs/essentials/viewport ; local files read: `node_modules/storybook/dist/viewport/index.d.ts`, `node_modules/.pnpm/@storybook+addon-vitest*/.../dist/vitest-plugin/test-utils.js`, `node_modules/.pnpm/@storybook+builder-vite*/.../dist/index.js`
- Local reads: `node_modules/vite/package.json`, `node_modules/vite/dist/node/chunks/node.js` (css options, `minifyCSS`, `compileLightningCSS`, `resolvePostcssConfig`), `pnpm-lock.yaml`, Playwright 1.64.1 `types.d.ts` (`setViewportSize`), `npm view postcss-custom-media`, `npm view lightningcss`.
- Experiments (scratch folder outside the repo): Lightning CSS `transform` with and without `targets`; a Vite 8.3.5 library build with the Lightning transformer; stylelint with the repo config and with a scratch allow-list config.

Could not open (404, empty, redirect not followed, or no useful content): m3.material.io window size classes; MDN `@custom-media`; Stefan Judis custom-media article; Chakra v3 hook pages (`use-breakpoint-value`, `use-breakpoint`); Carbon 2x-grid implementation page; react-aria `useMediaQuery` page; Spectrum `style-macro.html` and `beta/s2/style-macro.html` (head markup only); Atlassian grid and primitives-responsive pages (empty); Fluent storybook responsive page (redirect to `storybooks.fluentui.dev` not followed); Polaris React tokens page (redirects to the Polaris index); Primer React responsive-props page (nothing about breakpoints); Playwright `class-page` excerpts did not contain `setViewportSize` (local typings used instead).
