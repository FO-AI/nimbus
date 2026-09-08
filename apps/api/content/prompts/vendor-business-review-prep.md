---
slug: vendor-business-review-prep
kind: prompt
title: Prepare an agenda and notes for a vendor business review
summary: Collect performance highlights, open actions, upcoming renewals, and likely
  vendor questions into an agenda and briefing notes.
tags: [procurement, vendor, meetings, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, vendor-scorecard-prep]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for Procurement & Vendor Management
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Procurement staff
  department: Procurement
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    For my business review with [VENDOR], gather from email and documents:
    - Performance highlights and issues since the last review
    - Open actions from last time and their status
    - Upcoming changes, renewals, or pricing topics
    - Questions they are likely to raise

    Prepare an agenda and briefing notes. Confirm any figures against the system
    of record before the meeting.
  example_input: A vendor name and the correspondence since your last review with them.
  example_output: A meeting agenda plus notes covering performance, unclosed actions,
    upcoming decisions, and likely vendor asks.
---

## When to use this

The day before a recurring vendor review, when you want the last review's
open actions in front of you rather than in a file somewhere.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- The unclosed-actions section is the one that changes the meeting. Keep it
  even if you cut the rest.
- Add "list what we owe them" — reviews go better when you arrive knowing
  your own overdue items.

## What to check

- Figures quoted from email are unreliable; confirm spend in InfoPorte
  before you say a number out loud.
- Anticipated vendor questions are speculation. Do not build your position
  around them.
