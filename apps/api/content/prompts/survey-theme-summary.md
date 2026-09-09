---
slug: survey-theme-summary
kind: prompt
title: Summarize themes in open-text survey comments
summary: Group free-text survey responses into recurring themes, positive signals, and
  concerns, without attributing anything to an individual.
tags: [hr-operations, survey, analysis, copilot]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt]
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
    Summarize the themes in these open-text comments:
    - Recurring themes, with roughly how often each appears
    - Positive signals
    - Concerns raised
    - A few representative quotes, anonymized

    Neutral summary only. Do not attribute any comment to an individual, and do
    not recommend actions — deciding what to do is a human judgement.

    Comments:
    [PASTE HERE]
  example_input: A block of anonymized free-text responses from a staff or process
    survey.
  example_output: A themed summary with rough frequencies, anonymized illustrative
    quotes, and no recommendations attached.
---

## When to use this

After a staff or process survey, when there are two hundred comments and no
time to read them all carefully.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat), since you paste the source
  material in.
- Strip identifying detail before you paste. In a small unit, a comment
  about a specific role identifies a person.
- Add "list anything mentioned only once but serious" — thematic summaries
  bury the single important comment.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Comments about a named individual, or that identify one by inference, must
  not go into this prompt at all. That crosses into evaluation territory.
- This must never become input to a hiring, evaluation, or discipline
  decision. The Staff Generative AI Usage Guidance prohibits AI in all three
  — see [what data can I put into an AI tool](/guides/sensitive-data).
- Frequency counts are approximate and Copilot rounds toward tidy numbers.
  Do not quote them as data.
