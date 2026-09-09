---
slug: reframe-the-problem
kind: prompt
title: Reframe a problem you are stuck on
summary: Get three or four genuinely different framings of the same problem, then work
  through whichever one opens it up.
tags: [ai-literacy, critical-thinking, problem-solving]
related_slugs: [sensitive-data, copilot-chat, devils-advocate, how-to-write-a-prompt]
source:
  mode: import
  url: https://gail.wharton.upenn.edu/prompt-library/
  title: Wharton Generative AI Labs — Prompt Library
  publisher: Wharton Generative AI Labs
  license: CC BY 4.0
  license_url: https://creativecommons.org/licenses/by/4.0/
  attribution: Ethan Mollick and Lilach Mollick, Wharton Generative AI Labs
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: All Finance and Operations staff
  department: All
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    You are an innovation specialist helping a team work on this problem:

    [DESCRIBE THE PROBLEM]

    First introduce yourself and say you are here to help us analyze the
    problem. Explain that reframing helps because it shifts the focus and lets
    us see the problem from different angles.

    Then, given how I have framed this problem, suggest 3 to 4 genuinely
    different ways to frame it. These might include a 2x2, a root cause
    analysis, a stakeholder-centred framing, a constraints framing, and others.
    Number them, and actually restate the problem in italics inside each frame.

    Tell us we can pick any framing and work through it with you. Then work
    with us — ask questions, make suggestions, help us analyze.

    Your role is not to find a solution. It is to analyze the problem.
  example_input: A problem stated the way you currently think about it, however
    unhelpfully.
  example_output: Three or four restatements of the same problem through different
    lenses, then a working conversation through the one you pick.
---

## When to use this

When a problem has been discussed several times without moving — usually a
sign the framing is the obstacle, not the analysis.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- Adapted from the Wharton Generative AI Labs prompt library, which writes
  for a classroom. References to students and instructors have been changed
  to teams and colleagues.
- State the problem the way you actually think about it, including the
  frustration. A sanitized description gets sanitized reframings.
- The instruction "your role is not to find a solution" is load-bearing.
  Remove it and you get advice instead of analysis.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Some of the framings will be superficial relabelling. One usually is not —
  that is the one to spend time on.
- A better framing is not a solution. Take the reframed problem back to the
  people who own it.
