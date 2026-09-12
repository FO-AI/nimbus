---
slug: data-governance-policies
kind: guidance
title: The data policies behind the tier rules
summary: HIPAA, FERPA, vendor management, and transmission of sensitive
  information — the four policy targets an F&O question about AI and data
  usually lands on.
tags: [policy, governance, hipaa, ferpa, vendors, data-governance]
related_slugs: [sensitive-data, information-classification-standard, getting-a-tool-approved]
published: true
source:
  mode: link
  url: https://datagov.unc.edu/about/policies-about-data/
  title: Policies about data
  publisher: UNC Data Governance
  retrieved: 2026-09-11
---

## Why you would come here

[What data can I put into an AI tool](/guides/sensitive-data) answers the
day-to-day question. This page is for when you need the actual policy — a
vendor asks what governs your data, an auditor asks which standard applies, or
a judgment call has to be written down against something.

## The four that come up in F&O

**HIPAA and protected health information.** PHI is Tier 3 and never goes into
an AI tool, full stop. F&O touches it more often than people expect: employee
health documentation, anything from a benefits or leave case, invoices from
clinical units that name a patient.

**FERPA and student records.** Student data is Tier 2 and covers more than
grades — enrollment, financial aid, student employment records. Student
workers in an F&O unit have FERPA-protected records as students, separate from
their employment file.

**Vendor management.** What contracts must say before a third party handles
University data, including whether the vendor may train models on it. This is
the policy behind the question in the
[risk assessment](/guides/software-vendor-risk-assessment).

**Transmission of sensitive information.** How classified data may be moved.
Pasting into a tool is a transmission, which is why an approved tool matters
as much as a tier does.

## The rule underneath all four

An external obligation outranks the tier. Where a grant condition, a data use
agreement, or a vendor NDA restricts data that the classification standard
would call Tier 1, the obligation governs. That is why "it is only a budget
file" is not the end of the question when the budget is on a sponsored
project.

## Who to ask

Your unit's data steward or Senior IT contact first. Data Governance runs the
oversight group that approves sensitive-data uses, and gets the question when
it is genuinely novel.
