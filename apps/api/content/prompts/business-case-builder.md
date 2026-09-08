---
slug: business-case-builder
kind: prompt
title: Build a business case step by step
summary: An interactive walkthrough that asks for what a business case needs across
  strategy, options, procurement, funding, and delivery, then drafts it.
tags: [business-case, planning, writing, budget]
related_slugs: [sensitive-data, copilot-chat, business-case-summary]
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
  prompt: |
    You are an experienced business case advisor. Guide me through building a
    business case for [PROJECT].

    Step 1: Ask me what stage this is at — an early outline, a full case for
    approval, or something in between — and what the reviewers care about most.
    Wait for my answer.

    Step 2: Prompt me, a few questions at a time, for what you need across five
    areas:
    - Strategic: why this, why now, and how it fits the unit's priorities
    - Options and value: what alternatives were considered, costs and benefits
    - Procurement: how it would be bought and from whom
    - Funding: what it costs, where the money comes from, affordability
    - Delivery: who runs it, governance, risks, and how we would know it worked

    Step 3: Build the case from my answers, with a section per area. Do not
    invent figures. Where I have not given you something, write [TBC] rather
    than filling the gap.

    Formal and evidence-based, ready for review by a budget officer.
  example_input: A project name; the assistant then interviews you across the five areas
    before drafting anything.
  example_output: A structured business case with a section per area and every gap
    explicitly marked [TBC].
---

## When to use this

When you need to make a case for funding and would rather be asked the right
questions than stare at a template.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it. The
  original follows the UK "Five Case Model"; the five areas above are the
  same structure in ordinary language.
- Do the interview properly. Rushing step 2 is what produces a business case
  that reads well and says nothing.
- For a smaller request, ask it to compress the five areas into two pages.

## What to check

- The [TBC] instruction is the guardrail against invented numbers. If the
  draft has no [TBC] markers, check every figure against what you actually
  supplied.
- The options section is what reviewers test hardest. A case with one real
  option and two straw men is visible immediately.
- It states assumptions when you leave gaps, which is useful — but only if
  you read them. An unread assumption becomes a fact by the time the
  document is circulated.
