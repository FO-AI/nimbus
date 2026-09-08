---
slug: contract-renewal-watch
kind: prompt
title: List contract renewals and notice deadlines coming up
summary: Pull upcoming vendor contract expiries, notice deadlines, and auto-renewal
  flags out of your contract files into a dated action list.
tags: [procurement, contracts, renewals, copilot]
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
    From our contract files, list vendor contracts with renewals or expiries in
    the next [TIMEFRAME]. Give me a table with:
    - Vendor and contract
    - Expiry or renewal date
    - Notice deadline
    - Auto-renew — yes, no, or unknown
    - Owner

    Sort by soonest deadline. Mark anything uncertain as "verify in contract."
    This is an action list, not a recommendation to renew or re-bid.
  example_input: A folder of contract documents the licensed Copilot can read, and a
    timeframe such as the next six months.
  example_output: A deadline-sorted table of upcoming renewals with auto-renewal status
    and owners, uncertainties marked.
---

## When to use this

Quarterly, so notice deadlines are caught with time to act rather than
discovered after a contract has auto-renewed.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Set the timeframe wider than the longest notice period in your portfolio,
  or the list will miss the ones that matter.
- Add "flag any contract with no named owner" — unowned contracts are the
  ones that auto-renew.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Dates extracted from contract PDFs are wrong often enough that the "verify
  in contract" instruction is not a formality. Check each one.
- A missing contract is invisible here. This list covers what is in the
  folder, not what exists.
- Vendor-confidential material and bid responses are Tier 2. Keep this in an
  approved tool and never paste anything covered by an NDA into a consumer
  chatbot. See
  [what data can I put into an AI tool](/guides/sensitive-data).
