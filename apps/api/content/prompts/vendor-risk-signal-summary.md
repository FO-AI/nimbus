---
slug: vendor-risk-signal-summary
kind: prompt
title: Surface internal risk signals about a vendor
summary: Search internal correspondence for financial, delivery, quality, or dependency
  concerns about a vendor and list them as flags for review.
tags: [procurement, vendor, risk, copilot]
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
    Search my internal email and documents for risk signals about [VENDOR]:
    - Financial, delivery, quality, or compliance concerns anyone mentioned
    - Single-source or dependency risks that have been raised
    - Any disputes or escalations

    Summarize as flags for review, each with the date and who raised it. This is
    NOT a risk rating and NOT a compliance determination — both require formal
    due diligence and a human decision.
  example_input: A vendor name and access to your unit's correspondence and files.
  example_output: A dated list of concerns raised internally, attributed, with no rating
    or conclusion attached.
---

## When to use this

Ahead of a renewal or a due-diligence review, to check whether concerns have
been raised that never made it into a formal record.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Widen the search window before a multi-year renewal — the useful signal is
  often two years old.
- Add "note whether each concern was resolved" so old, closed issues do not
  read as live risk.

## What to check

- A flag is a prompt to look, not a finding. Escalating an unverified
  concern about a vendor has real consequences.
- Absence of signal means nothing. Copilot searched your mailbox, not the
  market.
- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment.
