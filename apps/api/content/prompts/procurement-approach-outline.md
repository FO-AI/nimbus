---
slug: procurement-approach-outline
kind: prompt
title: Work out the procurement approach for a project
summary: Talk through what you need to buy and get a reasoned outline of the route to
  market, contract considerations, and value-for-money approach.
tags: [procurement, sourcing, planning, strategy]
related_slugs: [sensitive-data, copilot-chat, sourcing-strategy-outline]
source:
  mode: import
  url: https://ai.gov.uk/knowledge-hub/prompts/
  title: AI Knowledge Hub — Prompt library
  publisher: UK Government (Incubator for AI)
  license: Open Government Licence v3.0
  license_url: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
  attribution: Crown copyright, UK Government AI Knowledge Hub
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Procurement staff, project leads
  department: Procurement
  tool: Microsoft 365 Copilot Chat
  prompt: |
    You are a senior procurement and finance officer helping me plan the
    commercial approach for [PROJECT].

    Step 1: Ask me for context — what needs procuring (goods, services,
    construction), the estimated value, the timeline, and any constraints such
    as an existing state or cooperative contract. Wait for my answer.

    Step 2: Then outline a procurement approach covering:
    - Route to market: which approach fits, and why — competitive solicitation,
      an existing contract, or a sole-source justification
    - Contract considerations: form of agreement, how risk is allocated, how
      performance is held to account
    - Market and value: how to engage the vendor market, and how we will
      demonstrate value rather than just lowest price

    Flag anywhere the answer depends on a University or state procurement
    threshold I need to confirm with Procurement Services.
  example_input: A project name; the assistant then asks you what you are buying,
    roughly what it costs, and when you need it.
  example_output: A reasoned route-to-market recommendation with the trade-offs stated
    and threshold questions flagged for Procurement Services.
---

## When to use this

Early in a project, when you know what you need but not how it should be
bought.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- Tell it the estimated value honestly. Thresholds drive everything here,
  and a wrong number produces a confidently wrong route.
- Add any existing contract you might use — it changes the recommendation
  completely.

## What to check

- Procurement Services owns the route decision. This produces a proposal to
  discuss with them, not an approach to start executing.
- Thresholds and required approvals are the part most likely to be wrong.
  Verify every one before acting.
- It states assumptions when you leave gaps, which is useful — but only if
  you read them. An unread assumption becomes a fact by the time the
  document is circulated.
