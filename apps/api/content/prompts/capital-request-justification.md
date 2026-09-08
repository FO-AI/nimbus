---
slug: capital-request-justification
kind: prompt
title: Draft the justification for a capital or equipment request
summary: Turn need, options, costs, and risks into a justification narrative for a
  capital or major equipment request.
tags: [finance, budget, capital, business-case, writing, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, sop-first-draft]
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
  audience: Finance staff, unit managers
  department: Budget
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    Draft the justification for the [CAPITAL / equipment] request below:
    - The need, and the options considered
    - Costs and benefits as stated, with the source of each
    - Risks and the assumptions the case rests on
    - Payback or return, exactly as provided — do not calculate your own

    Mark every figure [to validate]. This is a draft narrative. The numbers and
    the decision are not yours to make.

    Inputs:
    [PASTE HERE]
  example_input: A short description of the need, two or three options with costs, and
    any figures already worked out.
  example_output: A structured justification narrative with all figures bracketed for
    validation before submission.
---

## When to use this

Writing up a capital request where you have done the analysis and need it to
read like a case rather than a list.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat) as well, since you paste the
  inputs in.
- Match the section headings to whatever your capital request form actually
  asks for.
- Add "state plainly what happens if we do nothing" — reviewers ask this and
  it is usually missing.

## What to check

- The instruction not to calculate is important and imperfectly followed.
  Check that no number appears that you did not supply.
- A justification that reads well is not a justification that is sound. The
  options analysis is the part a reviewer will test.
