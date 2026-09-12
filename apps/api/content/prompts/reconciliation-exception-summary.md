---
slug: reconciliation-exception-summary
kind: prompt
title: Summarize reconciliation exceptions for review
summary: Turn a list of unreconciled items into a short review note that
  separates what is timing, what needs an entry, and what nobody can explain
  yet.
tags: [finance, reconciliation, close, exceptions, review]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, close-prep-checklist]
published: true
attributes:
  audience: Finance staff
  department: Finance
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Below are the open items from my [ACCOUNT / FUND] reconciliation for
    [PERIOD]. Each line has a description, an amount, an age in days, and a
    note where I have one.

    Sort them into three groups:
    1. Timing — will clear on its own, and roughly when
    2. Needs action — an entry, a correction, or someone to be chased, with
       what the action is
    3. Unexplained — not enough information to place it

    Within each group put the largest amounts first. Then write two sentences
    for my supervisor covering the total value outstanding, the oldest item,
    and anything in group 3.

    Do not guess which group an item belongs in. If my note does not support
    a classification, put it in group 3.

    Items:
    [PASTE YOUR OPEN ITEMS HERE]
  example_input: Fifteen open items with descriptions, amounts, ages, and short
    notes on about half of them.
  example_output: Three grouped lists ordered by value, then a two-sentence
    summary naming the total outstanding, the oldest item, and the unexplained
    ones.
---

## When to use this

At close, when the reconciliation is done and the open items need to be
explained rather than just listed. Also useful mid-month, when you want to
know which of the open items actually need chasing before period end.

Pairs with the [close prep checklist](/prompts/close-prep-checklist).

## How to adapt it

- **The notes column is what makes this work.** With no notes, almost
  everything lands in group 3 — which is itself a useful finding about your
  reconciliation, but not the output you wanted.
- Adjust the groups to your process. Some units want "with the vendor" and
  "with the department" as separate buckets.
- Add "flag anything over [N] days as overdue" if your unit has an aging
  threshold.
- Add "suggest the wording for a chaser email" for group 2 if you are about
  to write them anyway.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **The group-3 count is the number that matters.** If the model has quietly
  placed thin items into groups 1 and 2, the summary looks better than the
  reconciliation is. Re-read anything classified without a supporting note.
- Totals, against your reconciliation. Do not report a total the model
  computed.
- Timing claims. "Will clear next month" is a prediction, and the model has
  no basis for it beyond your note.
- **Tier check:** payroll or benefits items may carry Tier 2 detail. Strip
  identifiers before pasting — see
  [what data can I put into an AI tool](/guides/sensitive-data).
