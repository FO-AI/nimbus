---
slug: project-risk-register
kind: prompt
title: Develop a project risk register
summary: Identify the top delivery risks for a project with scoring, mitigation actions,
  owners, and the early indicators that a risk is materializing.
tags: [planning, risk, project-management]
related_slugs: [sensitive-data, copilot-chat, project-consequence-scan, how-to-write-a-prompt]
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
    You are a senior risk manager. Develop a risk register identifying the top
    5 to 10 delivery risks for [PROJECT], which is at [STAGE].

    For each risk give me:
    - The risk, written as a cause, an event, and an effect
    - Likelihood and impact, on a 1 to 5 scale, with the reasoning
    - Mitigation actions, and who owns each
    - An early indicator that would tell us the risk is materializing

    Base this on the project details below and on common failure patterns for
    this kind of work. Distinguish clearly between risks I have told you about
    and risks you are inferring.

    Project details:
    [PASTE HERE]
  example_input: A project description including scope, timeline, dependencies, and who
    is involved.
  example_output: A register of 5 to 10 scored risks with owners, mitigations, and early
    indicators, separating supplied from inferred risks.
---

## When to use this

At project start, and again at any stage gate — a register written once and
never revisited is decoration.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- The early-indicator column is the one people leave out and the one that
  makes a register operational. Keep it.
- Add your unit's actual dependencies — vendor systems, other units, hiring
  — since those are where the real risks sit.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- The scores are the model's judgement, not yours. Rescore every row with
  the people who own the work.
- It generates generic project risks convincingly. The inferred-versus-
  supplied split is what lets you tell them apart.
- A risk with no named owner is not managed. Fill every owner cell before
  circulating.
