---
slug: copilot-pages-shared-notes
kind: playbook
title: Keep shared working notes for a cross-unit project — Pages, Notebooks, or Loop
summary: Three Microsoft surfaces do overlapping things and staff pick the
  wrong one. Which to use for a cross-unit F&O project, and how to run it so
  the notes stay usable.
tags: [copilot, loop, pages, notebooks, collaboration, projects]
related_slugs: [microsoft-365-copilot, copilot-chat, sensitive-data, ai-and-public-records]
published: true
---

## The problem this solves

You are running something across units — a system implementation, a space
move, a procurement — and the working notes are scattered across a Teams
chat, three email threads, and somebody's OneNote. Microsoft offers Pages,
Notebooks, and Loop for exactly this, they look similar, and picking wrong
means migrating later.

## Which one

| | Use it for | Not for |
| --- | --- | --- |
| **Copilot Pages** | Taking something Copilot just produced and turning it into a shared, editable page others can build on | A long-lived document with structure |
| **Copilot Notebooks** | Grounding Copilot in a fixed set of sources — your project's files — so answers come from those rather than everything | Co-authoring; it is a research surface |
| **Loop** | The durable shared workspace: the running project notes, task lists, and status that live for months | One-off output from a single prompt |

**The short rule for an F&O project:** a Loop workspace for the project, a
Notebook when you need Copilot to answer from the project's own documents,
and Pages for the moments where a Copilot answer is worth keeping.

## Steps

1. **Create the Loop workspace first**, before the project generates
   material. Retrofitting is what nobody does.

2. **Put the fixed things in as components**: the decision log, the owner
   list, the risk register. Loop components can be pasted into Teams and
   Outlook and stay live — one list, visible everywhere, instead of a copy
   per channel.

3. **Create a Notebook for the project's source documents** — the RFP, the
   contract, the requirements, the policy it has to comply with. Then ask
   questions with those as the ground:

   > Based only on the documents in this notebook, what are the vendor's
   > obligations on data retention?

   The "based only on" matters. It is what keeps the answer inside your
   sources rather than Copilot's general knowledge.

4. **Promote useful Copilot output to a Page** when an answer is worth
   keeping — a summary, a comparison — and link it from the Loop workspace so
   there is still one place to look.

5. **Review what accumulates, monthly.** Shared notes rot. Ten minutes
   deleting superseded material is what keeps people using it.

## Data rules still apply

- Shared notes are **public records** the same as anything else — see
  [AI and the Public Records Act](/guides/ai-and-public-records).
- A Loop workspace shared to a whole unit is visible to that whole unit.
  Check the sharing scope before a vendor's confidential pricing goes in.
- Tier 1 and 2; never Tier 3 — the surface changes nothing about the tier.
  See [what data can I put into an AI tool](/guides/sensitive-data).

## Common problems

- **Nobody uses the workspace** — almost always because the project's real
  conversation stayed in a Teams chat. Put the Loop components *into* the
  chat rather than asking people to go elsewhere.
- **A Notebook gives general answers** — its sources were never attached, or
  the prompt did not say "based only on these documents."
- **A Page is edited into something nobody can follow** — Pages are for
  moments, not for long documents. Move it to Loop or to Word.

## Microsoft's own documentation

[Compare Microsoft Loop, Copilot Pages, and Copilot Notebooks](https://support.microsoft.com/en-us/microsoft-365-copilot/compare-microsoft-loop-copilot-pages-and-copilot-notebooks)
