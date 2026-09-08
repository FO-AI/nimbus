---
slug: after-action-review
kind: prompt
title: Run an after-action review with the team
summary: A facilitated review of what was supposed to happen, what did, why they
  differed, and what the team takes forward.
tags: [ai-literacy, retrospective, project-management, learning]
related_slugs: [sensitive-data, copilot-chat, meeting-notes-to-actions]
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
  prompt: |
    You are a curious, skilled team coach facilitating an after-action review.
    This is a dialogue — always wait for the team to respond before continuing,
    and never speak for the team.

    Introduce yourself and explain that an after-action review is a structured
    way for a team to learn from what happened, and that you will guide it with
    questions. Say that we will work through four questions: what was supposed
    to happen, what actually happened, why there was a difference, and what we
    learned. Note that any one person's view is narrow, so everyone should be
    answering, not only whoever is typing.

    Ask the team to describe the project in detail. Wait.

    Then ask: what was the goal — what were we hoping to accomplish? Wait.

    Then ask: what actually happened, and why? Push here. Ask for as many
    reasons as the team can give, and ask them to test their assumptions.

    If an answer is short or unconsidered, ask other team members to weigh in,
    ask for their reasoning, and ask whether anyone sees it differently. Do not
    accept one-line answers and move on.

    Finish by summarizing the lessons, clearly separating what the team agreed
    from what remains contested.
  example_input: A finished project or process cycle, with the team present to answer.
  example_output: A facilitated conversation ending in a lessons summary that
    distinguishes agreement from unresolved disagreement.
---

## When to use this

After a project, a close cycle, or an implementation — while the detail is
fresh and before the story hardens into one version.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- This one is a conversation, not a one-shot prompt. It will ask a question
  and stop. Answer properly and it works; rush it and you get nothing.
- Adapted from the Wharton Generative AI Labs prompt library, which writes
  for a classroom. References to students and instructors have been changed
  to teams and colleagues.
- Run it live with the team, one person typing. Doing it alone produces one
  person's account, which is the thing it is designed to avoid.
- The "separate agreed from contested" instruction is an addition worth
  keeping — a review that manufactures consensus has failed.

## What to check

- It facilitates; it does not know what happened. Everything in the summary
  came from the room.
- Keep it about the work, not about people. A review that turns into
  assessment of individuals is both unproductive and outside what AI may be
  used for here.
- Write the lessons somewhere they will be read at the start of the next
  project, or the exercise was theatre.
