---
slug: copilot-teams-meeting-recap
kind: playbook
title: Capture a budget review meeting with Copilot in Teams
summary: Use Copilot in Teams to produce a recap and an action list from a
  budget or project meeting — including how to run it without recording, and
  what the public-records rules mean for the output.
tags: [teams, meetings, copilot, minutes, public-records]
related_slugs: [microsoft-365-copilot, sensitive-data, ai-and-public-records, meeting-notes-to-actions]
published: true
---

> **Before you start:** a Copilot meeting recap is a **public record** under
> G.S. 132-1, and so is a transcript. Read
> [AI and the Public Records Act](/guides/ai-and-public-records) before you
> turn this on for a meeting where people speak freely.

## What you'll do

Come out of a budget review or project meeting with a recap, a decision list,
and action items with owners — without one person spending the meeting typing
instead of contributing.

## Prerequisites

- A Microsoft 365 Copilot license (the licensed tier —
  [Copilot Chat alone will not do this](/guides/copilot-chat))
- Transcription enabled for the meeting, **or** Copilot set to run without
  saving a transcript (see below)
- Participants told that AI notes are being taken. Say it out loud at the
  start; do not rely on the banner.

## Steps

1. **Before the meeting**, decide whether to record. If the discussion is
   routine, transcribe and keep the recap. If it covers personnel, contract
   negotiation, or anything sensitive, use the no-transcript option in step 2
   or take notes by hand.

2. **Start Copilot without recording, if that is the call.** In the meeting
   controls, open **Copilot** and choose the option that lets it work without
   transcribing or recording. Copilot can then answer questions during the
   meeting, but nothing is retained afterwards — you lose the recap, which is
   the trade.

3. **Say that AI notes are on.** One sentence at the top: "I have Copilot
   taking notes on this meeting." Participants can then decide what to say.

4. **During the meeting, ask Copilot for the state of play** if you join late
   or lose the thread:

   > What has been decided so far, and what is still open?

5. **After the meeting, open the recap** from the meeting chat and ask for
   what the recap does not give you by default:

   > List every action item with the owner and the date it is due. Flag any
   > item where no owner was named.

6. **Pull out the decisions separately**, because these are what people
   dispute later:

   > What decisions were made, and what was explicitly deferred to a later
   > meeting?

7. **Correct the recap before you circulate it.** Fix names, fund numbers,
   and system names — ConnectCarolina, InfoPorte, and people's names are
   exactly what transcription gets wrong. An uncorrected recap is a record
   with errors in it.

## Example prompt that works well

> Summarize this meeting for someone who missed it: the budget position we
> reviewed, the three issues raised about the forecast, and what each person
> agreed to do next. Keep it under 200 words.

## What to check before circulating

- **Attribution.** Copilot sometimes assigns a comment to the wrong speaker.
  Check anything contentious against your own memory.
- **Numbers.** Figures spoken aloud get transcribed wrong. Verify against the
  pack, not the recap.
- **Anything said in confidence.** A recap circulated to a wider list than the
  meeting is a disclosure. Trim before sending.
- **Retention.** The recap is retained on the schedule for that meeting's
  records, not on a schedule for "AI output."

## Common problems

- **No recap after the meeting** — transcription was off. Copilot cannot
  reconstruct a meeting it did not transcribe.
- **Recap is thin for a long meeting** — usually poor audio on the people who
  talked most. Ask for the action list explicitly rather than relying on the
  summary.
- **Someone objects to being transcribed** — turn it off. Consent is easier to
  get than to repair.

## Microsoft's own documentation

[Catch up on meetings with Copilot in Teams](https://support.microsoft.com/en-us/teams/copilot/catch-up-on-meetings-with-microsoft-365-copilot-in-teams)
· [Use Copilot without transcribing or recording](https://support.microsoft.com/en-us/teams/copilot/use-copilot-without-transcribing-or-recording-a-teams-meeting-or-call)
