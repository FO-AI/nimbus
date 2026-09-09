---
slug: expense-justification-context
kind: prompt
title: Gather the business justification for an expense report
summary: Find the purpose, attendees, approvals, and special circumstances discussed for
  a trip or event, to support an expense submission.
tags: [finance, travel, expenses, concur, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, how-to-write-a-prompt]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for Administrative & Executive Assistants
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Administrative and operations staff
  department: Finance
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    Search my email for communications about the expenses for [TRIP / event /
    project]. Find:
    - The purpose and business justification as it was described at the time
    - Attendees or participants mentioned
    - Approval discussions and who approved what
    - Any special circumstances that were noted

    Compile as supporting context for the expense report. Quote the original
    wording where the justification matters.
  example_input: A trip or event name and the mail threads from when it was arranged.
  example_output: A short context note quoting the original stated purpose, listing
    attendees, and pointing to the approval thread.
---

## When to use this

Filing an expense report weeks after the trip, when you need the
justification the approver will ask for and cannot remember how it was
framed.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- For a sponsored project, add that the funding source and allowability
  discussion should be pulled out separately.
- Ask for the approval thread's date and sender — that is what a reviewer
  will want to see.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Do not paste card numbers, bank details, or any Tier 3 data into the
  prompt. This gathers justification, not payment data.
- Copilot's summary is not the justification. Write the justification
  yourself using what it found, in the form Concur expects.
