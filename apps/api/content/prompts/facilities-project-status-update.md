---
slug: facilities-project-status-update
kind: prompt
title: Write a facilities project status update
summary: The recurring update on a renovation, move, or capital project —
  schedule, budget, and the things that need a decision, in a form people
  actually read.
tags: [facilities, projects, status, reporting, capital]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, work-order-trend-summary, project-risk-register]
published: true
attributes:
  audience: Facilities and project staff
  department: Facilities
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Write a status update for [PROJECT], covering [PERIOD], for [AUDIENCE].

    Schedule: [ON TRACK / SLIPPED, with the current milestone and date]
    Budget: [SPENT TO DATE AGAINST BUDGET, and any change orders]
    Since the last update: [WHAT WAS COMPLETED]
    Coming up: [NEXT MILESTONES AND DATES]
    Issues: [WHAT IS BLOCKED OR AT RISK, and what it affects]
    Decisions needed: [WHAT I NEED FROM THIS AUDIENCE, and by when]

    Structure it as a short paragraph on overall status, then headed sections
    for schedule, budget, progress, what is coming, and issues. Put decisions
    needed at the end under their own heading with dates.

    Under 400 words. State a slip as a slip with its new date — do not
    describe it as a revised timeline. Do not add commentary that is not in
    what I gave you.
  example_input: Month four of an office renovation, two weeks behind on
    long-lead electrical parts, 60% spent against budget, needing a decision
    on flooring by the 15th.
  example_output: A status paragraph, five headed sections, and a closing
    decisions-needed list with owners and dates.
---

## When to use this

The monthly or fortnightly update on any project with a schedule and a budget
— a renovation, a building move, a capital project, a system rollout with a
physical component.

For the risks behind it, see the
[project risk register](/prompts/project-risk-register).

## How to adapt it

- **Keep the same headings every period.** Readers learn where to look, and a
  section that suddenly goes missing is itself a signal. Reuse this prompt
  rather than rewriting it each time.
- Add "compare against last month's update, pasted below" and include it —
  the delta is what a repeat reader wants, and it catches a milestone that
  quietly moved twice.
- Add "write a two-sentence version for the leadership digest" if your update
  is aggregated upward.
- **The euphemism instruction earns its place.** "Revised timeline" and
  "budget refinement" are how a project gets three months behind without
  anyone being told, and a drafting tool reaches for that register
  automatically.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **Dates and figures**, against the project record. Spend to date and
  milestone dates are what people quote back to you.
- That a slip is stated plainly, with the new date, in the schedule section
  rather than only implied in the issues section.
- That the decisions-needed list is complete and has real deadlines — this is
  the only section most senior readers act on.
- **Tier check:** contractor pricing may be vendor-confidential and therefore
  Tier 2. Describe the budget position rather than pasting bid detail — see
  [what data can I put into an AI tool](/guides/sensitive-data).
