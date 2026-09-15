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
   it.** `content_items.attributes.status == "under-review"` is a database
   fact. "Under review — not yet cleared for use" is what the reader needs.
2. **No label stands alone.** Every nav item, filter row, badge, and status
   carries a one-line explanation — as a `title` tooltip, visible sub-text, or
   a hint next to the group label. A reader should never have to click
   something to learn what it is.
3. **Never print a raw enum, slug, or identifier.** Values arriving as
   `under-review`, `acceptable-use`, or `its` get mapped to a display label
   before they reach the page. A missing map is a bug, not a default.
4. **One destination, one word.** The nav label, every link pointing there,
   and the page heading are built on the same noun: a reader who clicks
   "Activity" lands on "Activity", and one who clicks "Prompts" lands on the
   "Prompt library" — the heading may add a word, never swap the word. The
   single exception is the signed-in home page, whose heading is a welcome
   line rather than a name.

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
display label and its explanation do. `KIND_LABEL`, `KIND_HINT`,
`KIND_FILTER_LABEL` and `CITATION_LABEL` all live in
`apps/web/src/lib/contentKind.ts`, because four places render them — the home
page badges, the guides filter chips, the guides card badges, and `/ask`
citations — and while each kept its own copy they had already drifted apart.

| Stored `kind` | Shown as | Explained as |
| --- | --- | --- |
| `playbook` | Playbook | A step-by-step walkthrough of a specific task |
| `guidance` | Guidance | University rules and policy, explained in plain language |
| `tool` | Tool | An approved AI tool: what it does and who can use it |
| `prompt` | Prompt | Ready-made instructions you can copy into an AI tool |

In `/ask` citations, `tool` renders as "Tool page" and the extra source type
`project` renders as "AI project", so a citation says what kind of page it is
pointing at. `Citation.kind` is a free-form string on the API, so an unmapped
kind falls back to "Nimbus page" rather than printing the stored value.

The guides filter chips use the plural (`KIND_FILTER_LABEL`: "Playbooks",
"Tools") because a chip selects a set; a badge names one page.

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

`ProjectSource`, in `apps/web/src/lib/projectSource.ts`. `SOURCE_LABELS` and
`SOURCE_HINTS` are exported so the list badge, the filter chips, the detail
page, and the "project added" confirmation cannot drift apart — they said
"AI team" in one place and "Inventoried" in another. The filter row is headed
**How it got here**, and the chip uses the same word as the badge.

The proposal wording is deliberate, and was chosen over "Staff idea" /
"AI team" in review: "Added by the AI team" reads as though the AI team
thought of the work. These projects come from teams across Finance &
Operations and the AI team only records them, so the label names the route
onto the list, not the author of the idea.

| Stored source | Badge and chip | Explained as |
| --- | --- | --- |
| `proposed` | Proposal | Came in as a proposal from a member of staff, through Suggest an idea |
| `inventoried` | Inventoried | Work already under way, recorded in the inventory by the AI team |

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
| `approved by request` | Approved on request | Cleared for use, but you have to ask for access before you can start |
| `under-review` | Under review | Not yet cleared for use; the review is still in progress |
| `retired` | Retired | No longer supported. Do not start anything new with this tool. |

The set is closed. `test_tool_status_is_one_the_ui_can_label` in
`apps/api/app/tests/test_content_library.py` fails the build on a tool whose
`status` has no entry in the map, because an unmapped status reached the reader
as a raw slug with no tooltip. A status that does slip through renders as
"Status not confirmed" rather than as itself.

## Tags

Tags are authored as slugs and were printed verbatim, which put lowercase
`acceptable-use` in front of readers and turned the department ITS into the
word "its". `tagLabel()` in `apps/web/src/lib/contentAttributes.ts` title-cases
them, with an override map for acronyms (ITS, AP, PHI, FERPA, HIPAA, OHR, RFP,
ISO, SOG, DGOG, AI, HR, IT) and for names whose capitals are internal
(ConnectCarolina, LinkedIn Learning, PromptLab). Overrides apply **per
hyphen-separated word**, so `ai-literacy` reads "AI literacy" rather than
"Ai literacy". **Add an override whenever a new tag is an acronym.** The filter
row is headed **Topic**. Tags are labelled everywhere they render — the filter
chips and the guide and prompt detail pages.

## Actions

| Action | Where | Why this wording |
| --- | --- | --- |
| Suggest an idea | `/propose`, the signed-out landing page | "Propose an AI use case" is three pieces of jargon. Anyone can suggest an idea; nothing about it commits the person. The form submits with "Submit idea" and confirms with "Thanks — your idea is in". |
| Add an existing project | `/projects/inventory`, admin | "Inventory" as a verb is not natural English. The form submits with "Add to the inventory". |
| Edit / review | project detail, admin | Was "Edit / triage". |
| Review notes | project edit form **and** the read-only detail view, admin | Was "Triage note". One field, one name: the editor and the read-only view showed two different labels for the same text. Visible to whoever submitted the idea, which the placeholder now says. |
| Business value | `/propose`, `/projects/inventory`, and the project edit form | One field, `businessValue`, had three names — "Expected value", "Business value", and "What would it save you?". |
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

`grounded` describes the **answer**, not the retrieval. The API sets it by
looking for the inline `[1]`, `[2]` markers the system prompt asks for, so it
is false both when retrieval came back empty and when the model answered
without leaning on the sources it was given — the second case being the one
worth warning about, and the one the flag used to miss entirely. When an answer
is grounded, the citation list is narrowed to the sources it actually cited and
headed "Where this answer came from"; when it is not, the retrieved pages are
still offered but headed "Related pages you could check".
