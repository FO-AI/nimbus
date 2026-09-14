---
slug: close-package-status-update
kind: prompt
title: Draft the close-package status update
summary: The short note that goes out mid-close telling everyone where the
  period stands, what is still outstanding, and who owes what.
tags: [finance, close, reporting, status, communication]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, close-prep-checklist, reconciliation-exception-summary]
published: true
attributes:
  audience: Finance staff
  department: Finance
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Draft a close status update for [PERIOD], to go to [AUDIENCE — e.g. unit
    finance leads and the budget office]. Today is day [N] of close and the
    deadline is [DATE].

    Status by area:
    [PASTE YOUR STATUS LIST — area, done / in progress / blocked, and any note]

    Structure it as:
    - One sentence on whether close is on track for the deadline
    - What is complete
    - What is outstanding, with the owner and the date it is needed by
    - Anything blocked, and what would unblock it

    Keep it under 250 words. Direct and factual, no filler. Do not soften a
    blocker into "in progress" — if my list says blocked, say blocked.
  example_input: Eight areas with a status word each and short notes on the two
    that are stuck.
  example_output: A short update leading with on-track or not, then complete,
    outstanding with owners and dates, and the blockers stated plainly.
---

## When to use this

Mid-close, when people are asking where things stand and you would rather send
one note than answer the same question six times. Also works as the final
wrap-up once the period is closed.

## How to adapt it

- **Name the audience.** An update to unit finance leads is a different
  document from one to a Vice Chancellor. The prompt writes to whoever you
  name.
- Keep your status list terse — area, one status word, one note. Long input
  produces long output.
- Add "list only the items where the recipient owes something" for a version
  aimed at chasing rather than informing.
- Add "include a line on what changed since the last update" when you send
  these on a cadence.
- **Resist the urge to let it soften blockers.** The instruction against that
  is in the prompt deliberately; it is the most common thing people edit back
  in, and it is why close updates stop being believed.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **Owners and dates**, against your own list. These are what people act on.
- That "on track" matches reality rather than the tone of your notes.
- That no area silently dropped out. Count the areas in against the areas
  out — a summarizer will merge two thin ones.
- **Tier check:** keep individual performance out of it. A blocked area is a
  process fact; who is behind on it is not something to put in a circulated
  note. See [what data can I put into an AI tool](/guides/sensitive-data).
