# Nimbus content

Git-first content model: every playbook, tool-registry entry, guidance
page, and reusable prompt is a markdown file in this directory. **Git is the source of truth** —
the API mirrors these files into the `content_items` table at startup (and via
`make content-sync`). Merging to `main` and deploying *is* publishing.

This directory lives under `apps/api/` (not the repo root) because the API
Docker image is built with `apps/api` as its context; the files are baked into
the image at `/app/content`.

## Layout

```
content/
  playbooks/   kind: playbook  — workflow-specific how-tos for approved tools
  tools/       kind: tool      — the AI tool & pilot registry
  guidance/    kind: guidance  — plain-language acceptable-use guidance
  prompts/     kind: prompt    — reusable copy-paste prompts for the library
```

The subdirectories are a convention for humans; the sync only reads the
`kind` field in frontmatter.

## File format

YAML frontmatter followed by a markdown body:

```markdown
---
slug: copilot-excel-budget-variance   # required; unique, lowercase kebab-case
kind: playbook                        # required; playbook | tool | guidance | prompt
title: Analyze a budget variance report with Copilot in Excel   # required
summary: One or two sentences shown on cards and used by the ask endpoint to
  decide relevance.                   # required
tags: [budget, excel, copilot]        # optional; list of strings
related_slugs: [sensitive-data]       # optional; hand-curated cross-links.
                                      # Playbooks/tools should link the guidance
                                      # that applies to them — this is what
                                      # powers contextual risk callouts.
featured: false                       # optional; featured on the home page
published: true                       # optional; false hides it everywhere
source: {}                            # optional; provenance, see below
attributes: {}                        # optional; kind-specific fields, see below
---

The markdown body. For playbooks: prerequisites, numbered steps, examples,
links, video embeds. For guidance: plain-language do/don't.
```

### The `source` block (all kinds)

Where the material came from and on what terms. Omit it for anything written
in-house. See `docs/adr/0004-content-source-provenance.md` for why this is a
top-level block rather than part of `attributes`.

```yaml
source:
  mode: link              # link | import | practice | original
  url: https://its.unc.edu/ai/copilot/     # required unless mode is original
  title: AI tools at Carolina              # the external page's own title
  publisher: UNC ITS                       # required for mode: link
  license: CC BY-SA 4.0                    # required for mode: import
  license_url: https://creativecommons.org/licenses/by-sa/4.0/   # ditto
  attribution: Mathieu Kessler (kesslernity)                     # ditto
  adapted: true           # we changed it (re-voiced for UNC)
  retrieved: 2026-09-08   # ISO date; when the source was last read
```

| Mode | Meaning | Rendered as |
| --- | --- | --- |
| `link` | An external page is the authority; Nimbus writes its own plain-language summary and links out. **Paraphrase, never copy.** | A callout naming the publisher, above the body |
| `import` | Text adapted from an openly licensed library, re-voiced for UNC | An attribution and licence line below the body |
| `practice` | A public, Tier 0 UNC document used as exercise material in a playbook | A "practice material" note |
| `original` | Written here. Equivalent to omitting the block | Nothing |

The schema is **closed** — an unknown key such as `licence:` fails the sync
rather than being silently dropped, because a dropped key here is a dropped
attribution. URLs must be `https`.

Imported prompts currently come from three libraries: awesome-microsoft-copilot-prompts
(CC BY-SA 4.0), the UK Government AI Knowledge Hub (OGL v3.0), and the Wharton
Generative AI Labs library (CC BY 4.0). CC BY-SA is share-alike: adaptations of
those prompts must stay under CC BY-SA 4.0.

### `attributes` for `kind: tool`

```yaml
attributes:
  status: approved        # approved | pilot | under-review | retired
  owner_dept: ITS
  owner_contact: someone@unc.edu   # or a service-desk route
  url: https://example.com         # where a user goes to use the tool
  access: Anyone with an active Onyen        # who can use it
  data_tier: Tier 1 and 2; never Tier 3      # what data it accepts
```

Tool entries are `mode: link` — the registry summarizes ITS, the Provost's
office, or the Library, and those pages stay authoritative.

### `attributes` for `kind: prompt`

```yaml
attributes:
  prompt: |               # required for prompts; the copy-paste text the
    The literal prompt    # Copy button puts on the clipboard
    text, verbatim.
  audience: Finance staff # who this prompt is for (shown as a chip)
  department: Finance     # primary F&O department this prompt serves:
                          # Finance | Budget | Procurement | HR operations |
                          # Facilities | All (All = not department-specific)
  tool: Microsoft 365 Copilot   # display label for the tool chip/filter
  tool_slug: copilot-chat       # required; the tool entry this prompt runs in.
                                # `tool` drifts, this is the identity — the
                                # library lint fails if it names no tool.
  example_input: Optional description of what to feed it
  example_output: Optional sample of what a good result looks like
```

The markdown body of a prompt holds usage notes: when to use it, how to
adapt the placeholders, and what to double-check in the output. Every prompt
must also carry `how-to-write-a-prompt` in `related_slugs` and link it from
its "How to adapt it" section, so the CLEAR framework is one click from any
prompt (resource catalog §4b).

## Rules enforced by the sync

- `slug`, `kind`, `title`, `summary` are required; `kind` must be valid;
  slugs must be unique across ALL kinds.
- If a `source` block is present it must be valid for its mode (see above);
  unknown keys are rejected.
- Invalid files are skipped and reported — they never abort the sync.
- Deleting a file deletes its row on the next sync (unless the scan had
  errors, in which case deletions are held back as a safety measure).
- Renaming a `slug` is a delete + create; avoid it once a slug has been
  linked from other content or shared as a URL.

`app/tests/test_content_library.py` lints this directory as part of the normal
test run: every `related_slugs` entry and internal body link must resolve, every
imported item must carry its licence and attribution, every linked item must name
its publisher, and every prompt must have copyable text, a tool, and a link to
`sensitive-data`.

Run `make content-sync` (or `python -m app.services.content_sync` from
`apps/api`) to sync manually; it exits non-zero if any file is invalid, so it
can gate CI.
