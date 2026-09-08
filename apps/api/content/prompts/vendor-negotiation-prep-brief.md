---
slug: vendor-negotiation-prep-brief
kind: prompt
title: Build a negotiation preparation brief
summary: Assemble pricing history, dependence on both sides, and open asks into talking
  points before you sit down with a vendor.
tags: [procurement, vendor, negotiation, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, vendor-spend-summary, how-to-write-a-prompt]
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
    For the negotiation with [VENDOR] on [SCOPE], gather from my email and
    documents:
    - History — prior pricing, terms, and any concessions either side made
    - Our spend with them and how dependent we are; how dependent they are on us
    - Issues and asks each side has raised
    - Any market or alternative-vendor signals mentioned internally

    Prepare a brief with talking points and the questions I should ask. This is
    preparation only — not a negotiating mandate and not a price recommendation.
  example_input: A vendor name, the scope under negotiation, and a mailbox covering the
    current contract term.
  example_output: A briefing with the relationship history, a candid read on dependence
    in both directions, and a question list.
---

## When to use this

Before a renewal or a pricing conversation, when the leverage is real but
nobody has written down what it is.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add "list what we have conceded before and never got back" — that is the
  pattern most worth seeing before you concede again.
- For a cooperative or state contract, add that pricing is set by the master
  agreement so the negotiation is about scope and service, not rate.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment. Your
  negotiating authority comes from Procurement Services, not from this
  brief.
- Dependence estimates are inferred from correspondence and are often wrong
  in your disfavour. Sanity-check against actual spend.
- Vendor-confidential material and bid responses are Tier 2. Keep this in an
  approved tool and never paste anything covered by an NDA into a consumer
  chatbot. See
  [what data can I put into an AI tool](/guides/sensitive-data).
