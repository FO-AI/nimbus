# ADR 0005: Plain-language UI vocabulary, and a flat navigation bar

- Status: Accepted
- Date: 2026-09-12

## Context

Nimbus is aimed at Finance & Operations staff who are not technical. The
interface had grown from the inside out: labels were the names the code uses,
on the assumption that a reader shares the authors' context. A walkthrough of
every page against that reader found the same failure repeatedly.

**Internal vocabulary reached the surface.** "Inventoried", "Needs triage",
"Edit / triage", "Strategic category", "Correlation ID", and a field labelled
"Subject" showing an Entra object GUID. Each is precise to whoever wrote it and
opaque to whoever reads it.

**Raw stored values were printed verbatim.** Tool status rendered as
`under-review`, hyphen and all. The admin edit dropdowns listed `proposed`,
`idea`, `pilot` in lowercase, while the read-only pill beside them showed
"Proposed" — the one place a value had to be *chosen* was the one place it was
not translated. Tags printed as slugs, so `acceptable-use` appeared as written
and the department ITS appeared as the word "its".

**Labels stood alone with no explanation.** Filter rows carried only an
`aria-label`, so a sighted reader faced two or three visually identical rows of
chips with nothing to say which axis each filtered on. Badges — "Links out",
"Practice", "Featured" — were undefined until the reader clicked through to a
detail page. Top-level nav items were bare words; only Guides and Prompts had a
description, and only because they happened to sit inside a dropdown.

**Guides and Prompts, the two most-used destinations, were one click deep**
behind a "Resources" menu button — a nav slot spent on a filler word, and an
extra interaction on the primary paths.

Separately, `/ask` collected `grounded` from the API and never rendered it. An
answer backed by nothing in the library was visually identical to a cited one,
on the page whose entire promise is that answers are cited.

## Decision

**One vocabulary, written down.** Every user-facing label, its meaning, and its
location in code live in [`docs/ui-vocabulary.md`](../ui-vocabulary.md), under
four rules: name things by what they do for the reader; never let a label stand
without a one-line explanation; never print a raw enum, slug or identifier; and
keep the nav label, the page heading, and the links pointing there identical.

**Display labels are mapped, and the maps are exported.** `STATUS_LABELS` and
`STATUS_HINTS` come out of `StatusPill` so the filter chips, the pills, and the
admin dropdowns cannot drift. `tagLabel()` lives in `contentAttributes.ts` with
an acronym override map. Stored values are untouched: this is a presentation
change with no migration.

**A flat navigation bar.** The "Resources" group is gone and all seven
destinations sit at the top level, each with a description that renders as a
hover tooltip on desktop and as visible sub-text in the mobile panel.
`ResponsiveNavBar` keeps its group/dropdown support — it is a generic
component and the public FOAI bar may want it — but its tests now exercise that
feature against a local fixture rather than borrowing Nimbus's own IA, so the
two can change independently.

**`/insights` is labelled "Activity", not "Usage"**, because "Usage" collided
with "AI projects" — both read as *what is being used*.

**`/guides` stays "Guides", not "How-tos"**, because the section holds
playbooks, University rules, and approved-tool pages; "How-tos" would name only
one of the three.

**Content type names are unchanged.** Playbook, Guidance and Tool stay as they
are and carry hover explanations instead. They are the vocabulary the content
library itself is organised around (`apps/api/content/`), and renaming the
display labels while the frontmatter `kind`, the directory names, and
`apps/api/content/README.md` all said something else would trade one confusion
for a worse one.

**Positioning is unchanged.** Nimbus addresses Finance & Operations staff. A
university-wide framing was considered and rejected for now: the shipped
library is F&O-authored and the department filters are F&O units, so all-UNC
copy would promise more than the content delivers. The brand subtitle — "AI
help for Finance & Operations" — states the audience on every page. Widening
the audience is a content decision first and a copy decision second.

## Consequences

A new label is now a two-file change: the map in code, and the row in
`docs/ui-vocabulary.md`. That is deliberate friction — an unmapped value
reaching a page is the bug class this ADR exists to prevent.

Renaming labels broke the tests that asserted on them, which is the tests doing
their job; the specs were updated alongside. The two E2E tests covering the
Resources dropdown were replaced with tests that every destination is one click
away and that every nav item explains itself on hover.

`ResponsiveNavBar`'s group support now has no production caller in the Nimbus
bar. It is kept rather than deleted because the component is generic and the
behaviour is fully covered; if it is still unused when the public bar is next
revisited, delete it then.

The vocabulary doc is only true while it is maintained. It is short, it is
organised by where each label lives in code, and it is linked from `CLAUDE.md`
so it is in front of whoever adds the next label.
