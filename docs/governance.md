# Governance

Decisions are recorded as **ADRs** (Architecture Decision Records) in `docs/adr/`. Each ADR captures
the context, the decision, and its consequences, and carries a status.

## Changing a locked decision

A decision recorded in an Accepted ADR changes only when **all four** hold:

1. a **reasoned written argument** for the change,
2. **verifiable evidence** — a failing or passing test, or a benchmark — not an opinion,
3. an **explicit human decision**, and
4. a **PR that supersedes the ADR** (the old one is marked Superseded, linked to the new one).

## No silent deviation

If a rule blocks you mid-task, do not quietly work around it. **Flag it, pick a sane default, and
note it for human review** — in the PR description or an ADR stub — so the decision stays visible and
contestable. A guess that hides a broken rule costs more than the pause to surface it.
