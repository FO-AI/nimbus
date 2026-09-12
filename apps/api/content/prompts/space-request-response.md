---
slug: space-request-response
kind: prompt
title: Draft a response to a space request
summary: Write back to a unit asking for space — including the answer they did
  not want — in a way that explains the basis and keeps the relationship
  intact.
tags: [facilities, space, communication, writing, real-estate]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, vendor-communication-draft]
published: true
attributes:
  audience: Facilities and real estate staff
  department: Facilities
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Draft a reply to a space request.

    What they asked for:
    [THE REQUEST — unit, what they want, and the reason they gave]

    The decision:
    [APPROVED / DECLINED / PARTIAL / DEFERRED, and the substantive reason]

    Relevant constraints or process:
    [WHAT GOVERNS THIS — allocation criteria, a committee, a pending study,
    the current utilization picture]

    Write a reply of under 250 words that:
    - Gives the answer in the first two sentences
    - Explains the basis in terms of the criteria or process, not preference
    - Says what happens next, or what they can do, if anything
    - Names the route to escalate or reapply where one exists

    Professional and warm, but do not pad a decline with encouragement that
    implies it might change. Do not apologize for applying a process
    correctly.
  example_input: A unit asking for two additional offices for new hires,
    declined because the current allocation is above the utilization threshold
    and a space study is underway.
  example_output: A short reply giving the decision up front, the utilization
    basis, the timing of the study, and how to bring it back afterwards.
---

## When to use this

Any space request that needs a written answer — and especially the ones you
are declining, which are the hardest to write and the most likely to be put
off.

## How to adapt it

- **Put the real reason in the input.** A reply that explains the basis is
  what stops a follow-up email; a reply that says "we are unable to
  accommodate this at present" guarantees one.
- Name the criteria explicitly. "Above the utilization threshold for your
  headcount" is a fact someone can act on; "space constraints" is not.
- Add "offer the two alternatives below" and list them when there is
  something to offer — shared space, a later date, a different building.
- Add "keep the tone suitable for a department chair" or similar if the
  recipient's seniority changes the register.
- **Watch the false hope.** The instruction against implying a decline might
  change is there because it is the most common problem with AI-drafted
  declines, and it is the thing that causes the request to come back three
  times.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **That it does not commit you to anything you did not decide.** Drafts
  reach for a helpful closing sentence and can promise a review, a timeline,
  or a reconsideration you did not authorize.
- That the process is described accurately. An invented escalation route is
  worse than none.
- Any figure — square footage, utilization, headcount — against your records.
- **Tier check:** the reason for a request may involve personnel or
  accommodation detail. Keep it out of the draft; describe the space
  decision. See [what data can I put into an AI tool](/guides/sensitive-data).
