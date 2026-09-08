---
slug: facilities-issue-status-report
kind: prompt
title: Turn facilities correspondence into a status report
summary: Compile reported issues, resolution status, recurring problems, and vendor
  involvement from a month of facilities email.
tags: [facilities, operations, reporting, copilot]
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
  department: Facilities
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    Search my email and Teams for facilities issues raised over the past
    [TIMEFRAME]. Compile a status report:
    - Issues reported, with date and location
    - Resolution status for each
    - Problems that have recurred
    - Vendor involvement
    - Any cost implications mentioned
    - Items still outstanding

    Group recurring problems together — those are the ones worth reporting on.
  example_input: A month of facilities correspondence, work-order threads, and building
    contact email.
  example_output: A status report with a dated issue list and a separate section
    grouping problems that keep coming back.
---

## When to use this

Monthly, when you need a facilities report and the raw material is a month
of one-off messages.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add building or floor names if you manage several — grouping by location
  makes the recurrence pattern visible.
- Add "flag anything with a safety implication separately" so those do not
  sit in a list with lightbulbs.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Recurrence is the finding that justifies spending money. Verify each
  recurring item is genuinely the same problem, not similar wording.
- Costs mentioned in email are estimates. Confirm against actual work orders
  before reporting a number.
