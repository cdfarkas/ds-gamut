# ADR 0013 — `--omnia-` prefix on every custom property

## Status

Proposed — supersedes in part ADR 0003, ADR 0008, ADR 0009, ADR 0010 and ADR 0012 (token names only).

## Context

Omnia sets its tokens as custom properties on `:root`, where they are global to the whole page. Until
now only the intent map (`--omnia-intent-*`, ADR 0012) and the per-component override variables
(`--omnia-<component>-*`, ADR 0010) carried a namespace. The primitive and semantic tiers did not:
`--palette-*`, `--color-*`, `--radius-*`, `--shadow-*`, `--border-width-*`, `--font-*`, `--dur-*`,
`--ease-out`, `--press-offset`, plus `--font-family-base` in `src/styles/skins.css`.

Names such as `--color-primary` or `--radius-sm` are common in application code. A consuming app that
defines one of them on `:root` either overrides an Omnia token by accident or has its own value
replaced by Omnia's, depending on load order — a silent visual bug in both directions.

Owner decision, 2026-10-30: the design system's name as a prefix on its CSS variables is essential to
avoid collisions in an app that consumes it.

The package is still unpublished (`"private": true` in `package.json`), so no external consumer
breaks. ADR 0003, 0008, 0009, 0010 and 0012 each declare the token names a stable contract that only a
superseding ADR may rename; this ADR is that record.

Alternatives considered:

- **Prefix only the semantic tier** and leave `--palette-*` bare: primitives are on `:root` too and
  collide just as easily, so the rule would have an exception for no gain.
- **Scope tokens to an Omnia root class** instead of `:root`: themes, skins and inheritance would then
  depend on the consumer wrapping its app, and a consumer variable set on the same element still
  collides.

## Decision

Every Omnia custom property carries the `--omnia-` prefix, primitives and semantics alike, in one
shared namespace with the intent and per-component variables. The rest of the name is unchanged:

- `--palette-*` → `--omnia-palette-*` (e.g. `--palette-cobalt` → `--omnia-palette-cobalt`)
- `--color-*` → `--omnia-color-*` (e.g. `--color-accent` → `--omnia-color-accent`)
- `--radius-*`, `--shadow-*`, `--border-width-*`, `--font-*` → `--omnia-radius-*`,
  `--omnia-shadow-*`, `--omnia-border-width-*`, `--omnia-font-*`
- `--dur-fast`, `--dur-press`, `--ease-out`, `--press-offset` → `--omnia-dur-fast`,
  `--omnia-dur-press`, `--omnia-ease-out`, `--omnia-press-offset`
- `--font-family-base` (`src/styles/skins.css`) → `--omnia-font-family-base`

`--omnia-intent-*` and `--omnia-<component>-*` keep their names; no new name collides with them. The
two-tier structure, every value and every theme and skin assignment are unchanged: this is a pure
rename with no visual change. The private `--fg` / `--bg` inside the brand SVG files belong to the SVG
document, not to the page, and keep their names.

The no-raw-colour stylelint rule is unchanged: its `var(--…)` allowance already covers the new names.

## Consequences

- A consuming app can define its own `--color-*`, `--radius-*` or `--font-*` without touching Omnia,
  and every Omnia variable is recognisable at a glance in devtools.
- Names are longer, in component CSS and in consumer overrides.
- Breaking for any copy of the old names, such as a prototype or note that re-points `--color-accent`.
  No published consumer exists, so the cost is paid now rather than after release.
- The prefixed names are the stable contract from here on; ADR 0003, 0008, 0009, 0010 and 0012 keep
  their decisions, but where they name a token, read it with the `--omnia-` prefix.
- New custom properties start with `--omnia-`. Nothing enforces it yet; a stylelint
  `custom-property-pattern` rule could, if a bare name slips in.
