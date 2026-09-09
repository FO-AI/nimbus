---
slug: vendor-communication-draft
kind: prompt
title: Draft a neutral vendor communication
summary: Produce a professional RFI invitation, clarification request, or unsuccessful-
  bidder notice that commits to nothing.
tags: [procurement, vendor, writing, email, copilot]
related_slugs: [sensitive-data, copilot-chat, vendor-email-draft, how-to-write-a-prompt]
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
  tool_slug: microsoft-365-copilot
  prompt: |
    Draft a [RFI invitation / clarification request / unsuccessful-bidder
    notice / onboarding request] to [VENDOR].

    Context:
    [PASTE HERE]

    Professional and neutral. Make no commitment on price, award, or volume.
    If this is a decline, keep it courteous and non-specific about reasons.
    Draft for my review — do not treat this as ready to send.
  example_input: The type of message, the vendor, and two or three lines of context
    about where the process stands.
  example_output: A short, neutral message that says what is needed without implying any
    commitment or decision.
---

## When to use this

Routine vendor correspondence during a live solicitation, where the tone has
to stay even and nothing can read as a promise.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat) too, since you paste the
  source material in.
- For a decline, resist the urge to add reasons. Debrief content is governed
  by procurement policy and belongs in a separate, deliberate conversation.
- Add your unit's standard signature block and the solicitation number so
  the message is filed correctly on their end.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Read specifically for implied commitments — "we look forward to working
  with you" during an open solicitation is a problem.
- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment.
- Anything going to a vendor during a live solicitation should be checked
  against the communication rules for that solicitation.
