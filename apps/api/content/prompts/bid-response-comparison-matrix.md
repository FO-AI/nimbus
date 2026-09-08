---
slug: bid-response-comparison-matrix
kind: prompt
title: Organize vendor responses into a comparison matrix
summary: Lay bid responses side by side against your requirements, with gaps and
  clarification questions, to prepare the panel's review.
tags: [procurement, rfp, evaluation, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, tender-evaluation-criteria-draft, how-to-write-a-prompt]
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
    Organize the vendor responses I reference into a comparison matrix against
    our requirements:
    - One row per requirement, one column per vendor
    - What each vendor offered, quoting or citing their own response
    - Gaps and non-responses, marked clearly
    - Clarification questions to put to each vendor

    This prepares the panel's evaluation. Do NOT score, rank, or recommend a
    winner.
  example_input: Several vendor response documents in a folder the licensed Copilot can
    reach, plus your requirements list.
  example_output: A requirement-by-vendor matrix with quoted offers, explicit gaps, and
    a clarification question list per vendor.
---

## When to use this

Once responses are in and someone has to read four proposals against thirty
requirements without losing track.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Ask for the matrix in Excel if the panel will work in it — Copilot in
  Excel handles the layout better than a pasted table.
- Add "quote the vendor's exact wording, do not paraphrase" if the
  differences are contractual rather than functional.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment. Read
  the matrix as a reading aid, not a shortlist.
- Verify every quoted offer against the actual response document. A
  paraphrase that shifts a commitment is the failure mode that matters here.
- Vendor-confidential material and bid responses are Tier 2. Keep this in an
  approved tool and never paste anything covered by an NDA into a consumer
  chatbot. See
  [what data can I put into an AI tool](/guides/sensitive-data).
