---
slug: correspondence-triage-summary
kind: prompt
title: Summarize the correspondence someone needs to act on
summary: Sort a busy period of email into what needs a response, what awaits a decision,
  what you can handle, and what is only for awareness.
tags: [operations, email, triage, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, copilot-outlook-inbox-triage, how-to-write-a-prompt]
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
    Summarize the communications I need to be aware of from the past
    [TIMEFRAME]:
    - Urgent items that need a response from me
    - Requests waiting on a decision
    - Updates from key contacts
    - Items someone else can handle, and who
    - For-awareness items

    Order by urgency, then importance. One line each, naming the sender.
  example_input: A timeframe such as the last week, with your mailbox available to the
    licensed Copilot.
  example_output: A five-section list ordered by urgency, one line per item, with
    senders named.
---

## When to use this

Coming back from leave, or on a Monday when the inbox has outrun you and you
need to know what actually needs you.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add "exclude anything I have already replied to" to cut the list roughly
  in half.
- The
  [Copilot in Outlook triage playbook](/guides/copilot-outlook-inbox-triage)
  covers the fuller workflow this prompt sits inside.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Urgency is judged from tone and wording, not from consequence. A quietly
  worded message about a deadline will be ranked low.
- Check the delegation column before acting on it — Copilot does not know
  who is on leave.
