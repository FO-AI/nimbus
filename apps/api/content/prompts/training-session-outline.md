---
slug: training-session-outline
kind: prompt
title: Outline a training session from learning objectives
summary: Turn objectives and an audience into a session outline with outcomes,
  structure, activities, and a suggested duration.
tags: [hr-operations, training, learning, copilot]
related_slugs: [sensitive-data, copilot-chat, sop-first-draft]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for HR & People
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: HR operations staff
  department: HR operations
  tool: Microsoft 365 Copilot Chat
  prompt: |
    From these objectives, outline a training session:
    - Learning outcomes, stated as what someone can do afterwards
    - Section structure with the key points in each
    - Activities or checks for understanding
    - Suggested duration for each section

    Draft outline for review by whoever knows the subject. Flag clearly where
    source content is needed and does not exist yet.

    Objectives and audience:
    [PASTE HERE]
  example_input: Two or three learning objectives plus a description of who is attending
    and their starting level.
  example_output: A timed session outline with activities and explicit flags where
    content still has to be written.
---

## When to use this

Designing an internal training session — a systems refresher, a process
rollout, an onboarding module.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat), since you paste the source
  material in.
- Be specific about the audience's starting level. Outlines pitched at the
  wrong level are the usual failure.
- Add the real time you have. Copilot defaults to a full-day structure for
  what is actually a 45-minute session.

## What to check

- The activities are usually the weakest part — generic and untethered to
  the material. Rewrite them yourself.
- Content gaps it flags are real work. Count them before committing to a
  delivery date.
