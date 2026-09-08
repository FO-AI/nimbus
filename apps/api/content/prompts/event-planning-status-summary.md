---
slug: event-planning-status-summary
kind: prompt
title: Consolidate event planning into a status summary
summary: Pull confirmed details, vendor threads, budget discussion, logistics, and
  outstanding decisions for an event into one status view.
tags: [operations, events, planning, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, meeting-notes-to-actions, how-to-write-a-prompt]
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
  tool_slug: microsoft-365-copilot
  prompt: |
    Search my email and Teams for all discussion of [EVENT NAME]. Compile a
    status summary:
    - Details that are confirmed
    - Vendor communications and where each stands
    - Budget discussion and any figures mentioned
    - Attendee items
    - Logistics arrangements
    - Decisions still outstanding, and who owns each
    - Action items with owners

    Say clearly which items are confirmed and which are still assumed.
  example_input: An event name and several weeks of planning correspondence across mail
    and Teams.
  example_output: A status summary separating confirmed from assumed, with an owner
    against every outstanding decision.
---

## When to use this

Two weeks out from an event, when planning has happened across a dozen
threads and nobody can say what is actually settled.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- The confirmed-versus-assumed split is the useful part. Keep that
  instruction if you trim anything else.
- Add "list what has a hard deadline in the next ten days" when you are
  close to the date.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Budget figures pulled from planning email are not commitments. Confirm
  anything you are going to encumber.
- An item discussed but never decided will often appear as decided. Verify
  the confirmed list against actual confirmations.
