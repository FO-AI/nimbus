---
slug: department-spend-review-prep
kind: prompt
title: Prepare briefing notes for a department spend review
summary: Gather the spending topics, commitments, and unclosed prior actions before you
  meet a department about its budget.
tags: [finance, budget, meetings, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, budget-vs-actual-review-summary, how-to-write-a-prompt]
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
  audience: Finance staff, budget officers
  department: Budget
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    For my spend review with [DEPARTMENT], gather:
    - Spending topics raised in recent email
    - Commitments made or new requests mentioned
    - Prior actions from our last review, and whether each closed
    - Questions the department is likely to raise

    Prepare briefing notes, short and specific. Confirm actuals in InfoPorte
    before the meeting.
  example_input: A department name and the correspondence since your last review with
    them.
  example_output: A page of briefing notes covering live topics, open commitments,
    unclosed actions, and likely questions.
---

## When to use this

Before a recurring budget conversation with a department, when you want to
walk in knowing what they are going to ask.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- The "questions they are likely to raise" bullet is speculative but useful
  — drop it if you would rather not anchor yourself.
- Add specific chartfield strings if the department spans several.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Every figure here came from what someone wrote in an email, not from the
  ledger. Reconcile against ConnectCarolina or InfoPorte before it goes
  anywhere official.
- Anticipated questions are Copilot guessing. Do not treat them as
  intelligence about the department's position.
