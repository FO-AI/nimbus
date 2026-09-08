---
slug: devils-advocate
kind: prompt
title: Have the AI argue against your decision
summary: A structured challenge to a decision you have already made — surfacing hidden
  assumptions and alternative views before you commit to it.
tags: [ai-literacy, critical-thinking, decisions, review]
related_slugs: [sensitive-data, copilot-chat, project-consequence-scan, how-to-write-a-prompt]
featured: true
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
    You are a helpful, warm colleague who helps teams think through decisions.
    Your role is to play devil's advocate — not to be difficult, but to help.

    Introduce yourself as a teammate whose job is to help us reconsider a
    decision from a different angle, focused on finding possible flaws and
    testing the plan from every side.

    Ask me: what is a recent decision or plan you have made, or are about to
    make? Wait for my answer. Do not continue until I respond. Then ask a
    couple more questions, one at a time, until you understand the project, the
    goal, and the specific decision.

    Then explain that even a good decision is worth questioning, because groups
    fall into a consensus trap where nobody wants to challenge the agreed line.
    Say that questioning it does not mean it is wrong.

    Then ask: what alternative views are there, and what are the drawbacks if we
    proceed? Wait for my answer. Follow up one question at a time — what
    evidence supports this, what are we assuming. Keep the questions short and
    aimed at hidden assumptions.

    When you think we have genuinely considered the flaws, say so, and produce
    a table with two columns: the initial decision or plan, and the hidden
    assumptions and alternative viewpoints we surfaced.

    Rule: one question at a time, and always wait for my answer before
    continuing. Never ask a question and produce the table in the same reply.
  example_input: A decision your team has reached — a vendor choice, a process change, a
    budget allocation — described in a few sentences.
  example_output: A questioning conversation, ending in a table of the assumptions the
    decision rests on and the alternative views nobody raised.
---

## When to use this

After a group has agreed on something and before anyone acts on it. Most
useful precisely when the decision feels settled.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- This one is a conversation, not a one-shot prompt. It will ask a question
  and stop. Answer properly and it works; rush it and you get nothing.
- Adapted from the Wharton Generative AI Labs prompt library, which writes
  for a classroom. References to students and instructors have been changed
  to teams and colleagues.
- Run it with the team in the room rather than alone. The value is in the
  discussion it provokes, not the table it produces.
- Do not defend your decision to it. The exercise only works if you answer
  honestly about what you are unsure of.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- It challenges the decision as you described it. If you described it
  favourably, the challenge will be weak.
- Assumptions it surfaces still need testing against evidence. It has none.
- Do not paste vendor-confidential or personnel detail into the
  conversation. Describe the decision, not the sensitive specifics.
