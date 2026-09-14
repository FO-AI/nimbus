---
slug: copilot-data-privacy
kind: guidance
title: What Microsoft says about Copilot data, privacy, and security
summary: The vendor statement behind UNC's "not used for training" position —
  what Microsoft commits to for Copilot, and which commitments depend on how
  you signed in.
tags: [copilot, privacy, microsoft, vendor, data-protection]
related_slugs: [ai-data-privacy, copilot-chat, microsoft-365-copilot]
published: true
source:
  mode: link
  url: https://support.microsoft.com/en-us/microsoft-365-copilot/
  title: Microsoft 365 Copilot — Data, Privacy, and Security
  publisher: Microsoft
  retrieved: 2026-09-11
---

## Why Nimbus links a vendor page

UNC's statement that Copilot prompts are not used to train the public models
rests on Microsoft's contractual commitments. When someone in your unit asks
"how do we actually know that?", this is the answer — read it alongside
[ITS on AI, data privacy and you](/guides/ai-data-privacy), which is the
version that applies University context.

## What Microsoft commits to, signed in with your Onyen

- Prompts and responses are **not used to train the foundation models**
- Data stays inside the University's Microsoft 365 tenant boundary
- Existing permissions are enforced — Copilot cannot show a user a file they
  could not already open
- The University's compliance commitments (EU Data Boundary, the relevant
  certifications) extend to Copilot

## What that does not cover

**A personal account.** The commitments are tenant commitments. Signed out or
on a personal Microsoft account, you are using the consumer product under
consumer terms.

**Web-grounded answers.** When Copilot searches the web to answer, that query
leaves the tenant boundary. Microsoft documents this and it can be turned off;
assume the query text is not private.

**Third-party plugins and connectors.** Anything that reaches outside
Microsoft is governed by whoever operates it, not by the Microsoft agreement —
which is why connectors go through
[the approval path](/guides/getting-a-tool-approved).

**The classification.** No vendor commitment moves Tier 3 data into scope.
Tier 1 and 2; never Tier 3 stands regardless of what the contract says.

## A caution about the source

This is a vendor page about the vendor's own product, and it changes as the
product does. It is good evidence for what Microsoft commits to and not a
substitute for the University's own position — where UNC guidance and this
page differ, follow UNC.
