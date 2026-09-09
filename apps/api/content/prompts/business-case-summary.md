---
slug: business-case-summary
kind: prompt
title: Summarize a business case for decision-makers
summary: Condense a full business case into an executive summary that non-specialists
  can act on, with assumptions and speculative content flagged.
tags: [business-case, writing, leadership, summarizing]
related_slugs: [sensitive-data, copilot-chat, business-case-builder, how-to-write-a-prompt]
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
  audience: Project leads, unit managers
  department: All
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    You are an experienced business case manager. Write a summary of the
    business case below for senior decision-makers who are not close to the
    detail.

    Structure it as:
    1. Overview — title, purpose, scope, target completion, estimated total cost
    2. Strategic: the case for change and how it fits our priorities
    3. Options and value: what was considered and why this option
    4. Procurement and delivery: how it gets bought and run
    5. Funding: cost, source, and affordability

    If anything essential is missing, ask me before you write. State any
    assumption explicitly and flag speculative or unverifiable content.
    Professional executive-summary tone, no jargon.

    Business case:
    [PASTE HERE]
  example_input: A full business case document pasted in, or referenced if you are using
    the licensed Copilot.
  example_output: A two-page executive summary with assumptions stated and anything
    speculative flagged.
---

## When to use this

When a full case exists and the people deciding will read two pages of it at
most.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- Add "state the decision being asked for in the first sentence" — summaries
  that bury the ask get deferred.
- Name the audience specifically. A summary for a budget officer is a
  different document from one for a dean.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Summarizing loses caveats first. Check that material risks and constraints
  survived the compression.
- Verify every figure against the source case. Restated numbers drift.
- It states assumptions when you leave gaps, which is useful — but only if
  you read them. An unread assumption becomes a fact by the time the
  document is circulated.
