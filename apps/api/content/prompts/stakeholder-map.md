---
slug: stakeholder-map
kind: prompt
title: Map stakeholders by influence and interest
summary: Categorize the groups affected by a change into an influence-and-interest
  matrix, with the reasoning for each placement written down.
tags: [planning, stakeholders, change, project-management]
related_slugs: [sensitive-data, copilot-chat, stakeholder-engagement-plan, how-to-write-a-prompt]
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
    You are a stakeholder manager. Create a stakeholder map for [PROJECT],
    which will affect [DESCRIBE THE CHANGE].

    Stakeholder groups: [LIST THEM]

    Produce:
    - A 2x2 matrix placing each group by influence and by interest
    - The rationale for each placement, in one sentence
    - Any assumptions you made about a group's position

    Suitable for discussion with the project's sponsors. Refer to groups and
    roles only — do not write about named individuals.
  example_input: A project description, the nature of the change, and a list of the
    groups affected.
  example_output: A 2x2 placement of each group with the reasoning stated and
    assumptions surfaced.
---

## When to use this

At the start of anything that changes how other people work — a system
rollout, a process change, a reorganization of a service.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- The "groups and roles only" instruction matters at UNC. A stakeholder map
  naming individuals and their attitudes is a document you do not want to
  have written.
- Add groups it will not think of: the people who maintain the current
  process, and whoever handles the exceptions.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Placements are guesses from your description. Test the surprising ones
  with someone who knows the group.
- Low interest is often low awareness. A group placed in the bottom corner
  may simply not know yet.
- Keep this internal. Even without names, an influence map is sensitive.
