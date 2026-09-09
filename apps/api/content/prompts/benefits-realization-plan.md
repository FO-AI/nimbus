---
slug: benefits-realization-plan
kind: prompt
title: Draft a benefits realization plan
summary: Turn a project's intended value into a benefits register with owners and
  measures, a map from outputs to outcomes, and the risks to delivering them.
tags: [planning, benefits, project-management, business-case]
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
    You are an experienced benefits manager. Create a benefits realization plan
    for [PROJECT], to accompany its business case.

    Produce:
    - A benefits register: a table of each benefit, its owner, how it will be
      measured, and when it should appear
    - A benefits map: how the project's outputs lead to outcomes, and how those
      outcomes support the unit's objectives
    - Key risks and assumptions: what could stop each benefit landing

    Where details are missing, make reasonable assumptions and state each one
    clearly. Suitable for inclusion in a formal business case.

    Project details:
    [PASTE HERE]
  example_input: A description of the project, what it is meant to achieve, and who
    would feel the effect.
  example_output: A benefits register with named owners and measures, a plain-language
    benefits map, and a risks-and-assumptions section.
---

## When to use this

Alongside a business case, when someone has asked how you will know the
project worked.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- Insist on a named owner per benefit. "The unit" owning a benefit means
  nobody does.
- Add "flag any benefit that cannot be measured with data we already
  collect" — those are the ones that quietly disappear.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Benefits that cannot be measured are the ones most likely to be
  overstated. Test each measure for whether the data actually exists.
- It states assumptions when you leave gaps, which is useful — but only if
  you read them. An unread assumption becomes a fact by the time the
  document is circulated.
- A benefits plan is only worth writing if someone revisits it after go-
  live. Set that date now.
