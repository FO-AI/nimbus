---
slug: sourcing-strategy-outline
kind: prompt
title: Outline a sourcing strategy for a category
summary: Draft current state, market considerations, options, and risks for a spend
  category, with assumptions flagged and no recommendation.
tags: [procurement, sourcing, strategy, copilot]
related_slugs: [sensitive-data, copilot-chat, vendor-spend-summary]
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
    Draft a sourcing strategy outline for [CATEGORY] from the inputs below:
    - Current state — spend, vendors, contracts — exactly as I have given it
    - Market and supply considerations that have been raised
    - Options: consolidate, competitively bid, partner, or bring in-house
    - Risks and dependencies for each option

    Mark it "DRAFT — for review." Flag every assumption. Do not recommend a
    route as though it were a decision.

    Inputs:
    [PASTE HERE]
  example_input: Current spend and vendor list for the category, plus any market context
    you already have.
  example_output: An options outline with the trade-offs for each route and every
    assumption explicitly flagged.
---

## When to use this

When a category is up for rethinking and you need the options laid out
fairly before anyone forms a view.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat) too, since you paste the
  source material in.
- Add the state and University procurement thresholds that apply — they
  constrain the options more than market factors do.
- Ask it to state what evidence would be needed to choose between the
  options. That is usually the real next step.

## What to check

- It will produce a plausible option set that omits the constraint that
  actually decides it. Read for what is missing, not what is there.
- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment.
