---
slug: new-hire-setup-checklist
kind: prompt
title: Build a setup checklist for a new hire
summary: Gather the equipment, access, workspace, and training arrangements discussed
  for a new starter into a complete setup checklist.
tags: [hr-operations, onboarding, checklist, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, position-description-draft, how-to-write-a-prompt]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for Administrative & Executive Assistants
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Administrative and operations staff
  department: HR operations
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    Search my email and Teams for onboarding arrangements for [NEW HIRE /
    position] starting [DATE]. Compile a setup checklist covering:
    - IT equipment mentioned
    - System access and permissions discussed
    - Workspace arrangements
    - Training scheduled
    - Introduction meetings
    - First-week activities

    Then compare against our standard checklist and list what is missing.
  example_input: A start date and the arrangement threads between the hiring manager,
    IT, and facilities.
  example_output: A setup checklist plus an explicit gap list of standard items nobody
    has arranged yet.
---

## When to use this

A week before someone starts, to catch the access request or the desk nobody
remembered to arrange.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Paste your unit's standard onboarding checklist into the prompt so the
  comparison is against something real.
- For a position with ConnectCarolina or InfoPorte access, note that
  Business & Financial Systems Access requests run on their own timeline —
  start them early.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Do not include the person's personal data — home address, SSN, date of
  birth. This is a logistics checklist.
- The gap list is only as good as the standard checklist you gave it.
  Without one, it will invent plausible steps.
