---
slug: rfp-requirements-draft
kind: prompt
title: Draft structured RFP requirements from a business need
summary: Turn a plain description of what your unit needs into scoped, structured
  requirements ready for category and legal review.
tags: [procurement, rfp, sourcing, writing, copilot]
related_slugs: [sensitive-data, copilot-chat, tender-evaluation-criteria-draft]
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
    From this business need, draft structured RFP requirements:
    - Scope and objectives
    - Mandatory requirements, separated from desirable ones
    - Evaluation criteria — the criteria only, no weights and no scores
    - Commercial and service-level expectations
    - The information we are asking bidders to provide

    Mark the whole thing "DRAFT — for Procurement Services and legal review."
    Flag anything I have not given you as [TBC]. Do not set award thresholds.

    Business need:
    [PASTE HERE]
  example_input: A paragraph or two describing what the unit needs to buy and why, plus
    any constraints you already know.
  example_output: A structured requirements draft with mandatory and desirable clearly
    separated and every gap marked [TBC].
---

## When to use this

At the very start of a sourcing exercise, when you have a need described in
ordinary language and need it in the shape a solicitation expects.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat) too, since you paste the
  source material in.
- Add your unit's non-negotiables explicitly — accessibility, data security
  tier, contract term — or they will be missing.
- Keep the "criteria only, no weights" instruction. Weighting is a panel
  decision and putting it in a draft invites it to be copied forward
  unexamined.

## What to check

- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment.
- The [TBC] markers are the value. A requirements draft with no gaps flagged
  usually means it filled them in for you.
- This goes to Procurement Services before it goes anywhere near a vendor.
