# Resource catalog — import log

What was actually imported from `docs/resource-catalog.md`, across two passes.

- **Sprint 1 (2026-09-08)** — tools in link mode only, guidance deprioritized,
  prompts fully imported with the schema reshaped. Those were the priorities
  set in the catalog review.
- **Sprint 2 (2026-09-11)** — everything sprint 1 left: the §2 guidance, the
  remaining §3a playbooks, the §3d practice material, the §4c in-house
  prompts, and the §5 training page. **The catalog is now fully imported.**

Sprint 1 is recorded first; sprint 2 begins at *Sprint 2* below.

The schema the review called for — "link schema doesn't exist yet; needs to be
designed in line with existing content item patterns" — is the `source` block:
`apps/api/content/README.md` for the shape, `docs/adr/0004-content-source-provenance.md`
for the reasoning.

## Sprint 1 — 2026-09-08

### What landed

| Kind | Before | After | Mode |
| --- | --- | --- | --- |
| `tool` | 1 | 6 | all `link` |
| `guidance` | 1 | 1 | `original` (deprioritized, one consistency edit) |
| `playbook` | 3 | 3 | unchanged |
| `prompt` | 6 | 60 | 6 `original`, 54 `import` |

### Tools — §1, link mode

All six entries from the catalog table, each `related_slugs: [sensitive-data]`
and carrying `access` and `data_tier`: `copilot-chat`, `microsoft-365-copilot`,
`copilot-studio`, `promptlab`, `zoom-ai-companion`, `adobe-firefly`.

§6.5 is resolved. The old single `microsoft-365-copilot.md` was split, because
access genuinely differs: Copilot Chat is free with an Onyen, the licensed tier
is ~$20/user/month through local IT. The invented contact `its-copilot@unc.edu`
is replaced with the real route on ITS's page — the Help Portal or
919-962-HELP (4357). "Low or moderate sensitivity" is replaced everywhere with
the §6.2 phrasing, **"Tier 1 and 2; never Tier 3."** The slug
`microsoft-365-copilot` was kept for the licensed entry so existing links and
`related_slugs` still resolve.

§6.1 is **resolved by decision (2026-09-08): PromptLab is Tier 1 and 2.** The
two University pages still disagree — `ai.unc.edu/tools` says Tier 0–1, the
Library's platform comparison says Tier 2 — and Nimbus follows the Library on
the grounds that it runs PromptLab and classifies its own service. The tool
page states the tier plainly and records why, so the basis is traceable if
anyone revisits it. Note this is the *more permissive* of the two readings; if
the Provost's page turns out to be current, the ceiling has to come back down
and the 16 prompts that suggest PromptLab need rechecking.

§6.6: Adobe Firefly is included for completeness and says plainly that F&O use
is narrow.

### Prompts — §4a, import mode

54 prompts, screened against the four rules in §4a and re-voiced for UNC
(department names, the Tier vocabulary, ConnectCarolina / InfoPorte /
BuyCarolina / Concur where the source named a generic ERP).

| Library | Licence | Taken |
| --- | --- | --- |
| awesome-microsoft-copilot-prompts | CC BY-SA 4.0 | 36 — Finance 14, Procurement & Vendor 10, Admin & Executive 8, HR & People 4. One over the 30–35 the review set; kept deliberately rather than dropping a screened prompt to hit a round number. |
| UK Government AI Knowledge Hub | OGL v3.0 | 13 |
| Wharton Generative AI Labs | CC BY 4.0 | 5 |

Attribution and licence travel in each file's `source` block and render at the
foot of the prompt page. **CC BY-SA is share-alike**: adaptations of the
Microsoft-repo prompts must stay under CC BY-SA 4.0, and the page says so.

### Screened out, deliberately

The Staff Generative AI Usage Guidance prohibits using AI to hire, evaluate, or
discipline employees. That removed most of the "HR & People" collection:
interview question sets, candidate screening summaries, recruiting outreach,
performance feedback drafts, employee-relations case notes, and compensation
benchmarking. Four survived — position description, policy FAQ, training outline, survey
themes — because they describe work, not people.

Also dropped:

- **UK Gov "Prepare for a 1:1 with your line report"** — summarizing a
  supervisee's recent activity to prepare a conversation about them is
  evaluation-adjacent. Its counterpart, "prepare for your *own* review", was
  kept, with an explicit warning not to run it against anyone else's mailbox.
- **Most of the Wharton library** — it is written for a classroom (tutoring,
  quizzes, teaching blueprints, simulations for students). The five taken are
  the critique-and-reasoning patterns the catalog asked for.
- **Microsoft prompts that duplicated existing in-house content** — variance
  story draft, meeting minutes, process documentation, PO query research.

### Guidance — deprioritized, with one exception

The eleven §2 link entries are not imported, per the review.

`sensitive-data.md` was rewritten anyway, because every new tool and prompt
links to it and the tools now speak in Tier 0–3. It gained the tier table, the
prohibition on AI in hiring/evaluation/discipline, the public-records point
(§6.4), the ISO → DGOG intake path, and the "external obligations override the
tier" rule. This is narrower than §7.2 asks for.

### Closed since the first pass

**§4b (Prompt Gallery + CLEAR)** — was "link from every prompt page's 'How to
adapt it' section", and none of the 60 did. Rather than repeating two raw URLs
across 60 files, there is now a `how-to-write-a-prompt` guidance page in link
mode over the Library's CLEAR guide, which also carries the Prompt Gallery
link. Every prompt references it in `related_slugs` and links it from "How to
adapt it"; `test_content_library.py` fails the build if one stops doing so.
This also delivers half of §7.2.

**Tool label drift** — 34 prompts said `tool: Microsoft 365 Copilot (licensed)`
while the registry entry is titled "Microsoft 365 Copilot (licensed, inside the
Office apps)". Prompts now carry `tool_slug` as the identity, `tool` stays a
display label, the lint fails if a slug names no tool, and the chip on a prompt
page links through to the tool.

### Fixed in passing

`sensitive-data.md` and `budget-variance-narrative.md` linked to `/t/…` and
`/p/…`, which are not routes in this app — both 404'd silently. Corrected to
`/guides/…` and `/prompts/…`, and `test_content_library.py` now fails the build
if either pattern reappears.

The six pre-existing prompts said `tool: Microsoft 365 Copilot`, which is now
ambiguous (that title belongs to the licensed entry). All six are paste-in
prompts, so they are relabelled `Microsoft 365 Copilot Chat` — otherwise the
library's tool filter offers three variants of the same product. Two used
`department: Operations`, off the §4c vocabulary; changed to `All`.

## Sprint 2 — 2026-09-11

Closes every item the first pass left open, except §6.1, which needs another
office to act.

| Kind | Before | After | Added in this pass |
| --- | --- | --- | --- |
| `tool` | 6 | 6 | — (cross-links only) |
| `guidance` | 2 | 15 | 11 `link` (§2) + 2 `original` |
| `playbook` | 3 | 8 | 3 `original` (§3a) + 2 `practice` (§3d) |
| `prompt` | 60 | 68 | 8 `original` (§4c) |

### Guidance — §2, link mode

The eleven §2 entries, each `mode: link` with publisher and retrieval date,
paraphrased rather than copied: `staff-ai-usage-guidance`,
`information-classification-standard`, `using-ai-appropriately`,
`ai-in-performance-management`, `ai-data-privacy`,
`ai-deepfakes-payment-fraud`, `software-vendor-risk-assessment`,
`data-governance-policies`, `ai-and-public-records`,
`ai-and-digital-accessibility`, `copilot-data-privacy`.

Each is written for F&O rather than summarizing its source page evenly. The
deepfake entry is the clearest case: ITS's general cyber-threat article becomes
verification steps for the teams that move money, because that is the half of
it Accounts Payable, Payroll, and Travel need.

`information-classification-standard` overlaps `sensitive-data` by design.
`sensitive-data` is the working page — "what can I paste" — and the standard
entry is the authority to cite when somebody needs the policy itself. They
link each other, so the overlap reads as a choice rather than a duplicate.

Plus `getting-a-tool-approved` (§7.2, `original`), the page `copilot-studio.md`
and `sensitive-data.md` had both been waiting to link. Both now link it.

### Playbooks — §3a and §3d

Three more Copilot apps: `copilot-teams-meeting-recap` (carrying the
public-records consequence and the run-without-transcribing option),
`copilot-powerpoint-leadership-update`, and `copilot-pages-shared-notes` —
Pages vs Notebooks vs Loop, which is a choice staff routinely get wrong and
then have to migrate out of.

§3a's two remaining rows are covered rather than duplicated: "Get started
writing prompts" is `how-to-write-a-prompt`, and Agent Builder vs Copilot
Studio is in the `copilot-studio` tool entry.

**`mode: practice` is now used.** `practice-budget-book-variance` (the
FY2025-26 Budget Book) and `practice-annual-report-qa` (the 2025 ACFR) are the
two §3d documents as exercises. Both are Tier 0 throughout, which makes them
usable for a team session and for a unit whose own tool is still in approval.
The ACFR exercise teaches verification specifically — requiring page citations
and then checking them — rather than summarizing.

**Decision: §3a playbooks stay `mode: original`.** The catalog marks them
"Link", but a `link` source block renders "This page summarizes guidance
published by Microsoft. Where the two differ, the original is correct" — which
is false for a page carrying UNC's tier rules and public-records warnings.
Microsoft is authoritative on where the button is, not on what a UNC employee
may put into it. Every playbook instead ends with a "Microsoft's own
documentation" link, which is what §3a's link mode was there to protect. Also
recorded in the catalog under §7.

### Prompts — §4c, authored in-house

Eight, `mode: original`, filling the gaps the imports left:

| Department | Added |
| --- | --- |
| Finance | `journal-entry-justification`, `reconciliation-exception-summary`, `close-package-status-update` |
| Budget | `budget-request-narrative` |
| Procurement | `contract-clause-plain-language` |
| Facilities | `work-order-trend-summary`, `space-request-response`, `facilities-project-status-update` |

Facilities went from **one** prompt to four. That was the largest coverage gap
in the library — §4c named three Facilities topics and none of them had been
written, because the external libraries do not cover the work.

`contract-clause-plain-language` is deliberately constrained: Tier 1 documents
only, and the prompt itself forbids the model from evaluating the clause or
proposing wording. A confident AI reading of a contract is a good way to talk
yourself out of asking Procurement Services, so the prompt is built to get you
there informed rather than to answer instead of them.

The remaining §4c topics were already covered by screened imports and were not
duplicated: SOP first draft, meeting notes to actions, policy plain-language
summary, Excel formula explainer, position description, onboarding checklist,
forecast assumptions, RFP requirements, sourcing justification, vendor emails.

### Fixed in passing

**Collapsed numbered lists in all three original playbooks.** A re-wrap had put
`3.` after the end of the previous sentence on the same line, so steps 2–6 of
the Excel, Word, and Outlook playbooks rendered as one run-on paragraph with
the example prompts buried inside it. They are now real list items, and
`test_numbered_steps_are_not_collapsed_into_a_paragraph` fails the build if it
recurs. The first version of that test flagged nine false positives on ordinary
prose like "never Tier 3. Consumer chatbots…", so it anchors on a sentence end
rather than on any non-space character.

Two further lint tests: practice material must name its document (an untitled
`practice` source renders as the unhelpful "Open the document"), and every
playbook must carry `sensitive-data` in `related_slugs` — the rule prompts
already had, applied to the pages that walk somebody through putting real data
into a tool.

## Still open

1. **§6.1 — the Provost's tools page still prints Tier 0–1 for PromptLab**,
   against the Library's Tier 2. This is the one item that cannot be closed
   from inside the repo: it needs the two University pages reconciled, so that
   a member of staff who checks ai.unc.edu does not see something different
   from what Nimbus tells them. Nimbus follows the Library and records why.
   Note this is the *more permissive* reading — if the Provost's page turns out
   to be current, the ceiling comes down and the 16 prompts that suggest
   PromptLab need rechecking.

2. **Nothing else from the catalog.** Every numbered item in §7 and every item
   in §6 is closed. What remains is maintenance rather than import.

### Worth doing next, though the catalog does not ask for it

- **A staleness check on `source.retrieved`.** Fifteen guidance entries now
  summarize pages that change under them, and nothing currently notices when a
  summary is a year old. The field is there; only the check is missing.
- **A duplication pass over the imports.** §4a suggested "roughly 20–25" from
  the Microsoft repo and 36 were taken. Now that the in-house prompts cover the
  same departments, some of those are probably near-duplicates of each other.
