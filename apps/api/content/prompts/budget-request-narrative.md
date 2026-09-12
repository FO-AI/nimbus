---
slug: budget-request-narrative
kind: prompt
title: Draft a budget request narrative
summary: Turn what your unit needs and why into the written case that goes with
  the numbers — the part of the budget submission that actually gets read.
tags: [budget, finance, writing, planning, justification]
related_slugs: [sensitive-data, copilot-chat, how-to-write-a-prompt, forecast-assumptions-log, capital-request-justification]
published: true
attributes:
  audience: Budget and finance staff
  department: Budget
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    Draft the narrative for a budget request from [UNIT] for [FISCAL YEAR].

    What we are asking for:
    [THE REQUEST — amount, recurring or one-time, and what it funds]

    Why:
    [THE DRIVER — what has changed, what it costs to do nothing]

    What we have already done:
    [REALLOCATIONS, EFFICIENCIES, OR OTHER FUNDING SOUGHT]

    Write four short paragraphs:
    1. The request, stated plainly in the first sentence
    2. What is driving it, tied to something measurable where I have given
       you a figure
    3. What we have already done to absorb it internally
    4. What happens if it is not funded, stated factually rather than as a
       warning

    Under 400 words, for a budget officer who reads many of these. No
    adjectives doing work that a number should do. Do not invent figures,
    benchmarks, or comparisons I have not supplied.
  example_input: A request for two recurring positions, driven by a 40% rise in
    transaction volume over three years, after absorbing the first two years
    through overtime.
  example_output: Four paragraphs leading with the ask, tying it to the volume
    figure, showing what was absorbed internally, and stating the consequence
    of no funding.
---

## When to use this

Budget submission season, or any time you are asking for money in writing —
a recurring increase, a one-time request, a carryforward justification.

For equipment and capital specifically, the
[capital request justification](/prompts/capital-request-justification) is
closer. For the assumptions behind a forecast, see the
[forecast assumptions log](/prompts/forecast-assumptions-log).

## How to adapt it

- **Paragraph 3 is the one that wins requests.** A reviewer wants to know
  what you tried before asking. If you leave that input blank, the request
  reads as though nothing was attempted.
- Give it at least one real number for the driver. "Volume has grown" is
  weaker than "40% over three years", and the model cannot supply the figure.
- Add "reference the unit's strategic priorities" and paste them if your
  submission is expected to connect.
- Add "write a 100-word version as well" — most submission forms have a
  summary field, and a separate draft beats truncating this one.
- **Never let it generate a benchmark.** "Peer institutions typically fund
  this at…" is the kind of sentence the model will produce on request and
  cannot support. The instruction against it is in the prompt.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- **Every figure and every comparison**, against your source. This is the
  prompt where an invented statistic does the most damage.
- That paragraph 4 reads as consequence, not threat. The distinction matters
  to how the request is received.
- That the ask is unambiguous — the amount, and whether it is recurring.
  Reviewers skim; if paragraph 1 is vague the rest is wasted.
- **Tier check:** a request driven by staffing describes positions and
  workload, not individuals. See
  [what data can I put into an AI tool](/guides/sensitive-data).
