---
slug: travel-brief-prep
kind: prompt
title: Prepare a travel brief for a trip
summary: Assemble the meeting schedule, contacts, background, and documents needed for a
  work trip, ready for booking details to be added.
tags: [operations, travel, meetings, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, expense-justification-context]
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
    For the upcoming trip to [DESTINATION] for [PURPOSE] on [DATES], compile a
    travel brief:
    - Meeting schedule at the destination
    - Contact details for the people being met
    - Short background on each, from our prior correspondence
    - Time zone considerations
    - Documents likely to be needed

    I will add flights and hotel from Concur separately.
  example_input: Destination, purpose, dates, and the correspondence arranging the
    meetings.
  example_output: A trip brief with the schedule, who you are meeting and why, and the
    documents to bring.
---

## When to use this

Before a conference or a site visit with several meetings arranged over
separate threads.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add "note what we committed to at our last meeting with each of these
  people" — that is what makes a brief useful rather than decorative.
- Pair with the
  [expense justification prompt](/prompts/expense-justification-context)
  after the trip; the purpose you state now is what the report will need.

## What to check

- Background on external people is drawn from your own mailbox, not the web.
  It reflects your relationship, not the facts.
- Do not paste travel documents, passport details, or anything Tier 3 into
  the prompt.
