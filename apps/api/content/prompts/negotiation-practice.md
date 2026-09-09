---
slug: negotiation-practice
kind: prompt
title: Practice a negotiation before you have it
summary: Rehearse a real negotiation against an AI counterpart, then get feedback on how
  you handled alternatives, framing, and concessions.
tags: [ai-literacy, negotiation, procurement, practice]
related_slugs: [sensitive-data, copilot-chat, vendor-negotiation-prep-brief, how-to-write-a-prompt]
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
  audience: Procurement staff, unit managers
  department: All
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    This is a role-play in which I practice a negotiation and get feedback.
    You play a practical mentor, and then the counterpart.

    Step 1: Ask me about my experience with negotiating and the kind of work I
    do, one question at a time, so you can tailor the scenario. Wait for each
    answer.

    Step 2: Suggest 3 different scenarios and let me pick one. Keep them
    relevant to university operations — a vendor renewal, an internal
    disagreement over shared costs, a scope negotiation with another unit.

    Step 3: Announce BEGIN ROLE PLAY, then play the counterpart in character.
    Be realistic, not accommodating. Push back the way a real counterpart would.
    Stay in role until I say stop.

    Step 4: Then give me feedback on how I did, covering: whether I understood
    my alternatives and theirs, whether I asked enough questions before making
    offers, how I framed the first number, what I conceded and what I got in
    return, and my tone.

    Be specific and direct in the feedback. Quote things I actually said.
  example_input: A short description of your role and the kind of negotiation you want
    to practice.
  example_output: A realistic role-play, followed by specific feedback quoting your own
    moves and naming what you conceded for nothing.
---

## When to use this

Before a renewal conversation or a difficult internal negotiation, when the
stakes are real and you have not done many.

## How to adapt it

- Runs in any approved tool — [Copilot Chat](/guides/copilot-chat) or
  [PromptLab](/guides/promptlab).
- This one is a conversation, not a one-shot prompt. It will ask a question
  and stop. Answer properly and it works; rush it and you get nothing.
- Adapted from the Wharton Generative AI Labs prompt library, which writes
  for a classroom. References to students and instructors have been changed
  to teams and colleagues.
- The "be realistic, not accommodating" instruction matters — the default
  counterpart is far too agreeable to be useful practice.
- Use a scenario resembling your real one but do not use the actual vendor,
  terms, or numbers. See below.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **Practice with invented details.** Do not rehearse using real vendor
  pricing, contract terms, or anything NDA-covered — that is Tier 2 material
  and this is a practice exercise, not a work product. See
  [what data can I put into an AI tool](/guides/sensitive-data).
- The AI counterpart is not the real one. It will not have their
  constraints, their authority limits, or their history with us.
- Feedback is generic negotiation coaching. Procurement Services still owns
  the actual approach — pair this with the
  [negotiation prep brief](/prompts/vendor-negotiation-prep-brief).
