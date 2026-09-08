---
slug: receivables-follow-up-context
kind: prompt
title: Compile the history behind an overdue account
summary: Pull the invoices, promises to pay, disputes, and last contact for an overdue
  account into one summary before you follow up.
tags: [finance, receivables, collections, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, vendor-email-draft]
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
    For [PAYER / account], search my email for the history on this balance:
    - Invoices and amounts referenced, with dates
    - Any promises to pay and the dates given
    - Disputes or queries raised, and whether they were resolved
    - Last contact and what came of it

    Summarize chronologically so I can prepare a follow-up. Confirm the actual
    balance in ConnectCarolina — do not rely on amounts quoted in email.
  example_input: An account or payer name and a mailbox containing the correspondence.
  example_output: A dated chronology of the account showing what was promised, what was
    disputed, and where it was left.
---

## When to use this

Before you chase an overdue balance and want to avoid asking a question that
was already answered three months ago.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add "draft a follow-up email in a neutral, non-accusatory tone" as a
  second step once the history is clear.
- For a sponsor or subrecipient, add that the relevant award terms should be
  noted alongside the balance.

## What to check

- Every figure here came from what someone wrote in an email, not from the
  ledger. Reconcile against ConnectCarolina or InfoPorte before it goes
  anywhere official.
- Do not paste payer bank details, card numbers, or anything else Tier 3
  into the prompt. See
  [what data can I put into an AI tool](/guides/sensitive-data).
