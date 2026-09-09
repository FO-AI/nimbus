---
slug: policy-faq-draft
kind: prompt
title: Draft a plain-language FAQ from a policy
summary: Turn a policy document into the questions staff actually ask, answered in clear
  non-legalistic language, for HR to review.
tags: [hr-operations, policy, writing, copilot]
related_slugs: [sensitive-data, copilot-chat, policy-plain-language-summary, how-to-write-a-prompt]
source:
  mode: import
  url: https://github.com/kesslernity/awesome-microsoft-copilot-prompts
  title: awesome-microsoft-copilot-prompts — Copilot for HR & People
  publisher: Mathieu Kessler
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
attributes:
  audience: HR operations staff
  department: HR operations
  tool: Microsoft 365 Copilot Chat
  tool_slug: copilot-chat
  prompt: |
    From the policy below, draft a plain-language FAQ for staff. Cover the
    questions people actually ask, not the structure of the policy. Clear,
    non-legalistic language, short answers.

    Mark it "DRAFT — for review for accuracy." Do not interpret edge cases —
    where a situation is genuinely ambiguous, say so and point the reader to
    the office that owns the policy.

    Policy:
    [PASTE HERE]
  example_input: The text of a University or unit policy, pasted in full.
  example_output: Eight to twelve questions with short answers, and ambiguous cases
    routed to a named office rather than answered.
---

## When to use this

When a policy exists, is correct, and nobody reads it — and the questions
arrive at your desk instead.

## How to adapt it

- Works in [Copilot Chat](/guides/copilot-chat), since you paste the source
  material in.
- Name the office that owns the policy so the routing instruction has
  somewhere to point.
- Add "list the three questions this policy does not answer" — those gaps
  are worth raising with the policy owner.
- New to prompting, or not getting what you need?
  [How to write a prompt](/guides/how-to-write-a-prompt) covers the CLEAR
  framework and the Microsoft Prompt Gallery.

## What to check

- An FAQ is read as authoritative even when marked draft. It must be
  reviewed by whoever owns the policy before publication.
- Copilot resolves ambiguity by inventing a reasonable-sounding answer. The
  instruction not to interpret edge cases is the one to verify it followed.
- Check nothing in the FAQ contradicts the policy text. A plain-language
  paraphrase can quietly change a rule.
