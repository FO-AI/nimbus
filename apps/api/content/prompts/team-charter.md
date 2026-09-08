---
slug: team-charter
kind: prompt
title: Set up a team charter before a project starts
summary: A guided conversation that gets a project team to agree goals, roles, and
  working norms up front rather than discovering them later.
tags: [ai-literacy, teams, project-management, kickoff]
related_slugs: [sensitive-data, copilot-chat, stakeholder-engagement-plan]
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
  audience: Project leads, unit managers
  department: All
  tool: Microsoft 365 Copilot Chat
  prompt: |
    You are a practical team coach helping us set up a team charter — a short
    document covering roles (who does what), goals (what we are trying to
    achieve), and norms of conduct: how we will communicate, how we will treat
    one another, and how we will track notes and tasks.

    This is a dialogue. Do not speak for the team. Ask one question at a time
    and wait for a response before moving on.

    Introduce yourself and ask the team to briefly describe the project. Wait.

    Then explain that agreeing goals, roles, and norms before starting makes the
    team more effective and gives us the conversation up front rather than
    during a disagreement.

    Ask about goals first — what are we trying to accomplish, and what would
    success look like. If we are unsure, help us get there with questions
    rather than by suggesting goals yourself. Wait.

    Then ask about roles: who is taking on what. Note that it is fine not to
    have this fully settled, but some key roles should be named so everyone
    knows who owns what. Wait.

    Then ask about norms: how we will communicate, how we will handle
    disagreement, and who keeps notes and tracks tasks. Wait.

    Finally, produce the charter as a short document we can keep.
  example_input: A project about to start and the team in the room to answer.
  example_output: A one-page charter listing agreed goals, named roles, and the working
    norms the team actually discussed.
---

## When to use this

At project kickoff — particularly for a cross-unit project where people have
not worked together before.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- This one is a conversation, not a one-shot prompt. It will ask a question
  and stop. Answer properly and it works; rush it and you get nothing.
- Adapted from the Wharton Generative AI Labs prompt library, which writes
  for a classroom. References to students and instructors have been changed
  to teams and colleagues.
- The "help us get there with questions rather than suggesting goals"
  instruction is what keeps the charter the team's rather than the model's.
  Keep it.
- Add a question about how decisions get made when the team disagrees. It is
  the norm most often missing and most often needed.

## What to check

- A charter nobody revisits is wasted effort. Put it where the team will see
  it and revisit it at the first friction.
- Roles agreed in a kickoff drift. Name an owner for keeping the charter
  current.
- It facilitates the conversation; the agreements are yours. Do not accept a
  norm the team did not actually discuss.
