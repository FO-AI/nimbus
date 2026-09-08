---
slug: close-prep-checklist
kind: prompt
title: Build a month-end close prep checklist
summary: Sweep your email and Teams for open items, pending journal entries, and
  blockers before the close, and turn them into a checklist.
tags: [finance, close, checklist, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, budget-variance-narrative, how-to-write-a-prompt]
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
    For the [MONTH] close in [DEPARTMENT], search my email and Teams for:
    - Open items and pending journal entries anyone has mentioned
    - Accruals or encumbrances still being discussed
    - Late information or blockers from other units
    - Anything flagged as a risk to the close timetable

    Compile a close-prep checklist grouped by those four headings, with the
    person who raised each item and the date. This is coordination only —
    every figure gets confirmed in ConnectCarolina, not from this list.
  example_input: "Copilot reads your own mail and Teams messages for the month;
    you supply the month and department."
  example_output: A four-section checklist naming who raised each open item and
    when, ready to work through before you touch the ledger.
---

## When to use this

In the days before close, when the open items are scattered across a month
of mail threads and nobody has written them down in one place.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox or Teams.
- Narrow the search by adding "in the last 30 days" or naming the threads
  that matter if your mailbox is noisy.
- Add "flag anything involving a sponsored project separately" if your unit
  carries grant funds — those close on different rules.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Copilot summarizes what people *said*, which is not the same as what is
  *true* in the ledger. Confirm every figure in ConnectCarolina or
  InfoPorte.
- It will miss items that were discussed only verbally. Treat the checklist
  as a starting point, not a complete list.
