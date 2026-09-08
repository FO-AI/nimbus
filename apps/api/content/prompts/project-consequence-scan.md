---
slug: project-consequence-scan
kind: prompt
title: Scan a project for unintended consequences
summary: Work through the financial, social, environmental, reputational, and legal
  effects of a project — including the positive and unintended ones.
tags: [planning, risk, ethics, project-management]
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
  audience: Project leads, unit managers
  department: All
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Run a consequence scan on the project below. For each of these categories —
    financial, social, environmental, reputational, legal — identify the
    potential positive, negative, and unintended consequences, over the short,
    medium, and long term.

    For each consequence, say who it lands on. Distinguish clearly between
    consequences that follow from what I have described and ones you are
    inferring from similar work elsewhere.

    Project:
    [PASTE HERE]
  example_input: A description of the project, who it affects, and what it changes.
  example_output: A five-category scan across three time horizons, saying who bears each
    consequence, with inferred items marked.
---

## When to use this

Before committing to a project, and specifically before writing the risk
register — consequences are broader than delivery risks.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- Adapted from the UK Government AI Knowledge Hub, with British public-
  sector terms replaced by UNC equivalents.
- The unintended-consequences column is the reason to run this. Do not let
  it be crowded out by the obvious ones.
- For anything touching staff workload or roles, add "include consequences
  for the people who do this work today."
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- A plausible consequence list is easy to generate and easy to over-trust.
  Test the ones that would change your decision.
- Legal consequences need an actual legal opinion, not this. Use it to know
  what to ask about.
- Positive consequences get overstated because the input describes the
  project favourably. Read those most sceptically.
