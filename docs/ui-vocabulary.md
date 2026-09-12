# UI vocabulary

Every word the interface shows a reader, what it means, and where it lives in
code. Add to this file whenever you add a user-facing label.

## Who is reading

A **Finance & Operations staff member who is not technical**. They know their
own job — budgets, procurement, payroll, travel, HR — and they do not know
what retrieval is, what a slug is, or what "triage" means outside a hospital.
They arrive because someone told them Nimbus exists, and they leave if the
first screen reads like it was written for the people who built it.

Everything below follows from that one reader.

## The four rules

1. **Name the thing by what it does for the reader, not by what the code calls
   it.** `content_items.source == "inventoried"` is a database fact. "Added by
   the AI team" is what the reader needs.
2. **No label stands alone.** Every nav item, filter row, badge, and status
   carries a one-line explanation — as a `title` tooltip, visible sub-text, or
   a hint next to the group label. A reader should never have to click
   something to learn what it is.
3. **Never print a raw enum, slug, or identifier.** Values arriving as
   `under-review`, `acceptable-use`, or `its` get mapped to a display label
   before they reach the page. A missing map is a bug, not a default.
4. **The nav label, the page heading, and the link that points there all use
   the same word.** A reader who clicks "Activity" must land on a page titled
   "Activity".

## Navigation

The bar is flat: seven destinations, each one click away, each with a
description that is the hover tooltip on desktop and visible sub-text in the
mobile panel. Defined once in `apps/web/src/components/AppNavBar.tsx`.

| Label | Route | Page heading | Description shown to the reader |
| --- | --- | --- | --- |
| Home | `/home` | AI for Finance & Operations | Start here |
| Guides | `/guides` | Guides | How to do a task with AI, what's allowed, and which tools are approved |
| Prompts | `/prompts` | Prompt library | Ready-made instructions you can copy into an AI tool |
| Ask | `/ask` | Ask Nimbus | Ask a question and get an answer with links to where it came from |
| AI projects | `/projects` | AI projects | What Finance & Operations teams are building with AI, and how far along they are |
| Activity | `/insights` | Activity | How much Nimbus is being used — totals only, never per person |
| Profile | `/profile` | Your profile | Your account and what you can do in Nimbus |

Two names are deliberately not what they look like they should be:

- **`/insights` is labelled "Activity"**, not "Usage". "Usage" collided with
  "AI projects" — both read as *what is being used* — and the page is a count
  of what happened, which is activity.
- **`/guides` stays "Guides"**, not "How-tos". The section holds three content
  types, and only one of them is a how-to; the other two are University rules
  and approved-tool pages. "How-tos" would name a third of the section.

The brand carries a permanent subtitle, "AI help for Finance & Operations",
because "Nimbus" on its own tells a first-time visitor nothing.

## Content types

The library's four `kind` values. The stored value never changes; only the
display label and its explanation do. Mapped in the page that renders them —
`home/page.tsx`, `guides/page.tsx`, and `CITATION_LABEL` in `ask/page.tsx`.

| Stored `kind` | Shown as | Explained as |
| --- | --- | --- |
| `playbook` | Playbook | A step-by-step walkthrough of a specific task |
| `guidance` | Guidance | University rules and policy, explained in plain language |
| `tool` | Tool | An approved AI tool: what it does and who can use it |
| `prompt` | Prompt | Ready-made instructions you can copy into an AI tool |

In `/ask` citations, `tool` renders as "Tool page" and the extra source type
`project` renders as "AI project", so a citation says what kind of page it is
pointing at.

## Project stages

`ProjectStatus`, in `apps/web/src/components/StatusPill.tsx`. `STATUS_LABELS`
is the display name and `STATUS_HINTS` the hover explanation; both are exported
so the filter chips, the status pills, and the admin edit dropdowns cannot
drift apart. The column and the filter row are both headed **Stage**.

| Stored status | Shown as | Explained as |
| --- | --- | --- |
| `proposed` | Proposed | Submitted by staff, waiting to be reviewed |
| `idea` | Idea | Reviewed and worth doing, but not started yet |
| `pilot` | Pilot | Being trialled with a small group |
| `active` | Active | In use day to day |
| `paused` | Paused | Stopped for now, may restart later |
| `done` | Done | Finished and handed over |
| `rejected` | Rejected | Reviewed and not going ahead |

## How a project got here

`ProjectSource`. "Inventoried" was insider shorthand for *the AI team typed
this in themselves*; the labels now say who put it there, which is what a
reader wants to know. The filter row is headed **How it got here**.

| Stored source | Filter chip | Row badge |
| --- | --- | --- |
| `proposed` | Submitted by staff | Staff idea |
| `inventoried` | Added by the AI team | AI team |

Two more badges appear on a project row: **Archived** (closed or no longer
being worked on; hidden from the default list, restorable at any time) and
**Needs review**, admin-only, on anything still at `proposed`. "Needs review"
replaced "Needs triage" — triage is support-desk vocabulary.

## Provenance badges

`SourceBadge` in `apps/web/src/components/SourceNote.tsx`, from the `source`
block documented in [ADR 0004](adr/0004-content-source-provenance.md). On a
list card the badge word alone explained nothing until you opened the page, so
each carries its explanation as a tooltip.

| `source.mode` | Badge | Tooltip |
| --- | --- | --- |
| `link` | Links out | A short summary here; the full material lives on another website |
| `practice` | Practice | A hands-on exercise using real, public University data |
| `import` / `original` | Adapted | Based on an outside source, rewritten for Finance & Operations |

**Featured** means "picked out by the AI team as a good place to start".

## Tool status

From tool-page frontmatter, mapped in `apps/web/src/components/ToolFacts.tsx`.
These were rendering as raw slugs, so `under-review` reached readers with a
literal hyphen.

| Stored value | Shown as | Explained as |
| --- | --- | --- |
| `approved` | Approved | Cleared for Finance & Operations use, within the data rules below |
| `pilot` | In pilot | Being trialled with a small group — check before relying on it |
| `under-review` | Under review | Not yet cleared for use; the review is still in progress |
| `retired` | Retired | No longer supported. Do not start anything new with this tool. |

## Tags

Tags are authored as slugs and were printed verbatim, which put lowercase
`acceptable-use` in front of readers and turned the department ITS into the
word "its". `tagLabel()` in `apps/web/src/lib/contentAttributes.ts` title-cases
them, with an override map for acronyms (ITS, AP, PHI, FERPA, HIPAA, OHR) and
for names that do not survive naive casing. **Add an override whenever a new
tag is an acronym.** The filter row is headed **Topic**.

## Actions

| Action | Where | Why this wording |
| --- | --- | --- |
| Suggest an idea | `/propose` | "Propose an AI use case" is three pieces of jargon. Anyone can suggest an idea; nothing about it commits the person. |
| Add an existing project | `/projects/inventory`, admin | "Inventory" as a verb is not natural English. |
| Edit / review | project detail, admin | Was "Edit / triage". |
| Review notes | project edit form, admin | Was "Triage note". Visible to whoever submitted the idea, which the placeholder now says. |
| Ask Nimbus | home, `/ask` | Matches the page heading and the nav item. |

## Forms

- Required fields use `RequiredLabel` (`apps/web/src/components/ui.tsx`), which
  keeps the asterisk people scan for and adds "(required)" for screen readers
  plus a tooltip. A bare `*` assumes the reader knows the convention.
- Optional fields say "(optional)" in the label rather than leaving the reader
  to infer it from the absence of an asterisk.
- Every free-text field carries a placeholder showing what belongs in it. The
  admin edit form had none, so the only explanation of "Dependencies" versus
  "Risks" lived in a form that admins never see.
- Forms are held to `max-w-2xl`. A field stretched across the full page is
  unreadable, and a long line implies a long answer is expected.

## Errors and empty states

- `ErrorState` names the support address (`SUPPORT_EMAIL` in
  `apps/web/src/lib/config/index.ts`) and presents the correlation id as "quote
  this reference", because "Correlation ID:" means nothing to the reader who
  sees it. Form submissions pass `hint` to say the typed answers are still
  there.
- Every empty state offers the next action — usually "Clear filters". An empty
  state with no way forward is a dead end.
- A disabled control always says what would enable it.

## When an answer is not grounded

`/ask` renders a warning when the API returns `grounded: false`, telling the
reader the answer is not backed by a Nimbus page and to check with the AI team.
Nimbus's whole promise is cited answers; an uncited one must not look identical
to a cited one.
