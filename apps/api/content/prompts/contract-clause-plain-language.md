---
slug: contract-clause-plain-language
kind: prompt
title: Explain a contract clause in plain language
summary: Get a readable explanation of what a clause actually requires, so you
  know what you are agreeing to operationally — Tier 1 documents only.
tags: [procurement, contracts, plain-language, vendors, review]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, contract-renewal-watch, getting-a-tool-approved]
published: true
attributes:
  audience: Procurement and contract staff
  department: Procurement
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Explain the clause below in plain language. This is a standard,
    non-confidential contract document.

    For the clause, tell me:
    - What it requires, in one or two sentences a non-lawyer understands
    - Who has to do something, and by when
    - What happens if that obligation is not met
    - What it would mean operationally for a unit that has to comply
    - Any term that is defined elsewhere in the document and that I should
      go and read

    Do not tell me whether the clause is favourable, and do not suggest
    alternative wording. I need to understand it, not negotiate it.

    Clause:
    [PASTE THE CLAUSE HERE]
  example_input: A data retention and return clause from a standard software
    agreement.
  example_output: A short explanation of the obligation, who owes it and when,
    the consequence of breach, the operational impact, and a list of defined
    terms to look up.
---

> **Standard, non-confidential documents only.** Vendor-confidential terms and
> anything under an NDA are Tier 2, which an approved tool can take — but the
> agreement itself may forbid disclosing the text, and an external obligation
> overrides the tier. Check the document before you paste it. See
> [what data can I put into an AI tool](/guides/sensitive-data).

## When to use this

When you have to operate under a contract someone else negotiated and you need
to know what it actually commits your unit to. Standard University terms,
publicly posted state contract language, a vendor's published terms of
service — the documents that are not confidential and are still hard to read.

## How to adapt it

- **Check the obligation, not just the tier.** A standard terms document
  published on a vendor's website is Tier 1 and fine. A signed agreement with
  negotiated pricing is Tier 2 — an approved tool can hold that, but a
  confidentiality clause in the agreement can still forbid it. The contract
  outranks the classification. If you are unsure, that means don't.
- One clause at a time. Pasting a whole agreement produces a summary, which
  is exactly the level of detail that causes the misunderstanding you are
  trying to avoid.
- Add "explain what this means for a department that stores data in the
  system" to make the operational impact concrete.
- Add "list the obligations this puts on UNC, separately from the ones it
  puts on the vendor" — the two get conflated in a single reading.
- **This is not legal advice and the prompt says so.** The instruction not to
  evaluate or redraft is deliberate: interpretation for a University contract
  comes from Procurement Services and University Counsel, and a confident AI
  reading is a good way to talk yourself out of asking them.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **The defined terms.** A clause usually turns on a term defined in a
  different section, and an explanation that guesses at that definition can
  invert the meaning. Go and read them.
- Whether an obligation was dropped. Long clauses carry several; summaries
  keep the first.
- Anything it states as a consequence. Remedies and termination rights are
  where a plausible-sounding reading is most likely to be wrong.
- **Take anything that matters to Procurement Services.** Use this to arrive
  at the conversation informed, not to replace it. An AI feature in a vendor
  system also needs [the approval path](/guides/getting-a-tool-approved).
