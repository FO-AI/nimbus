---
slug: audit-request-response-prep
kind: prompt
title: Prepare a response outline for an audit request
summary: Find the relevant policies, prior responses, and likely evidence locations for
  an audit request, and draft a response outline.
tags: [finance, audit, compliance, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, how-to-write-a-prompt]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for Finance
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Finance staff
  department: Finance
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    For the audit request on [TOPIC], search my files and email for:
    - Relevant University policies and our own process notes
    - Prior responses we have given on similar items
    - Where the supporting evidence is likely held, and who owns it
    - Any open issues previously raised on this topic

    Draft a response outline with pointers to the evidence for each item. Do
    not draft the substantive answers — this is preparation. The response
    itself must be reviewed and signed off before it goes to the auditors.
  example_input: An audit request topic plus access to your unit's process documentation
    and prior audit correspondence.
  example_output: An outline listing each item the auditors asked about, where the
    evidence sits, and who owns it.
---

## When to use this

At the start of an audit cycle, when you know what has been asked and need
to work out where the answers live.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Name the audit explicitly (internal audit, State Auditor, a sponsor's
  audit) — the expected evidence differs.
- Add "note where evidence appears to be missing" so gaps become a
  workstream rather than a surprise.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Never send Copilot output to auditors. It prepares your file; a person
  writes and signs the response.
- Prior responses it surfaces may reflect a policy that has since changed.
  Check the date on everything it cites.
