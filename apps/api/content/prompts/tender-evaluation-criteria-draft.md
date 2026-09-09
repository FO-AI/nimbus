---
slug: tender-evaluation-criteria-draft
kind: prompt
title: Draft evaluation criteria for a solicitation
summary: Produce a grouped, neutral set of evaluation criteria with a description of
  what good looks like, leaving weights and scores to the panel.
tags: [procurement, rfp, evaluation, fairness, copilot]
related_slugs: [sensitive-data, copilot-chat, rfp-requirements-draft, how-to-write-a-prompt]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for Procurement & Vendor Management
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: Procurement staff
  department: Procurement
  tool: Microsoft 365 Copilot (licensed)
  tool_slug: microsoft-365-copilot
  prompt: |
    Draft evaluation criteria for [SOLICITATION] from the requirements below:
    - Group the criteria into technical, commercial, delivery, risk, and
      sustainability
    - For each, write a neutral description of what a strong response looks like

    Do NOT assign weights, scores, or pass marks — the evaluation panel sets
    those. This is a fairness-and-completeness draft for review.

    Requirements:
    [PASTE HERE]
  example_input: The requirements draft you have already written for the solicitation.
  example_output: Criteria grouped under five headings, each with a plain description of
    a strong response and no scoring attached.
---

## When to use this

After the requirements are settled and before the panel convenes, to check
the criteria cover everything and read neutrally.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat) too, since you paste the
  source material in.
- Add "flag any criterion that could favour an incumbent" — that is the bias
  this draft is most useful for catching.
- Drop the sustainability group if it is not part of your evaluation, rather
  than leaving it empty.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment.
- Neutral phrasing is the point. Read each description asking whether a new
  vendor could meet it, or only your current one.
- Weights and thresholds stay with the panel and go in the solicitation
  document, not here.
