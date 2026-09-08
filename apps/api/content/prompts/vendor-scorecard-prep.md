---
slug: vendor-scorecard-prep
kind: prompt
title: Compile evidence for a vendor performance scorecard
summary: Gather delivery, quality, responsiveness, and commercial signals into a
  scorecard structure — evidence only, ratings left to you.
tags: [procurement, vendor, performance, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, vendor-business-review-prep]
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
  prompt: |
    For [VENDOR], gather from my email, documents, and notes the performance
    signals over [PERIOD]:
    - Delivery and on-time issues that were raised
    - Quality problems or rework
    - Responsiveness and relationship notes
    - Commercial and value points

    Organize into a scorecard structure — criterion plus the evidence behind it,
    with dates. Do NOT assign the ratings. That is my decision, informed by
    system data you cannot see.
  example_input: A vendor name and a review period, with the correspondence from that
    period available.
  example_output: A scorecard skeleton where each criterion carries dated evidence and
    the rating column is empty.
---

## When to use this

Before a vendor review, when your impression of performance is real but the
evidence for it is scattered across a year of email.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Ask for dates on every piece of evidence — a scorecard without dates
  cannot be defended if the vendor disputes it.
- Add "note where the evidence is thin" so you do not rate a criterion you
  cannot actually support.

## What to check

- The empty rating column is deliberate. A rating Copilot suggests will
  anchor you, and it cannot see delivery data in ConnectCarolina.
- Correspondence over-represents problems — people email when something goes
  wrong. Weight accordingly.
- Copilot prepares the pack; Procurement Services evaluates, decides, and
  awards. Nothing it produces is a selection, a score, or a commitment.
