# ADR 0007 — Bilingual via typed strings + `t()` indirection (two-way door to i18next)

## Status

Proposed

## Context

The system must be bilingual FR/EN for component labels and ARIA strings, and for authored docs
prose. Nothing is published and there is no backend, so a full i18n framework (i18next and its
runtime, plugins and config) would be ceremony disproportionate to the need.

But the choice should not paint us into a corner if real i18n is needed later.

## Decision

Use a tiny **`t(key)` indirection** over a **typed `Record<Locale, …>`**, driven by a `locale`
toolbar global. **No i18n library.** Component labels and ARIA strings go through `t()`; MDX prose is
authored by hand in both FR and EN. Autodocs auto-generated blocks (JSDoc descriptions, arg tables)
stay single-language — accepted.

## Consequences

- Minimal code, typed keys, full FR/EN coverage of interactive strings without a framework.
- **Two-way door**: because call sites use `t()`, swapping the map for i18next later is
  `i18next.init({ resources })` with the same string objects — call sites stay unchanged.
- Auto-generated doc blocks are single-language; this is a deliberate, accepted limit.
