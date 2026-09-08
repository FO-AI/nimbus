---
slug: staff-announcement-draft
kind: prompt
title: Draft an announcement to staff
summary: Turn a policy change, closure, or process update into a clear announcement
  covering what, when, why, impact, and who to ask.
tags: [operations, communications, writing, copilot]
related_slugs: [sensitive-data, copilot-chat, policy-plain-language-summary, how-to-write-a-prompt]
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
    Draft an announcement to staff about [TOPIC]. Include:
    - A clear headline
    - The key information — what, when, and why
    - What it means for staff day to day
    - Any action required, and by when
    - Who to contact with questions

    Plain language, no jargon, under 250 words. Match a straightforward
    institutional tone. I will review before it goes out.

    Details:
    [PASTE HERE]
  example_input: The change being announced plus the practical details — dates, affected
    groups, contact.
  example_output: A short announcement with a clear headline and an explicit statement
    of what staff need to do.
---

## When to use this

Any routine internal announcement — a system outage, a process change, an
office closure — where clarity matters more than polish.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat), since you paste the source
  material in.
- Add "say plainly what is not changing" — most anxiety about an
  announcement comes from what it leaves ambiguous.
- For anything affecting pay, benefits, or employment terms, route it
  through HR before sending. Do not send it on Copilot's word.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Check the action and the deadline are unmissable. Copilot buries them in
  prose by default.
- AI-drafted announcements are public records once sent, and read as
  University communication. Have a person own the final text.
