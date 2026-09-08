---
slug: cash-position-briefing-prep
kind: prompt
title: Gather talking points for a cash and funding briefing
summary: Collect expected large receipts and payments, funding points, and flagged cash
  risks into briefing notes.
tags: [finance, cash, treasury, briefing, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot]
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
  audience: Finance staff
  department: Finance
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    For my cash and funding briefing covering [PERIOD], gather from email and
    reports:
    - Large receipts or payments expected, as they have been discussed
    - Funding, award, or draw-down points anyone has raised
    - Timing concerns mentioned by other units
    - Any cash risks that have been flagged

    Compile as talking points with the source of each. Actual cash positions
    come from the system of record — confirm before reporting anything.
  example_input: A period plus correspondence about expected receipts, payments, and
    funding timing.
  example_output: A short list of talking points, each attributed, separating what is
    expected from what is confirmed.
---

## When to use this

Ahead of a treasury or leadership briefing, when the timing signals are
scattered across correspondence rather than in a report.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- For a unit carrying sponsored funds, add that award draw-down timing
  should be listed separately from operating cash.
- Add "flag anything where the expected date has already slipped once" to
  surface the risky items.

## What to check

- Every figure here came from what someone wrote in an email, not from the
  ledger. Reconcile against ConnectCarolina or InfoPorte before it goes
  anywhere official.
- "Expected" is doing a lot of work in this output. Confirm each item with
  the person who owns it before you present it as a plan.
