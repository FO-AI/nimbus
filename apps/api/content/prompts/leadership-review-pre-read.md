---
slug: leadership-review-pre-read
kind: prompt
title: Assemble a one-page pre-read for a leadership review
summary: Turn recent reports, emails, and decks into a single page of headline
  results, movements, risks, and open actions before a leadership meeting.
tags: [finance, reporting, leadership, meetings, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, meeting-notes-to-actions]
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
  audience: Finance staff, unit managers
  department: Finance
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    Prepare a one-page pre-read for [MEETING NAME] on [DATE], drawing on my
    recent reports, emails, and decks:
    - Headline results as reported, citing the document each figure came from
    - The main movements since last time, and the reason given for each
    - Risks and the decisions you need from the group
    - Open actions from the previous meeting and their status

    Keep every figure sourced. Flag anything not yet confirmed as [unconfirmed].
    Stay under one page.
  example_input: "The meeting name plus a folder or mailbox holding the month's
    reports and the last meeting's notes."
  example_output: A one-page brief with sourced figures, movement explanations,
    a short decisions list, and the status of prior actions.
---

## When to use this

The evening before a unit review or a meeting with your budget officer, when
the material exists but nobody has condensed it.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot).
- Name the specific documents if you want it to stay narrow: "use only the
  August close package and the FY26 forecast deck."
- Add "write for someone who has not seen the detail" when the audience is
  outside Finance.

## What to check

- The citation requirement is the point. If a figure appears without a
  source, do not carry it into the meeting.
- Copilot will happily summarize a superseded version of a report. Confirm
  you are working from the current one.
