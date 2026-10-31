# Naming study — status label, counter and dot overlays

Date: 2026-10-30. Method: official docs opened during this study. "None documented" means the pages opened do not mention it, not that the system lacks it.

## Question

Omnia has a non-interactive status pill named `Badge` (intents primary/neutral/danger). It also needs a corner-anchored counter (unread count, "99+") and a corner-anchored dot (unread, online, error). What should the three be called, and should the counter and dot be one component or two?

## Survey

| System          | (1) status label                    | (2) counter overlay             | (3) dot overlay                   | One or separate  | Src |
| --------------- | ----------------------------------- | ------------------------------- | --------------------------------- | ---------------- | --- |
| MUI             | none documented (Chip is a control) | Badge `badgeContent`            | Badge `variant="dot"`             | One              | S1  |
| Material (M3)   | not verified                        | Badge with text (large)         | Badge, no content (small)         | One              | S2  |
| Ant Design      | Tag; also Badge `status` + `text`   | Badge `count`                   | Badge `dot`                       | One              | S3  |
| Mantine         | Badge                               | Indicator `label`               | Indicator, no `label`             | One              | S4  |
| shadcn/ui       | Badge                               | none documented                 | none documented                   | n/a              | S5  |
| Radix Themes    | Badge                               | none documented                 | none documented                   | n/a              | S6  |
| Chakra UI       | Badge, Tag, Status                  | none (`Float` positions things) | none documented                   | n/a              | S7  |
| Fluent UI v9    | Badge                               | CounterBadge                    | CounterBadge `dot`; PresenceBadge | One (+ presence) | S8  |
| Atlassian       | Lozenge                             | Badge (numbers only, inline)    | none documented                   | n/a              | S9  |
| Shopify Polaris | Badge (`s-badge`)                   | none documented                 | none documented                   | n/a              | S10 |
| GitHub Primer   | Label, StateLabel                   | CounterLabel (inline)           | none found                        | n/a              | S11 |
| IBM Carbon      | Tag (read-only variant)             | BadgeIndicator (source only)    | no `dot` prop in typings          | n/a              | S12 |
| Adobe Spectrum  | Badge                               | NotificationBadge `value`       | NotificationBadge, no `value`     | One              | S13 |
| GOV.UK          | Tag                                 | none found                      | none found                        | n/a              | S14 |
| Apple HIG       | not verified                        | not verified                    | not verified                      | not verified     | —   |

Notes on cells:

- Material: only the Compose and Android implementation docs were readable (S2); the m3.material.io pages returned just a title. Android calls them "small" and "large" badges.
- Fluent: `PresenceBadge` is availability (available/away/busy), not a generic dot.
- Atlassian: Badge "should only be used to represent a number"; "For non-numeric status information, use a lozenge" (S9).
- Carbon: the docs page for `BadgeIndicator` was not reachable; its typings expose only `count`, `id`, `className` (S12).
- The Component Gallery lists these other names for the same ideas: Lozenge (Atlassian), Status label (Helsinki), Counter Badge (Ruter), Notification badge (Orbit, PatternFly), Badge count (Helios) (S15).

## Patterns observed

Of the 15 systems, 12 gave a usable answer for (1); MUI, Material and Apple did not.

1. **Badge = label, overlay named separately or absent** (Mantine, Spectrum, shadcn, Radix, Chakra, Polaris): 6 systems. Only Mantine (`Indicator`) and Spectrum (`NotificationBadge`) document an overlay under another name.
2. **Badge = overlay** (MUI, Material, Ant Design, Fluent's `CounterBadge`): 4 systems. Ant names its label `Tag` and its Badge also works standalone; the label name is unverified for MUI and Material.
3. **No "Badge" for the label** (Atlassian Lozenge, Carbon Tag, GOV.UK Tag, Primer Label/StateLabel): 4 systems. GOV.UK says a tag must not be made interactive (S14); Carbon splits read-only from interactive tags (S12).

Facts that cut across the patterns:

- "Badge" means three different things in the sample: label (shadcn, Radix, Polaris), overlay (MUI, Material), numbers-only (Atlassian). Fluent's own spec calls it "a base visual descriptor" for a number, status or general info (S8).
- 7 systems document an overlay (MUI, Material, Ant, Mantine, Fluent, Spectrum, plus Carbon's source). In all 7, counter and dot are one component. None splits them. Fluent's extra component is for presence, not for the dot.
- Systems that call the label "Tag" mostly allow interaction (Ant closable/checkable, Chakra closable, Carbon dismissible/selectable). GOV.UK is the exception.

## Accessibility notes (counter and dot)

- **MUI**: no built-in screen-reader text. Put the meaning on the host's accessible name, e.g. `aria-label="Inbox, 4 unread messages"` (S1).
- **Fluent**: badges are not focusable. Describe via `aria-describedby` on the decorated element ("Chat, 6 unread"); a colour-only dot needs non-visual text the same way (S8).
- **Spectrum** (source code, not docs): the span gets `role="img"` plus `aria-label` when one exists. An indicator-only badge falls back to a localized default label (S13).
- **Android Material**: a content description is generated from the number or text, with setters for plural strings, "exceeds max" and a "numberless" badge (S2).
- **Primer**: always pair the count with adjacent text saying what it counts (S11).
- **Atlassian**: pair the badge with a single item or label so it is clear what is counted (S9).
- **Ant, Mantine, Chakra, shadcn, Radix**: no a11y guidance for badge or indicator on the pages opened.
- **WAI-ARIA APG**: no badge, status or count pattern among its 30 patterns (S16).

Common denominator: the host element's accessible name carries the count and meaning, and the visual badge is decoration. The dot is the riskiest case, because it carries information with no text at all.

## Options for Omnia

**A. Keep `Badge` (label) and add one `Indicator` (counter and dot).**

- Pro: no rename of finished work. Same pair as Mantine. Matches the most common reading of "Badge" in the sample (label).
- Pro: one component for count and dot matches every overlay system opened.
- Con: only Mantine documents "Indicator". Users coming from MUI or Ant will look for `Badge` and find a label.
- Con: `Badge` stays ambiguous, as the evidence above shows.

**B. Rename the label to `Tag`, give `Badge` to the overlay.**

- Pro: matches MUI, Ant and Material for the overlay.
- Con: `Tag` implies removable or selectable in Ant, Chakra and Carbon, while Omnia's label is deliberately static.
- Con: rename cost on code, stories, ADR 0011 and the public export.

**C. Keep `Badge` (label), add `NotificationBadge` (counter and dot).**

- Pro: self-describing and discoverable, same family name. Spectrum S2 uses it; Orbit and PatternFly use the name too (S15).
- Con: "notification" is wrong for an online or error dot, and the name is long.

**D. Rename the label to `StatusLabel` or `Label`.**

- Pro: unambiguous, close to Primer and Helsinki.
- Con: `Label` collides with form labels. `StatusLabel` is long, and the pill also carries non-status text like "New" or "Beta".

## Recommendation

Opinion, built on the facts above: take option A. Keep `Badge` for the label and add a single `Indicator` wrapper whose count is optional (no count = dot), with a `max` (99+) and a required accessible description on the host. No system opened has a reason to split counter and dot.

Devil's advocate on that pick: `Indicator` has one documented precedent (Mantine). If discoverability matters more than precision, C is the safer name. The choice is cheap to reverse before `Indicator` is built and expensive after both ship, so confirm it at the ADR step.

Not decided here: visual spec, corner positions, and whether `Indicator` is an atom or a molecule.

## Decision

Option A, chosen by the owner on 2026-10-30: `Badge` stays the status label; the counter and dot
overlays become one future `Indicator` component (no count = dot). `Indicator` gets its own plan when
its turn comes.

ADR 0015 (2026-10-31) checked the props against native names: `intent` is not native and stays.

## Sources

All opened 2026-10-30.

- S1 MUI: https://mui.com/material-ui/react-badge/ , https://mui.com/material-ui/react-chip/
- S2 Material: https://developer.android.com/develop/ui/compose/components/badges , https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/BadgeDrawable.md , https://m3.material.io/components/badges/overview (title only)
- S3 Ant Design: https://ant.design/components/badge , https://ant.design/components/tag
- S4 Mantine: https://mantine.dev/core/indicator/ , https://mantine.dev/core/badge/
- S5 shadcn/ui: https://ui.shadcn.com/docs/components/badge
- S6 Radix Themes: https://www.radix-ui.com/themes/docs/components/badge
- S7 Chakra: https://chakra-ui.com/docs/components/badge , https://chakra-ui.com/docs/components/tag , https://chakra-ui.com/docs/components/float , https://chakra-ui.com/docs/components/status
- S8 Fluent UI v9 (GitHub sources): https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-badge/library/docs/Spec.md , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-badge/stories/src/Badge/BadgeDescription.md , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-badge/stories/src/PresenceBadge/PresenceBadgeDescription.md
- S9 Atlassian: https://atlassian.design/components/badge/badge/usage , https://atlassian.design/components/lozenge/lozenge/usage , https://developer.atlassian.com/platform/forge/ui-kit/components/badge/
- S10 Polaris: https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/badge , https://shopify.dev/docs/api/polaris/using-polaris-web-components
- S11 Primer: https://primer.style/product/components/counter-label/ , https://primer.style/product/components/counter-label/accessibility/ (page truncated in fetch) , https://primer.style/product/components/label/ , https://primer.style/product/components/state-label/ , https://primer.style/product/components/circle-badge/ , https://primer.style/product/components/
- S12 Carbon: https://carbondesignsystem.com/components/tag/usage/ , https://app.unpkg.com/@carbon/react@1.85.1/files/es/components/BadgeIndicator/index.d.ts
- S13 Spectrum: https://react-spectrum.adobe.com/react-spectrum/Badge.html , https://raw.githubusercontent.com/adobe/react-spectrum/main/packages/@react-spectrum/s2/src/NotificationBadge.tsx
- S14 GOV.UK: https://design-system.service.gov.uk/components/tag/
- S15 Component Gallery: https://component.gallery/components/badge/
- S16 Other: https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/ (static badge vs interactive tag), https://www.w3.org/WAI/ARIA/apg/patterns/

Could not open (404, empty, or title only): Apple HIG badges (3 URLs), m3.material.io guidelines and accessibility pages, GOV.UK notification-badge, component.gallery tag page, Carbon badge-indicator and notification-badge pages, spectrum.adobe.com badge page, Fluent 2 and Fluent storybook pages, Atlassian badge landing page, Polaris React pages, Queensland design system (403). No Nathan Curtis / EightShapes naming article was found.
