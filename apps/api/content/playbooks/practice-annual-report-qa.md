---
slug: practice-annual-report-qa
kind: playbook
title: 'Practice: question a financial statement with Copilot and make it cite pages'
summary: An exercise using UNC's published Annual Comprehensive Financial
  Report — public Tier 0 data — to learn how to ground an AI answer in a
  document and verify every claim it makes.
tags: [practice, exercise, copilot, financial-reporting, verification, training]
related_slugs: [copilot-chat, sensitive-data, learn-ai-at-unc, how-to-write-a-prompt]
published: true
source:
  mode: practice
  url: https://finance.unc.edu/services/comprehensive-annual-financial-report/annual-report-2025/
  title: UNC-Chapel Hill Annual Comprehensive Financial Report, 2025
  publisher: UNC Finance and Operations
  retrieved: 2026-09-11
---

## Why practice on this

Reading a financial statement you did not prepare is a genuinely hard task,
and it is the one where an AI summary is most tempting and most dangerous.
The **Annual Comprehensive Financial Report** is published and Tier 0, so this
is a safe place to find out how a grounded answer behaves — and how it fails.

The skill being practised is not summarizing. It is **verification**: making
the tool tell you where it got something, and checking.

## What you'll do

Ask a financial document questions, require page citations, and audit the
answers — about 30 minutes.

## Prerequisites

- [Copilot Chat](/guides/copilot-chat) signed in with your Onyen (free —
  no license needed)
- The ACFR open in another window, so you can check citations as you go

## Steps

1. **Attach the report** and start with something you can verify in a minute:

   > From the attached report, what were total operating revenues for the
   > year, and on what page does that figure appear?

   Go to that page. Either the number is there or it is not. That single
   check tells you more about the tool than any amount of reading about it.

2. **Always require the page.** Make it part of every question:

   > Answer only from the attached document. After each statement, give the
   > page number it comes from. If the document does not say, say so.

   The last sentence is what gives the model permission not to answer, which
   is the behaviour you want.

3. **Ask a question the document explains**, such as the drivers behind a
   change in net position, and check that the explanation is the report's
   rather than a plausible one supplied from general knowledge.

4. **Now ask something the report does not contain** — a figure for next
   year, a comparison to a peer institution. A well-grounded answer says it
   is not in the document. Note what yours does, because that is the failure
   mode you will meet on real work.

5. **Ask for a summary of one section** — the management discussion, say —
   and check it against the section. Look specifically for hedged language
   that became definite.

6. **Try the same question phrased three ways.** The variation in the answers
   is your measure of how much weight a single answer can carry.

## What you should learn from this

- **"Answer only from this document" changes the behaviour**, and is worth
  putting in every prompt where a source matters.
- **Citations are checkable and worth checking.** A page number that is
  slightly off usually means the model blended nearby text; one that is badly
  off means it is not reading, it is recalling.
- **Absence is the hard case.** Confident answers to questions the document
  cannot support are how AI-assisted analysis goes wrong quietly.
- **Financial nuance flattens.** Restricted and unrestricted, recurring and
  one-time — distinctions that matter get smoothed away in a summary.

## Carrying it into real work

On your own material the tier rules apply: Tier 1 and 2 in an approved tool,
never Tier 3 — [what data can I put into an AI tool](/guides/sensitive-data).
The verification habit carries over unchanged, and it is the part worth
keeping. [How to write a prompt](/guides/how-to-write-a-prompt) covers the
CLEAR framework behind the phrasing used here.
