---
slug: financial-commentary-draft
kind: prompt
title: Draft management commentary for a reporting period
summary: Turn results and internal notes into plain, factual commentary on performance,
  drivers, and outlook for a reporting package.
tags: [finance, reporting, writing, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, budget-variance-narrative]
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
  prompt: |
    Draft management commentary for [PERIOD] in [DEPARTMENT / unit] from the
    results and notes below:
    - Performance against the prior period and against budget
    - The drivers behind the main movements
    - Any outlook points raised internally

    Plain and factual, no spin. Every number must trace to something in my
    input — mark anything you cannot trace as [verify]. This is a draft for
    review, not a final statement.

    Results and notes:
    [PASTE HERE]
  example_input: A results table plus a handful of notes explaining the largest
    movements.
  example_output: Two or three paragraphs of commentary with each figure traceable to
    the input and unverified items bracketed.
---

## When to use this

When the numbers are final and you need the words that go around them — a
quarterly report, a close package narrative, or a unit performance summary.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files. This one also works
  in Copilot Chat if you paste the results in.
- Add "write for a non-finance audience" when it goes to a department head
  rather than a budget officer.
- Set the length explicitly — "under 300 words" — or it will over-write.

## What to check

- The [verify] markers are the whole safeguard. If none appear, check
  whether it invented a figure rather than assuming everything traced
  cleanly.
- "No spin" is an instruction the model follows unevenly. Read for softened
  language around adverse results.
