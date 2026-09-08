---
slug: project-communication-plan
kind: prompt
title: Create a project communication plan
summary: Build a communication plan with objectives, audiences, strategy,
  implementation, and how you will evaluate whether it worked.
tags: [planning, communications, change, project-management]
related_slugs: [sensitive-data, copilot-chat, stakeholder-engagement-plan]
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
  audience: Project leads, communications staff
  department: All
  tool: Microsoft 365 Copilot Chat
  prompt: |
    You are a communications manager. Create a communication plan for
    [PROJECT], which aims to [AIMS AND INTENDED EFFECT], for the stakeholder
    groups [LIST THEM].

    Structure the plan as:
    - Objective: what the communication is for, stated measurably
    - Audience: each group, and what they need to hear
    - Strategy: the approach and the core narrative
    - Implementation: channels, timing, and who does what
    - Scoring: how we will know whether it worked

    Then give me a short evaluation approach: what to measure, when, and what
    would count as success.
  example_input: The project aims, the change people will experience, and the groups you
    need to reach.
  example_output: A five-part communication plan with a channel-and-timing schedule and
    a defined way to evaluate it.
---

## When to use this

For a rollout or process change where communication is a workstream rather
than an afterthought.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it. The five-
  part structure comes from a UK government campaign framework; it works
  unchanged here.
- Add the channels your audience actually reads. A plan built on channels
  nobody opens fails quietly.
- Ask for "what we will say if it goes wrong" as a sixth section — that
  message is best written before you need it.

## What to check

- The evaluation section is usually vague. Make each measure something you
  can actually collect.
- Objectives it writes tend to be about outputs ("send three emails") rather
  than effects. Rewrite them as effects.
- It states assumptions when you leave gaps, which is useful — but only if
  you read them. An unread assumption becomes a fact by the time the
  document is circulated.
