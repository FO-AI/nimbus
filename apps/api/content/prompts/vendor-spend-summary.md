---
slug: vendor-spend-summary
kind: prompt
title: Compile vendor spend and contract context before a review
summary: Gather spend, contract dates, issues, and change discussions for a vendor ahead
  of a review or renewal conversation.
tags: [finance, vendor, procurement, contracts, copilot]
related_slugs: [sensitive-data, microsoft-365-copilot, contract-renewal-watch]
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
  audience: Finance staff, procurement staff
  department: Procurement
  tool: Microsoft 365 Copilot (licensed)
  prompt: |
    For [VENDOR], gather from my email and documents:
    - Spend and invoices referenced, with dates
    - Contract value and any renewal or expiry dates mentioned
    - Issues, disputes, or service problems raised
    - Any savings or scope-change discussions

    Summarize for a vendor review. Confirm actual spend against the ledger —
    amounts quoted in email are not reliable.
  example_input: A vendor name and a mailbox spanning the current contract term.
  example_output: A vendor briefing covering spend, key dates, open issues, and any
    changes under discussion.
---

## When to use this

Before a vendor review or renewal, when the relationship history is spread
across contract files and mail threads.

## How to adapt it

- Needs the [licensed Copilot](/guides/microsoft-365-copilot) — the free
  chat tier cannot read your mailbox, Teams, or files.
- Add "list anything that would need to change in a renewal" to turn the
  summary into a negotiating position.
- Contract documents are often Tier 2 — keep this in an approved tool and do
  not paste NDA-covered terms into anything else.

## What to check

- Every figure here came from what someone wrote in an email, not from the
  ledger. Reconcile against ConnectCarolina or InfoPorte before it goes
  anywhere official.
- Renewal dates picked out of email are frequently wrong. Confirm against
  the signed contract before you plan around them.
