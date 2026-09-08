# Nimbus Resource Catalog

Scope: UNC-Chapel Hill resources only, filtered to what Finance & Operations staff need. Organized by Nimbus content kind (`tool`, `guidance`, `playbook`, `prompt`) plus training pointers. Two scoped exceptions: Microsoft's official Copilot documentation (Copilot is the University's approved AI tool) and three openly licensed prompt libraries imported into the prompt library (§4a).

**Import modes**

| Mode | Meaning |
| --- | --- |
| **Link** | Create a content entry that summarizes the page in plain language and links to it as the authority. Paraphrase; do not copy. |
| **Practice** | Public UNC document used as safe, Tier 0 material inside a playbook exercise. |
| **Import** | Openly licensed prompt library (§4a only). Prompts are copied, re-voiced for UNC, and carry attribution in frontmatter. |

> **Import status (2026-09-08).** Sprint 1 of §7 is done, on the priorities set
> in the catalog review: tools imported in link mode, guidance deprioritized,
> prompts fully imported with the schema reshaped. See
> `docs/resource-catalog-import-log.md` for exactly what landed, what was
> screened out and why, and what is still open.

---

## 1. `kind: tool` — the registry

Only tools that ITS or the Provost's AI at UNC page list as available to University staff. Sources of truth: ITS "AI tools at Carolina" https://its.unc.edu/ai/ · Provost "AI at UNC — Tools" https://ai.unc.edu/tools/ · Library "Comparison of UNC-provided AI platforms" https://guides.lib.unc.edu/GenAI/compare

| Mode | Tool | Status | Who can use it | Data tier | Owner / URL |
| --- | --- | --- | --- | --- | --- |
| Link | Microsoft 365 Copilot Chat (with Data Protection) | approved | Anyone with an active Onyen (Basic); Premium for licensed users | Tier 1 and 2; **never Tier 3 / PHI** | ITS — https://its.unc.edu/ai/copilot/ · sign in https://m365.cloud.microsoft/chat/ |
| Link | Microsoft 365 Copilot (licensed, inside Word, Excel, Outlook, Teams, PowerPoint) | approved, licensed | Licensed users; departments request licenses through their IT (~$20/user/month) | Tier 1 and 2; never Tier 3 / PHI | ITS — https://its.unc.edu/ai/copilot-for-microsoft-365/ |
| Link | Microsoft Copilot Studio (custom agents) | approved, by request | Departments and technical teams via the AI Acceleration Program | Tier 2 (Library compare page) | https://aiacceleration.unc.edu/ |
| Link | PromptLab (University Library; GPT, Gemini, Claude models) | approved | Anyone with an Onyen, free | Tier 1 and 2; never Tier 3 (resolved 2026-09-08 — see §6.1) | University Library — https://promptlab.lib.unc.edu/ · privacy https://library.unc.edu/documentation/promptlab-privacy-information/ |
| Link | Zoom AI Companion | approved | All licensed Zoom users; off by default, user enables | Summaries are **public records**; notify participants | ITS — https://its.unc.edu/2025/02/19/zoom-ai-companion-available/ |
| Link | Adobe Firefly (Creative Cloud) | approved | Free for instructional staff; $25/yr for non-instructional staff | not tier-rated | https://software.sites.unc.edu/adobe/ |

F&O systems referenced in playbooks and the `tools_used` field (not AI tools; context only): ConnectCarolina https://connectcarolina.unc.edu/ · InfoPorte https://infoporte.unc.edu/ · BuyCarolina https://finance.unc.edu/services/buycarolina/ · Concur https://finance.unc.edu/services/travel/concur/ · TIM https://finance.unc.edu/services/tim/ · Carolina Talent https://go.unc.edu/carolinatalent/ · Business & Financial Systems Access https://fo.unc.edu/sce/finance/business-financial-systems-access/

---

## 2. `kind: guidance`

| Mode | Resource | Why F&O staff need it | URL |
| --- | --- | --- | --- |
| Link | **Staff Generative AI Usage Guidance** (Provost) | The core rule set for operations staff. Permitted: drafting budgets, reports, memos, letters; data analysis on non-sensitive data; scheduling and workload planning; transcription and minutes; compliance flagging with human review. **Prohibited: using AI to hire, evaluate, or discipline employees.** Sensitive data only after an ISO risk assessment and Data Governance Oversight Group approval. Consult your unit's Senior IT before adopting or buying any GenAI product. Disclose AI use in decisions with ethical or legal impact. | https://ai.unc.edu/staff-generative-ai-usage-guidance/ |
| Link | Information Classification Standard (Tiers 0–3) | Defines the tiers every tool page cites. Tier 1 Business: budgets, memos, contact lists. Tier 2 Confidential: personnel files, FERPA records, NDA and vendor-confidential content. Tier 3 Restricted: SSNs, bank and card data, PHI, passwords. | https://policies.unc.edu/TDClient/2833/Portal/KB/ArticleDet?ID=131244 |
| Link | "Using AI Appropriately" (Provost's AI Committee, PDF) | One-page do/don't: use openly, verify output, no confidential input, the user owns the result. | https://ai.unc.edu/wp-content/uploads/sites/1362/2025/03/UNC-Using-AI-Appropriately.pdf |
| Link | OHR: Using AI in Performance Management | For F&O supervisors: AI may help structure feedback; it must not produce ratings or appraisal decisions; only University-provisioned tools; no employee data in unapproved tools. | https://hr.unc.edu/learning-performance/performance/ai/ |
| Link | ITS: AI, data privacy and you | Why consumer chatbots are off-limits for University data and what "with Data Protection" means. | https://its.unc.edu/2024/01/25/ai-data-privacy-and-you/ |
| Link | ITS: AI deepfakes as a cyber threat | Voice-clone and executive-impersonation payment fraud — verification steps for Accounts Payable, Payroll, and Travel. | https://its.unc.edu/2025/10/20/ai-deepfakes-cyber-threat/ |
| Link | ITS: Software and vendor risk assessment | The intake path when an F&O unit wants a new AI tool or an AI feature in an existing vendor system: University Data Assistance form → ISO review → DGOG. | https://its.unc.edu/2023/01/27/risk-assessment/ |
| Link | Data governance policy set | Link targets for `related_slugs`: HIPAA PHI (132093), FERPA (132164), Vendor Management (131252), Transmission of Sensitive Information (131260). | https://datagov.unc.edu/about/policies-about-data/ |
| Link | UNC School of Government: AI and the Public Records Act | Prompts, outputs, and Zoom AI meeting summaries are public records under G.S. 132-1; use University accounts; retain by content type. | https://canons.sog.unc.edu/blog/2026/03/11/the-intersection-of-artificial-intelligence-and-the-public-records-act/ |
| Link | Digital Accessibility Office: AI and digital accessibility | AI-generated alt text and summaries need human review before publication in F&O communications. | https://digitalaccessibility.unc.edu/2024/11/26/ai-and-digital-accessibility-whats-up/ |
| Link | Microsoft: Copilot data, privacy, and security | Vendor statement behind UNC's "not used for training" claim; pair with the ITS privacy article. | https://support.microsoft.com/en-us/microsoft-365-copilot/ (Data & Privacy section) |

---

## 3. `kind: playbook`

### 3a. Microsoft Copilot how-tos (one Nimbus playbook per app, rewritten around an F&O task)

| Mode | Source page | F&O playbook it supports | URL |
| --- | --- | --- | --- |
| Link | Copilot in Excel — get started | Budget-to-actuals variance analysis; P-card and expense reconciliation summaries | https://support.microsoft.com/en-us/Excel/copilot/get-started-with-copilot-in-excel |
| Link | Copilot in Word — draft and add content | First drafts of SOPs, justification memos, vendor letters, close-package narratives | https://support.microsoft.com/en-us/Word/copilot/draft-and-add-content-with-copilot-in-word |
| Link | Copilot in Outlook | Inbox triage, summarizing vendor and requestor threads, drafting replies | https://support.microsoft.com/en-us/Outlook/copilot-outlook/chat-with-copilot-in-outlook |
| Link | Copilot in Teams — meeting recap; use without recording | Budget-review and project meeting notes with action items (see public-records guidance) | https://support.microsoft.com/en-us/teams/copilot/catch-up-on-meetings-with-microsoft-365-copilot-in-teams · https://support.microsoft.com/en-us/teams/copilot/use-copilot-without-transcribing-or-recording-a-teams-meeting-or-call |
| Link | Copilot in PowerPoint | Leadership updates and unit reviews built from existing Word reports | https://support.microsoft.com/en-us/PowerPoint/copilot/create-a-new-presentation-with-copilot-in-powerpoint |
| Link | Copilot Pages, Notebooks, and Loop compared | Shared working notes for cross-unit projects | https://support.microsoft.com/en-us/microsoft-365-copilot/compare-microsoft-loop-copilot-pages-and-copilot-notebooks |
| Link | Get started writing prompts; edit a prompt to make it your own | Companion to every prompt in the library | https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-writing-prompts-in-microsoft-365-copilot |
| Link | Agent Builder; Agent Builder vs Copilot Studio | When a unit wants a policy Q&A agent (route through AI Acceleration and the risk-assessment path) | https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder · https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-studio-experience |

### 3b. Microsoft Copilot scenario pages for finance and operations (structure to follow: one prompt per step across apps)

| Mode | Resource | Scenarios relevant to F&O | URL |
| --- | --- | --- | --- |
| Link | Copilot Scenario Library — Finance | Procure to Pay (contract management, amendments, invoice processing), Record to Report (reconciliations), Planning & Analysis (forecasting, cash flow, business case) | https://adoption.microsoft.com/en-us/scenario-library/finance/ |
| Link | Scenario: Procurement insight acceleration | Excel → Outlook → Teams → Copilot Chat → Word, five steps with prompts | https://adoption.microsoft.com/en-us/scenario-library/finance/procurement-insight-acceleration/ |
| Link | Copilot Scenario Library — Operations | Supplier RFP, change-management plan, business review, project review | https://adoption.microsoft.com/en-us/copilot-scenario-library/operations/ |
| Link | Copilot Scenario Library — Human Resources | Onboarding, internal transitions (for HR operations within F&O) | https://adoption.microsoft.com/en-us/scenario-library/human-resources/ |

### 3c. UNC-written how-tos (already in University voice; link or adapt)

| Mode | Resource | URL |
| --- | --- | --- |
| Link | ITS: 7 new Copilot Chat features (Mar 2026) | https://its.unc.edu/2026/03/31/maximize-copilot-chat-7-new-features/ |
| Link | ITS: 4 ways to transform information with AI (Jul 2026) | https://its.unc.edu/2026/07/31/4-ways-transform-information-with-ai/ |
| Link | ITS: 3 tips to get started with AI | https://its.unc.edu/2024/03/27/3-tips-to-get-started-with-ai/ |
| Link | ITS: Zoom AI Companion — how to enable and use it | https://its.unc.edu/2025/02/19/zoom-ai-companion-available/ |
| Link | Library: Microsoft Copilot guide | https://guides.lib.unc.edu/GenAI/copilot |

### 3d. Practice material (public, Tier 0, UNC-authored)

| Mode | Document | Exercise | URL |
| --- | --- | --- | --- |
| Practice | UNC-Chapel Hill Annual Operating Budget Book, FY2025-26 (PDF) | Copilot in Excel/Word: extract a unit's revenue and expense table, then draft a variance narrative | https://budget.unc.edu/wp-content/uploads/sites/1415/2025/10/2025-annual-operating-budget-book.pdf (index: https://budget.unc.edu/budget-book/) |
| Practice | UNC-Chapel Hill Annual Comprehensive Financial Report, 2025 | Copilot Chat: summarize a financial statement section and answer questions with page citations | https://finance.unc.edu/services/comprehensive-annual-financial-report/annual-report-2025/ |

---

## 4. `kind: prompt`

### 4a. Import (scoped exception to the UNC-only rule — open licenses, F&O relevance)

Three external libraries are imported selectively. Each prompt is re-voiced for UNC before publishing: F&O department names, the Tier vocabulary, an approved tool in `attributes.tool`, `related_slugs: [sensitive-data]`, and a `source` / `license` line in the frontmatter so attribution travels with the file.

| Mode | Library | What to take | License | URL |
| --- | --- | --- | --- | --- |
| Import | **awesome-microsoft-copilot-prompts** — 573 prompts for Microsoft 365 Copilot, organized by app (Outlook, Excel, Word, PowerPoint, Teams) and by role | The Finance (16), Procurement & Vendor Management (16), HR & People (16), Commercial Operations (18), and Administrative & Executive Assistants (17) collections; roughly 20–25 prompts after screening for UNC fit. Written for the University's approved tool, so minimal adaptation | **CC BY-SA 4.0** — attribute; derived prompts carry the same license | https://github.com/kesslernity/awesome-microsoft-copilot-prompts |
| Import | **UK Government AI Knowledge Hub — Prompt Library** — 47 prompts for public-sector staff, some marked "Verified" by subject-matter reviewers | Procurement strategy, business case, benefits realisation plan, risk register, portfolio prioritisation, stakeholder communications, workload prioritisation, mid-year review prep, 1:1 prep; roughly 8–10 prompts. Prefer "Verified" entries | **Open Government Licence v3.0** — attribute Crown copyright | https://ai.gov.uk/knowledge-hub/prompts/ |
| Import | **Wharton Generative AI Labs Prompt Library** (Mollick) — evidence-based prompt templates | Critique and reasoning patterns (Devil's Advocate, structured feedback, pre-mortem style review) that teach staff to interrogate output — the AI-literacy half of the library; roughly 4–6 prompts | **CC BY 4.0** — attribute the authors | https://gail.wharton.upenn.edu/prompt-library/ |

Screening rules for every imported prompt: it must map to a real F&O task, run in an approved tool, never ask for Tier 3 data, and never touch hiring, evaluation, or discipline (Staff GenAI Usage Guidance). Spell out UK/UK-government terms (Five Case Model, line report) in UNC language.

Suggested frontmatter additions for provenance (kind-specific `attributes`):

```yaml
attributes:
  source: awesome-microsoft-copilot-prompts (kesslernity)
  source_url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  license: CC BY-SA 4.0
  adapted: true
```

### 4b. Link

| Mode | Resource | Use | URL |
| --- | --- | --- | --- |
| Link | Microsoft Copilot Prompt Gallery — filter by app and by function (Finance, HR, Operations) | Staff can "Open in Copilot" directly; consider publishing Nimbus prompts as a shared Teams prompt set inside Copilot as well | https://adoption.microsoft.com/en-us/copilot/prompt-gallery/ · in-product doc https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-prompt-gallery |
| Link | UNC Library — Prompt Engineering (CLEAR framework) | The campus prompting framework; link from every prompt page's "How to adapt it" section | https://guides.lib.unc.edu/GenAI/prompts |

### 4c. Author in-house

Prompt topics to author for the library where the imports leave gaps, by F&O department (each mapped to an approved tool and to the sensitive-data guidance): Finance — variance narrative, journal-entry justification, reconciliation exception summary, close-package status update; Procurement — sourcing justification memo, vendor email drafts, contract-clause plain-language summary (Tier 1 documents only), RFP requirements outline; Budget — budget request narrative, forecast assumptions memo; HR operations — position description draft (never evaluation content), onboarding checklist; Facilities and Real Estate — work-order trend summary, space-request response, project status update; All — SOP first draft, meeting notes to action items, policy plain-language summary, Excel formula explainer.

---

## 5. Training pointers (link from a "Learn" page; record completions in Carolina Talent)

| Mode | Resource | Note | URL |
| --- | --- | --- | --- |
| Link | LinkedIn Learning (free for UNC employees) — "Learning Microsoft 365 Copilot" and "Prompt Engineering", the two courses ITS recommends | Activate with Onyen; completions flow to Carolina Talent transcripts | https://software.sites.unc.edu/linkedin/ · ITS recommendation https://its.unc.edu/ai/copilot/ |
| Link | Microsoft Learn — Get started with Microsoft 365 Copilot (3 modules, business-user level) | Free; pairs with the playbooks | https://learn.microsoft.com/en-us/training/paths/get-started-with-microsoft-365-copilot |
| Link | University Library AI Studio — workshops, consultations, PromptLab sessions | Hands-on help for staff; libraryai@unc.edu | https://library.unc.edu/ai/library-ai-studio/ · workshop list https://guides.lib.unc.edu/GenAI/workshops |
| Link | Carolina Talent (OHR learning system) | Where AI course completions are recorded for performance goals | https://go.unc.edu/carolinatalent/ |
| Link | AI Acceleration Program | Route for F&O units that want Copilot Studio agents or Azure resources; grants open to staff | https://aiacceleration.unc.edu/ |

---

## 6. Confirm before publishing

1. ~~**PromptLab data tier**~~ — **resolved 2026-09-08: Tier 1 and 2**, following the Library compare page over ai.unc.edu/tools, since the Library runs the service. Recorded in `content/tools/promptlab.md`; the Provost page is still unreconciled.
2. **Copilot tier wording**: ITS says "no Tier 3 / PHI"; ai.unc.edu says "Tier 1 & 2". Use one phrasing everywhere: "Tier 1 and 2; never Tier 3."
3. **No numbered University GenAI policy exists**; governance is the Provost's Staff Generative AI Usage Guidance. Nimbus should say so rather than imply a policy.
4. **Public records**: prompts, outputs, and Zoom AI summaries are public records — include in the sensitive-data guidance page, not only in the Zoom tool entry.
5. **Existing content**: `microsoft-365-copilot.md` uses `its-copilot@unc.edu` and "low or moderate sensitivity". Replace with the ITS contact on https://its.unc.edu/ai/copilot/ and the Tier vocabulary; split into two entries (Copilot Chat vs licensed M365 Copilot) since access differs.
6. **Adobe Firefly** is listed by ITS but has little F&O use; include for completeness or omit.

## 7. Suggested first import sprint

1. Tools: six entries from §1, each with `related_slugs: [sensitive-data]`.
2. Guidance: rewrite `sensitive-data.md` around Tiers 0–3, the Staff GenAI Usage Guidance prohibitions, public records, and the ISO→DGOG intake path; add "Getting an AI tool approved for your unit" and "How to write a prompt" (CLEAR).
3. Playbooks: one per Copilot app from §3a using the scenario-page step pattern, with the two §3d documents as practice material.
4. Prompts: import ~35 screened prompts from the three §4a libraries (Copilot repo first, then UK hub, then Wharton), re-voiced for UNC with attribution; author the §4c gaps in-house; link Prompt Gallery and CLEAR from each.
5. Training: a single "Learn" page pointing to §5, with the two ITS-recommended LinkedIn Learning courses first.
