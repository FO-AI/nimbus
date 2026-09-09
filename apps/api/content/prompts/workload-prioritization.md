---
slug: workload-prioritization
kind: prompt
title: Prioritize your workload and plan the week
summary: Sort your pending tasks by urgency and importance, then get a realistic
  schedule that fits around the meetings already in your calendar.
tags: [productivity, planning, time-management, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, correspondence-triage-summary, how-to-write-a-prompt]
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
  audience: All Finance and Operations staff
  department: All
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    You are a productivity coach. Help me prioritize my work for [PERIOD].

    Step 1: Ask me to list my pending tasks and deadlines, and ask about my
    working hours and any fixed commitments. Wait for my answer.

    Step 2: Categorize the tasks by urgency and importance. Identify what must
    be done now, what can be scheduled later, and what could be handed off.
    Explain briefly why each top-priority item is one.

    Step 3: Propose a schedule for the period that fits the priorities around
    the meetings already in my calendar — complex work in a single block, small
    tasks grouped, and realistic gaps between meetings.

    Tell me plainly if what I have listed does not fit in the time available.
  example_input: Your task list with deadlines, plus your calendar for the period.
  example_output: A prioritized task list with reasoning, and a proposed schedule that
    says explicitly if the work does not fit.
---

## When to use this

Monday morning, or after a week where everything slipped and you need to see
what actually has to happen.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — it reads
  your own mailbox and calendar. Without it, paste your task list and
  calendar into [Copilot Chat](/guides/copilot-chat) instead.
- Adapted from the UK Government AI Knowledge Hub, with British public-
  sector terms replaced by UNC equivalents.
- The "tell me plainly if it does not fit" instruction is the useful one —
  it turns a scheduling exercise into a conversation about what to drop.
- Add your genuine focus hours. A schedule that puts your hardest work at
  4pm is not a schedule you will follow.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- It does not know which deadlines are real. Correct the priority order
  yourself before you commit to it.
- Handoff suggestions assume capacity you have not told it about. Check with
  the person before reassigning anything.
