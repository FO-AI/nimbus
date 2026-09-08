---
slug: change-management-plan
kind: prompt
title: Draft a change management plan
summary: Build the people side of a process change — key messages, likely reactions by
  group, a communication and training timeline, and the risks.
tags: [planning, change, communications, training]
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
  audience: Project leads, unit managers
  department: All
  tool: Microsoft 365 Copilot Chat
  prompt: |
    You are a change manager. Develop a practical change management plan for
    the people side of [PROJECT].

    Project name: [NAME]
    Goal: [GOAL]
    Current status: [STATUS]
    Key deliverables: [DELIVERABLES]

    Produce four parts:
    1. Key messages — why this change, and what people get out of it
    2. Stakeholder analysis table, with columns for the group, their likely
       reaction, and the communication approach that fits it
    3. Communication and training plan — a timeline of activities, each with
       who delivers it, what it covers, and when
    4. Risks to adoption, and how to mitigate each

    Plain language, ready for a governance meeting. Refer to groups and roles,
    never to named individuals.
  example_input: The project's goal, current status, deliverables, and who has to work
    differently as a result.
  example_output: A four-part plan with a reaction-by-group table and a dated
    communication and training timeline.
---

## When to use this

When a system or process change will require people to work differently and
someone has to plan for that, not just the build.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- Adapted from the UK Government AI Knowledge Hub, with British public-
  sector terms replaced by UNC equivalents.
- "Likely reaction" is the column worth spending time on. Correct it from
  what you actually know about each group.
- Add the training people will need on day one, separately from the training
  that can wait a month.

## What to check

- Predicted reactions are guesses. Treat them as prompts to go and ask, not
  as findings.
- Adoption risks it lists are generic. The real one is usually specific to
  your unit and will not appear unless you add it.
- Groups and roles only — a document predicting how named colleagues will
  react is not one to write.
