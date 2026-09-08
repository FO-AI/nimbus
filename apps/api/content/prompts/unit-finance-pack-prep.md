---
slug: unit-finance-pack-prep
kind: prompt
title: Structure a finance pack for a unit or leadership review
summary: Gather results, cash points, risks, and pending decisions from existing reports
  into draft sections for a leadership finance pack.
tags: [finance, reporting, leadership, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, leadership-review-pre-read]
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
  department: Finance
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    For the [MEETING / period] finance pack, pull together from my existing
    reports and email:
    - A results summary and the KPIs we track, each with its source document
    - Cash and funding points that have been discussed
    - Risks, commitments, or funding items anyone has raised
    - Decisions or approvals being sought at this meeting

    Structure these as draft sections for my review. Confirm all figures
    against the system of record before they go in the pack.
  example_input: A meeting name plus the folder holding the period's reports and
    correspondence.
  example_output: Four draft sections with sourced figures and an explicit list of the
    decisions the meeting needs to make.
---

## When to use this

Assembling a recurring finance pack where the same four sections appear
every time and the work is collection, not analysis.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Replace the four bullets with your unit's actual pack structure — the
  value is in matching the shape people already expect.
- Add "flag any section where I have no source material" so gaps surface
  early rather than at the meeting.

## What to check

- Every figure here came from what someone wrote in an email, not from the
  ledger. Reconcile against ConnectCarolina or InfoPorte before it goes
  anywhere official.
- Pending decisions are the section most often wrong: Copilot picks up
  things that were discussed but never escalated. Confirm each one is
  genuinely for this meeting.
