---
slug: invoice-query-research
kind: prompt
title: Research an invoice or purchase order query
summary: Trace what was ordered, what was approved, and where the discrepancy arose on a
  disputed invoice or PO.
tags: [finance, accounts-payable, invoices, procurement, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, vendor-email-draft, how-to-write-a-prompt]
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
  audience: Finance staff, procurement staff
  department: Finance
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    For the invoice or PO query [REFERENCE] with [VENDOR], search my email for:
    - What was ordered and what was agreed, with dates
    - Approvals or receipt confirmations anyone mentioned
    - The nature of the discrepancy as each side describes it
    - How we resolved similar queries before

    Summarize so I can resolve it. Do not authorize anything — payment follows
    the normal approval workflow in ConnectCarolina.
  example_input: A PO or invoice reference, the vendor name, and the mail thread
    history.
  example_output: A short account of what each side believes was agreed, with the
    specific point where the records diverge.
---

## When to use this

When an invoice does not match the PO and the explanation is buried in a
thread with six people on it.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add the BuyCarolina requisition number if there is one — it gives Copilot
  a strong search anchor.
- Ask it to "state clearly what is disputed and what both sides agree on" —
  separating those is most of the resolution.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Copilot cannot see BuyCarolina or ConnectCarolina. It reconstructs from
  email, which may be incomplete or wrong.
- The instruction not to authorize payment is not a technical control.
  Approval stays in the workflow, with a person.
