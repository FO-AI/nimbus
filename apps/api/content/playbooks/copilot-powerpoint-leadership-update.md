---
slug: copilot-powerpoint-leadership-update
kind: playbook
title: Build a leadership update deck from a Word report with Copilot in PowerPoint
summary: Turn a written unit review or close narrative into a slide deck for a
  leadership meeting, without retyping it — and without letting the summary
  drift from the numbers.
tags: [powerpoint, copilot, leadership, reporting, slides]
related_slugs: [microsoft-365-copilot, sensitive-data, copilot-word-report-first-draft, leadership-review-pre-read]
published: true
---

> **Before you start:** if your source document contains personnel detail or
> anything above Tier 2, deal with that before Copilot reads it — see
> [what data can I put into an AI tool](/guides/sensitive-data).

## What you'll do

Take a report you have already written — a quarterly unit review, a close
narrative, a project update — and get a first-draft deck out of it in a few
minutes, so your time goes into the story rather than the formatting.

This works best when the document already exists. Copilot builds a good deck
from a good document and a vague deck from a vague prompt.

## Prerequisites

- A Microsoft 365 Copilot license
- The source document **saved to OneDrive or SharePoint** — Copilot in
  PowerPoint references stored files, not a local copy or a paste
- A document with real headings. Copilot uses heading structure to decide
  what a slide is; a wall of unstructured text produces a wall of bullets.

## Steps

1. **Prepare the source document.** Make sure your Word report uses Heading 1
   and Heading 2 properly. Five minutes here saves more than it costs — see
   [drafting the report itself](/guides/copilot-word-report-first-draft).

2. **Start from your unit's template**, not a blank deck. Open the template
   first so Copilot generates into your branding rather than the default
   theme.

3. **Create the deck from the file.** Open **Copilot** in PowerPoint and ask:

   > Create a presentation from [Q3-unit-review.docx]. Keep it to ten slides
   > for a leadership audience: the budget position, the three issues, and
   > what we are asking for.

4. **Set the level explicitly.** Leadership decks fail by being too detailed,
   and Copilot defaults to detail:

   > Rewrite these slides for a Vice Chancellor audience. Three bullets per
   > slide, no more than twelve words each. Move the supporting detail to the
   > speaker notes.

5. **Ask for the summary slide last**, once the content is settled:

   > Add an opening slide with the three things this audience needs to take
   > away.

6. **Fix the numbers by hand.** This is the step that matters. Copilot
   paraphrases figures out of prose and rounds them inconsistently; anything
   financial gets checked against the source, not against the report's own
   wording of it.

7. **Add the charts yourself.** A pasted chart from the real workbook beats a
   generated visual that approximates it.

## Example prompt that works well

> Build a six-slide update for the monthly operations meeting from
> [facilities-q3-summary.docx]: where we are against plan, the two projects
> at risk, what we need a decision on, and next steps. Plain language, no
> jargon, and put the detail in the notes.

## What to check

- **Every figure**, against the workbook rather than the narrative
- **Whether a nuance became a claim** — Copilot flattens "may be partly
  attributable to" into "was caused by", which is a different statement to
  make to leadership
- **The ask.** Generated decks describe; they rarely end with a clear
  request. Write the last slide yourself.
- **Accessibility** — check alt text and reading order before circulating.
  See [AI and accessibility](/guides/ai-and-digital-accessibility).

## Common problems

- **"I can't find that file"** — the document is not in OneDrive or
  SharePoint, or the filename does not match. Use the file picker rather than
  typing the name.
- **Generic stock imagery** — ask for no images, or specify "use only the
  charts from the source document."
- **Deck ignores your template** — Copilot generated into a blank
  presentation. Start over from the template; applying it afterwards rarely
  reflows cleanly.

## Microsoft's own documentation

[Create a new presentation with Copilot in PowerPoint](https://support.microsoft.com/en-us/PowerPoint/copilot/create-a-new-presentation-with-copilot-in-powerpoint)
