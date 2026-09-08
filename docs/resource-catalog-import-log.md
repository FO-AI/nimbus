# Resource catalog — import log

What was actually imported from `docs/resource-catalog.md`, on 2026-09-08.
Priorities are the ones set in the catalog review: **tools in link mode only,
guidance deprioritized, prompts fully imported with the schema reshaped.**

The schema the review called for — "link schema doesn't exist yet; needs to be
designed in line with existing content item patterns" — is the `source` block:
`apps/api/content/README.md` for the shape, `docs/adr/0004-content-source-provenance.md`
for the reasoning.

## What landed

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

## Guidance — deprioritized, with one exception

The eleven §2 link entries are not imported, per the review.

`sensitive-data.md` was rewritten anyway, because every new tool and prompt
links to it and the tools now speak in Tier 0–3. It gained the tier table, the
prohibition on AI in hiring/evaluation/discipline, the public-records point
(§6.4), the ISO → DGOG intake path, and the "external obligations override the
tier" rule. This is narrower than §7.2 asks for.

## Closed since the first pass

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

## Fixed in passing

`sensitive-data.md` and `budget-variance-narrative.md` linked to `/t/…` and
`/p/…`, which are not routes in this app — both 404'd silently. Corrected to
`/guides/…` and `/prompts/…`, and `test_content_library.py` now fails the build
if either pattern reappears.

The six pre-existing prompts said `tool: Microsoft 365 Copilot`, which is now
ambiguous (that title belongs to the licensed entry). All six are paste-in
prompts, so they are relabelled `Microsoft 365 Copilot Chat` — otherwise the
library's tool filter offers three variants of the same product. Two used
`department: Operations`, off the §4c vocabulary; changed to `All`.

## Still open

1. **§7.3 playbooks** — one per Copilot app from §3a, plus the two §3d
   documents as practice material. `mode: practice` is implemented and
   validated but still unused. The review deprioritized *guidance*; playbooks
   were never assigned either way.
2. **§7.5 Learn page** and §7.2's "Getting an AI tool approved for your unit".
   `copilot-studio.md` still wants to link the approval page.
3. **§4c in-house prompts** — every new prompt is an import; none were authored
   from scratch. Facilities and Real Estate is covered by a single file.
4. **§6.1 follow-up** — the Provost's tools page still prints Tier 0–1 for
   PromptLab. Worth asking that it be reconciled with the Library's figure, so
   staff who check the Provost page do not see something different from what
   Nimbus tells them.
5. **§2 guidance** — eleven link entries, plus the two §7.2 pages ("Getting an
   AI tool approved for your unit", "How to write a prompt" / CLEAR).
   `copilot-studio.md` wants to link the approval-path page that does not exist
   yet.
6. **§5** — the training pointers (LinkedIn Learning, Microsoft Learn,
   Library AI Studio, Carolina Talent, AI Acceleration).
