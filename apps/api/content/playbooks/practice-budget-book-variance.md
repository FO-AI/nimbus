---
slug: practice-budget-book-variance
kind: playbook
title: 'Practice: pull a unit budget out of the Budget Book and write a variance narrative'
summary: A hands-on exercise using UNC's published Annual Operating Budget Book
  — public Tier 0 data, so you can learn Copilot in Excel and Word on real
  University numbers without risking anything.
tags: [practice, exercise, excel, word, budget, copilot, training]
related_slugs: [copilot-excel-budget-variance, budget-variance-narrative, sensitive-data, learn-ai-at-unc]
featured: true
published: true
source:
  mode: practice
  url: https://budget.unc.edu/wp-content/uploads/sites/1415/2025/10/2025-annual-operating-budget-book.pdf
  title: UNC-Chapel Hill Annual Operating Budget Book, FY2025-26
  publisher: UNC Office of Budget
  retrieved: 2026-09-11
---

## Why practice on this

The fastest way to learn what Copilot is good at is to use it on work you can
already check. The **Annual Operating Budget Book** is published, Tier 0, and
recognizably the kind of material F&O staff work with — so you can make every
mistake here at no cost.

Nothing in this exercise touches University data that is not already public.
That makes it the right thing to run in a team session, and the right thing to
use while [a tool is still going through approval](/guides/getting-a-tool-approved).

## What you'll do

Get a table out of a PDF, into Excel, analyzed, and written up — about 30
minutes end to end.

## Prerequisites

- A Microsoft 365 Copilot license for the Excel and Word steps
  ([Copilot Chat](/guides/copilot-chat) alone covers steps 1 and 2)
- The budget book PDF, downloaded from the link above
  (index: [budget.unc.edu/budget-book](https://budget.unc.edu/budget-book/))

## Part 1 — get the data out

1. **Find a unit's table.** Open the PDF and pick a schedule with revenue and
   expense by source. Note the page number; you will check against it.

2. **Ask Copilot Chat to read it.** Upload the PDF and ask:

   > From the attached budget book, extract the revenue and expense table on
   > page [N] as a markdown table. Do not summarize or round — reproduce the
   > figures exactly as printed.

   "Do not round" is the instruction people leave out, and rounding is the
   most common failure on financial extraction.

3. **Check it against the PDF.** Go line by line for the first table you do
   this with. You are calibrating how much you can trust the extraction, and
   that judgment is the real output of this exercise.

## Part 2 — analyze it

4. **Paste into Excel and make it a table** (select, then **Insert → Table**).
   Copilot in Excel only works with real tables.

5. **Build a comparison.** If your schedule has two years, ask:

   > Add a column for the year-over-year change and a column for that change
   > as a percentage. Sort by the largest absolute change.

6. **Ask for the outliers**, then verify the formulas Copilot wrote by
   clicking the cells. It works through formulas you can inspect, which is
   exactly why Excel is a better place to do arithmetic than a chat window.

## Part 3 — write it up

7. **Draft the narrative** in Word, or use the
   [variance narrative prompt](/prompts/budget-variance-narrative) with your
   figures pasted in.

8. **Check every number in the draft against your table.** Expect at least
   one to be wrong or oddly characterized. Finding it is the point.

## What you should learn from this

- **Extraction is good but not exact.** Multi-column PDF layouts and merged
  header rows are where it slips.
- **Copilot describes movement, not cause.** It will say a line rose 12%; the
  reason is yours to supply, and it will invent a plausible one if you do not.
- **Prose restates numbers loosely.** "Roughly a fifth" for 17.8% is the kind
  of drift to watch for in anything that goes to leadership.

## Running this as a team session

Give everyone the same schedule and compare narratives. The differences —
what people chose to lead with, which numbers they checked — are a better
discussion than any slide about AI capability. Allow an hour.

Then go back to the real thing:
[the Excel variance playbook](/guides/copilot-excel-budget-variance) is the
same workflow on your own data, where the
[tier rules](/guides/sensitive-data) apply.
