---
slug: unit-status-report-compilation
kind: prompt
title: Compile a recurring unit status report
summary: Gather team status updates, completed milestones, blockers, and upcoming
  deadlines from correspondence into a report draft.
tags: [operations, reporting, status, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, meeting-notes-to-actions]
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
  department: All
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    I need to compile the [weekly / monthly] report for [MANAGER / group].
    Search my email and Teams for:
    - Status updates from the team
    - Completed tasks and milestones
    - Ongoing project status
    - Issues or blockers anyone reported
    - Upcoming deadlines
    - Any metrics mentioned

    Compile into a report draft. Name the source of each item so I can follow up
    on anything unclear.
  example_input: A reporting period and the team's correspondence and Teams channels for
    that period.
  example_output: A report draft grouped by section, each item attributed so you can
    chase the person who wrote it.
---

## When to use this

The recurring report that takes an hour of scrolling to assemble and ten
minutes to write.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Match the sections to your existing report format — the value is saving
  assembly time, not redesigning the report.
- Add "list anyone who has not reported this period" to catch silent gaps.

## What to check

- Blockers reported in passing get flattened into status. Read the blockers
  section against what you know is actually stuck.
- Attribution matters here: you are reporting other people's work upward,
  and a mischaracterization lands on them.
