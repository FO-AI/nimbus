---
slug: forecast-input-gathering
kind: prompt
title: Collect reforecast inputs from across your unit
summary: Sweep correspondence for the revenue signals, cost changes, and timing shifts
  other teams have already shared, and note what is still missing.
tags: [finance, forecast, budget, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, forecast-assumptions-log, how-to-write-a-prompt]
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
    For the [PERIOD] reforecast in [DEPARTMENT], search my email and Teams for
    inputs people have already shared:
    - Revenue or funding signals
    - Cost or position changes from departments
    - Project and timing changes
    - Risks and opportunities anyone has raised

    Summarize by area, naming the source for each. Then list what is still
    outstanding, by area and owner, so I know who to chase.
  example_input: A reforecast period and a mailbox holding several weeks of input from
    department contacts.
  example_output: An area-by-area summary of what has been received, followed by a chase
    list naming who still owes you what.
---

## When to use this

A week into a reforecast cycle, when responses are trickling in and you have
lost track of who has answered.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- The chase list is the point — keep that instruction even if you trim the
  rest.
- Add your unit's actual area names so the grouping matches how you report.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- It will treat a casual mention as an input. Confirm anything that will
  move a number.
- Every figure here came from what someone wrote in an email, not from the
  ledger. Reconcile against ConnectCarolina or InfoPorte before it goes
  anywhere official.
