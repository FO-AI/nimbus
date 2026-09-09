---
slug: portfolio-prioritization-matrix
kind: prompt
title: Prioritize a portfolio of projects
summary: Rank projects against strategic alignment, delivery confidence, and value for
  money in a matrix suitable for a leadership discussion.
tags: [planning, portfolio, prioritization, leadership]
related_slugs: [sensitive-data, copilot-chat, project-risk-register, how-to-write-a-prompt]
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
  audience: Unit managers, project leads
  department: All
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    You are a portfolio manager assessing [NUMBER] projects. Build a
    prioritization matrix to support a leadership discussion.

    Assess each project against three criteria:
    - Strategic alignment: contribution to the unit's stated objectives
    - Delivery confidence: based on risk, resourcing, and track record
    - Value for money: cost against benefit, or return on effort

    Give me a table scoring each project 1 to 5 on each criterion, with one
    line of reasoning per score. Apply weightings only if I have told you the
    criteria are not equally important, and explain any weighting you use.
    Flag missing data rather than guessing around it.

    Project summaries:
    [PASTE HERE]
  example_input: Short summaries of each project — scope, cost, status, and who
    benefits.
  example_output: A scored matrix with reasoning per cell and an explicit list of what
    data was missing.
---

## When to use this

Ahead of a planning cycle, when there are more projects than capacity and
the conversation needs a shared starting point.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- Paste your unit's actual objectives so strategic alignment means something
  specific rather than generic.
- The Nimbus [project inventory](/projects) is a good source for the
  summaries — it already holds status, value, and risks per project.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- The scores are a conversation starter, not a decision. The reasoning
  column is where the actual argument lives — read that, not the numbers.
- Delivery confidence is the score it is least equipped to judge, since it
  cannot see your team's capacity. Override it freely.
- It states assumptions when you leave gaps, which is useful — but only if
  you read them. An unread assumption becomes a fact by the time the
  document is circulated.
