---
slug: journal-entry-justification
kind: prompt
title: Write the justification for a journal entry
summary: Turn what you know about a correction into the written justification
  that survives review and still makes sense to an auditor two years later.
tags: [finance, journal-entry, documentation, audit, connectcarolina]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, audit-request-response-prep]
published: true
attributes:
  audience: Finance staff
  department: Finance
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    I need to write the justification for a journal entry in ConnectCarolina.
    Here is what happened:

    [WHAT WENT WRONG OR WHY THE ENTRY IS NEEDED]

    The entry moves [AMOUNT] from [SOURCE CHARTFIELD] to [DESTINATION
    CHARTFIELD], for [PERIOD].

    Write a justification of three or four sentences that states:
    - what the entry corrects or records, in plain terms
    - why the original posting was as it was
    - why the destination is the correct one
    - what period it belongs to and why it is being done now

    Write it for someone who was not involved and is reading it in two years.
    Do not speculate about anything I have not told you, and do not assign
    blame to a person.
  example_input: A supply order coded to the wrong fund because the requisition
    predated a fund change, discovered during the Q3 review.
  example_output: A short paragraph naming the correction, the reason for the
    original coding, the basis for the new coding, and the period.
---

## When to use this

Any entry where "correction" on its own will not answer the question later:
reclassifications between funds, entries that cross a period, anything found
in a reconciliation, anything you expect an auditor to pull.

Good justification text is a small thing that turns into a large thing during
an audit — [preparing an audit response](/prompts/audit-request-response-prep)
is much easier when the entries explain themselves.

## How to adapt it

- **Give it real facts.** The prompt is only as good as what you paste in.
  If the reason is "the requisition predated the fund change", say that —
  the model cannot infer it and will otherwise write something generic.
- **Add your unit's required elements** if your approver expects a specific
  format — a reference number, an approval, a policy citation.
- Add "reference the original voucher and date" when the entry relates to a
  specific transaction.
- **Keep names out.** Justifications describe what happened to a transaction,
  not who made a mistake.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **Every chartfield and amount**, against the entry itself. Copilot will
  restate them and can transpose digits.
- That it did not invent a reason. If your input was thin, the output will
  fill the gap with something plausible — that is the failure mode to watch
  for here, and it ends up in the permanent record.
- That the period logic is right, particularly for anything crossing a
  fiscal year.
- **Tier check:** entries relating to an individual's pay may carry Tier 2
  detail — describe the transaction, not the person. See
  [what data can I put into an AI tool](/guides/sensitive-data).
