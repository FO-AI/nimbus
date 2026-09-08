---
slug: position-description-draft
kind: prompt
title: Draft a position description
summary: Turn a short brief into a position description with purpose, responsibilities,
  and requirements in inclusive plain language.
tags: [hr-operations, writing, hiring, copilot]
related_slugs: [sensitive-data, copilot-chat, new-hire-setup-checklist, how-to-write-a-prompt]
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
  tool_slug: copilot-chat
  prompt: |
    Draft a position description for [POSITION] from this brief:
    [PASTE HERE]

    Include purpose, key responsibilities, and requirements split into
    must-have and preferred. Use inclusive, plain language — no gendered or
    exclusionary terms, no unnecessary degree requirements.

    Mark it "DRAFT — for hiring manager and HR review." Flag anything missing
    as [TBC]. Describe the position only. Do not write anything about
    evaluating, screening, or ranking candidates.
  example_input: A few lines on what the position does, who it reports to, and what the
    unit needs from it.
  example_output: A position description draft with must-have and preferred requirements
    separated and gaps flagged.
---

## When to use this

At the start of a recruitment, to get a first draft of the description into
HR's hands faster.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat), since you paste the source
  material in.
- Add the University position classification if you have one — the
  description has to sit inside it.
- The "no unnecessary degree requirements" instruction matters. Copilot adds
  them by default, and they narrow your applicant pool for no reason.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- This must never become input to a hiring, evaluation, or discipline
  decision. The Staff Generative AI Usage Guidance prohibits AI in all three
  — see [what data can I put into an AI tool](/guides/sensitive-data).
  Drafting the description is permitted; using AI anywhere in screening or
  selection is not.
- Read for inclusive language yourself. Copilot removes obvious terms and
  misses the subtler ones.
- HR owns the final description. This is a draft to save you a blank page.
