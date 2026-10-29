# ADR 0010 — Override API

## Status

Proposed

## Context

Omnia styles its components in `@layer components` with CSS-Module class names, which the bundler
hashes (`.button_a1b2c`). Those hashes are not stable across builds, so a consumer who targets them
to restyle a component breaks on the next release. Yet consumers legitimately need to restyle both
whole components and their internal sub-parts (e.g. the loading spinner), and today there is no
sanctioned, documented way to do so. Without a convention, consumers would reach for `!important`
and brittle selectors, and each future component would invent its own ad-hoc approach.

The system already carries two features that solve most of this: native cascade layers (ADR 0002)
declare a single, predictable layer order, and the semantic token contract (ADR 0003) is the global
reskin mechanism. What is missing is (a) a public layer consumers may write into, (b) a per-component
set of overridable variables, and (c) a stable public selector contract that is decoupled from the
hashed class names.

Alternatives considered:

- **A `classNames` slot-map prop** (pass a class per part, e.g. `classNames={{ spinner: '…' }}`).
  Rejected: it adds prop boilerplate to every component and every call site, couples the public API
  to the internal part list in TypeScript, and still needs a layer/specificity story to actually
  win. It buys nothing over a `data-*` selector that CSS can already target.
- **Targeting hashed module classes directly.** Rejected: the hashes are private and unstable.
- **`:global` escape classes baked into each component.** Rejected: that is just a second, hand-named
  class contract to maintain alongside the modules; the `data-*` contract is the standard, framework-
  agnostic version of the same idea.

## Decision

We adopt a **lean, layered override API** — the Radix/Ark data-attribute pattern over CSS cascade
layers and per-component variables. Hashed CSS-Module class names stay private; `data-*` is the
public selector contract. Consumers choose the least powerful tier that works:

1. **Semantic tokens** (`--color-*`, …) for a global reskin.
2. **Per-component variables** `--omnia-<name>-*`, each read with a fallback to its semantic token, so
   the token contract holds when unset.
3. **A stable `data-*` contract** — `data-scope="<name>"` on every part, `data-part="…"` per part,
   and prop-reflecting state hooks (`data-intent`, `data-size`, `data-loading`, `data-disabled`) —
   selected from the new **`@layer overrides`**, the last cascade layer, so consumer rules win over
   `@layer components` without `!important`. The consumer `className` continues to merge onto the
   component's main element and is styled the same way.
4. **The `style` prop** as the documented escape hatch for one-offs.

`@layer overrides` is added as the final layer in `src/styles/layers.css`. Every component documents
its contract (variables, `data-scope`/`data-part`, state attributes) in its `.mdx`, in the format
fixed by `docs/overrides.md`. Button is the reference implementation.

## Consequences

- Consumers get a clear, documented escalation path and never need `!important` or hashed class names.
  Sub-parts become restylable because they are individually addressable by `data-part`.
- Every future component carries the same obligation: expose a small `--omnia-<name>-*` set, render
  the `data-scope`/`data-part`/state contract, and document it. This is now part of "done".
- The public surface a component must not break silently grows: the `--omnia-*` variable names and the
  `data-*` values are a stable contract, like the semantic tokens — renaming them needs a superseding
  ADR.
- Component variables read through a `var(--omnia-…, <token>)` fallback, a negligible CSS cost that
  keeps the no-raw-colour token contract intact (the stylelint gate still passes).
- The override variables cover the rest state; interaction-state colours (`:hover`/`:active`) still
  follow their semantic tokens. A consumer who re-points a rest colour and wants the matching hover
  colour re-points the token, not the component variable. Documented in `docs/overrides.md`.
