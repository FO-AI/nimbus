---
slug: forecast-assumptions-log
kind: prompt
title: Build an assumptions log for a forecast or budget
summary: Extract the assumptions behind a forecast from discussion, with owner and
  status, so the reasoning is on the record.
tags: [finance, budget, forecast, assumptions, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, forecast-input-gathering]
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
  prompt: |
    For the [FORECAST / budget cycle], extract from my email and meeting notes
    every assumption that has been discussed. Give me a table with:
    - The assumption, in one sentence
    - Who raised it or owns it
    - Status — agreed, open, or disputed
    - Any sensitivity that was mentioned

    Do not invent assumptions. Where an assumption is implied but never stated
    explicitly, list it separately under "implied, needs confirming".
  example_input: A budget cycle name plus the mail threads and meeting notes from
    planning.
  example_output: A four-column table of stated assumptions plus a short list of implied
    ones that nobody has actually confirmed.
---

## When to use this

During budget build or reforecast, when decisions are being made on
assumptions that have never been written down in one place.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- The "implied, needs confirming" section is the useful half — keep it even
  if you drop other columns.
- Re-run it at the end of the cycle and diff the two logs to see which
  assumptions quietly changed.

## What to check

- "Agreed" in an email thread is not the same as agreed by the budget
  officer. Verify status with the owner, not the transcript.
- An assumptions log is only worth building if it gets revisited. Attach it
  to the forecast file, not your desktop.
