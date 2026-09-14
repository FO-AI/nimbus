---
slug: work-order-trend-summary
kind: prompt
title: Find the trends in a quarter of work orders
summary: Turn a work-order export into the handful of findings worth acting on
  — what keeps recurring, where it costs most, and what a repair pattern is
  telling you.
tags: [facilities, maintenance, work-orders, analysis, reporting]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, facilities-issue-status-report, facilities-project-status-update]
published: true
attributes:
  audience: Facilities and operations staff
  department: Facilities
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Below is a work-order export for [BUILDING OR PORTFOLIO], covering
    [PERIOD]. Columns are [LIST YOUR COLUMNS — e.g. date, location, category,
    description, status, days open, cost].

    Analyze it and give me:
    - The five most frequent problem categories, with counts
    - Any location with repeat orders for the same problem, listed separately
      — these matter more than the frequency ranking
    - Where the cost is concentrated, by category and by location
    - Orders open longest, and whether they share anything
    - Anything in the data that suggests a deferred-maintenance issue rather
      than a run of unrelated faults

    Base every statement on the data. Where the description field is too vague
    to categorize, count those separately rather than assigning them a
    category.

    Data:
    [PASTE YOUR EXPORT HERE]
  example_input: A quarter of work orders with date, building, room, category,
    free-text description, status, days open, and cost.
  example_output: Ranked categories with counts, a separate list of repeat
    locations, cost concentration, an aging list, and a note on which patterns
    look systemic.
---

## When to use this

Quarterly reporting, budget season when you need evidence for a maintenance
request, or when you suspect a building is consuming more attention than it
should and want to check before saying so.

For a report built from correspondence rather than a system export, use
[turn facilities correspondence into a status report](/prompts/facilities-issue-status-report).

## How to adapt it

- **Repeat-location analysis is the point.** Frequency alone tells you that
  lightbulbs fail; the same valve failing four times in one quarter is what
  justifies capital spend. The prompt asks for those separately for that
  reason.
- Name your columns in the prompt. Work-order exports vary enough that the
  model will otherwise misread one — particularly a numeric column that is
  actually a code.
- Add "group by floor as well as room" for large buildings.
- Add "exclude preventive maintenance orders" if your export mixes scheduled
  work with reactive, otherwise PM volume will dominate every count.
- For a large export, use Copilot in Excel on a table instead — you get
  inspectable formulas rather than restated numbers. See the
  [Excel variance playbook](/guides/copilot-excel-budget-variance) for the
  pattern.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **Counts and totals**, against the source. A pasted table is summarized,
  not calculated — treat every number as a claim to verify.
- Whether "repeat" means the same problem or similar wording. This is the
  finding you will spend money on, so confirm each one against the actual
  orders.
- That vague descriptions were counted separately rather than sorted into a
  category. If the model categorized everything, the categories are partly
  invented.
- **Tier check:** work orders relating to an individual's office or a
  reported incident can carry Tier 2 detail. Strip names before pasting —
  see [what data can I put into an AI tool](/guides/sensitive-data).
