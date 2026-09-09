---
slug: stakeholder-engagement-plan
kind: prompt
title: Build a stakeholder engagement plan
summary: Turn a stakeholder map into tailored objectives, messages, methods, and
  frequency for each group affected by a change.
tags: [planning, stakeholders, communications, change]
related_slugs: [sensitive-data, copilot-chat, stakeholder-map, how-to-write-a-prompt]
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
    You are a stakeholder engagement lead for [PROJECT].

    Step 1: Ask me who the stakeholder groups are — internal (sponsors, users,
    the delivery team, leadership) and external (other units, vendors, campus
    partners) — and what concerns each has raised. Wait for my answer.

    Step 2: Categorize them by influence and interest, then for each major
    group give me:
    - Objective: what we need from them, or want for them
    - Key messages: what they actually care about
    - Method and frequency: how and how often we engage
    - Who owns that relationship

    Groups and roles only, never named individuals. Flag any group where I have
    not told you enough to plan properly.
  example_input: Your stakeholder list, with what each group has already said or is
    likely to worry about.
  example_output: A per-group engagement plan with objectives, messages, cadence, and a
    named owning role.
---

## When to use this

Once the stakeholder map exists and it is time to say what you will actually
do about each group.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab). Nothing here needs the licensed Copilot.
- Adapted from the UK Government AI Knowledge Hub. British public-sector
  terms have been replaced with UNC equivalents; if a phrase still reads
  oddly for your work, rewrite it rather than working around it.
- Set a realistic cadence. A plan with weekly touchpoints for nine groups is
  a plan nobody will run.
- Add the group that will be most inconvenienced by the change — engagement
  plans routinely omit them.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Messages it drafts are generic by default. Rewrite them in the specific
  terms each group uses.
- An engagement plan with no owner per group does not get executed. Fill
  that column.
- Keep it internal and role-based.
