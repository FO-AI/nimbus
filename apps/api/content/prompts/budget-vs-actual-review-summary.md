---
slug: budget-vs-actual-review-summary
kind: prompt
title: Summarize a budget-vs-actual discussion for review
summary: Pull the reasons given for over- and underspend out of your email and
  documents, so the review meeting starts from the explanations, not the numbers.
tags: [finance, budget, reporting, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, budget-variance-narrative, how-to-write-a-prompt]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for Finance
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Finance staff, budget officers
  department: Budget
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    For [DEPARTMENT / chartfield string], gather from my email and documents:
    - Where spend is running against budget, as people have described it
    - Reasons given for each overspend or underspend
    - Any reforecast or reallocation requests
    - Approvals still pending

    Summarize for my review, one short paragraph per theme, naming who said
    what. Reconcile every figure to InfoPorte before I use this anywhere.
  example_input: "A department code plus a mailbox containing the month's budget
    correspondence."
  example_output: A themed summary of the spending story with named sources and
    a list of pending approvals, ready to check against the ledger.
---

## When to use this

Before a budget review, when you know the numbers but not the narrative —
the explanations live in a dozen threads and you need them in one place.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot).
- Swap "one short paragraph per theme" for "a table" if you are pasting this
  into a review deck.
- Once you have the narrative, the
  [budget variance narrative prompt](/prompts/budget-variance-narrative)
  turns it into the paragraph that goes in the close package.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Reasons people give in email are often provisional. Mark anything you have
  not confirmed with the budget owner as unverified before circulating.
- Numbers quoted in email go stale. InfoPorte is the source of truth.
