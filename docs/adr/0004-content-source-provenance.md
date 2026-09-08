# ADR 0004: A `source` block for linked and imported content

- Status: Accepted
- Date: 2026-09-08

## Context

`docs/resource-catalog.md` surveys the UNC AI landscape and sorts every
resource into one of three import modes: **link** (Nimbus summarizes a page
that remains the authority), **practice** (a public, Tier 0 UNC document used
as exercise material), and **import** (prompts copied and re-voiced from an
openly licensed library). Only the third puts somebody else's text into this
repository.

None of that had anywhere to live. `ContentItem` carried `attributes`, a
free-form per-kind JSON bag, and `source_path`/`checksum`, which record where
the *file* came from, not where the *material* came from. Two consequences:

1. **Link-mode entries were indistinguishable from in-house writing.** A tool
   entry summarizing `its.unc.edu` looked authored, so a reader had no signal
   that ITS is authoritative and the summary may lag it.
2. **Licence obligations had nowhere to travel.** The imported prompts come
   from three libraries under CC BY-SA 4.0, OGL v3.0, and CC BY 4.0. All three
   require attribution; CC BY-SA additionally requires that adaptations be
   shared under the same terms. An attribution kept only in a spreadsheet is an
   attribution that is one refactor from being lost.

Putting provenance in `attributes` was rejected: `attributes` is *kind*-scoped
(prompts have `prompt`, tools have `status`), while provenance is orthogonal to
kind — a tool, a playbook, and a prompt can each be linked or imported.

## Decision

A top-level `source` frontmatter block, mirrored to a new `content_items.source`
JSON column (migration `0008_content_source`) and exposed as `SourceRef` on the
content API.

```yaml
source:
  mode: link          # link | import | practice | original
  url: https://its.unc.edu/ai/copilot/
  title: AI tools at Carolina
  publisher: UNC ITS
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Mathieu Kessler (kesslernity)
  adapted: true
  retrieved: 2026-09-08
```

It is a **closed schema** — the sync rejects unknown keys — because across 70
hand-authored files a silently ignored `licence:` typo would drop an attribution
without anyone noticing. Validation is conditional on mode: every external mode
needs an `https` URL, `link` needs a `publisher`, and `import` needs
`license`, `license_url`, and `attribution`. `mode: original` and an absent
block both normalize to `{}`, so the column is falsy for in-house content and
the frontend can test it directly.

`GET /api/v1/content` gains a `mode` filter, and the retrieval indexer folds a
link-mode item's publisher and URL into its chunk prefix so `/ask` can point
staff at the authority rather than answering from the summary.

## Consequences

- Attribution is a property of the file, so it survives moves, edits, and
  reviews. `test_content_library.py` fails the build if an imported item loses
  its licence fields or a linked item loses its publisher.
- The UI can be honest about what a page is: `SourceNote` renders a linked item
  as a callout naming the authority, and an imported item as an attribution and
  licence line at the foot of the page.
- Adding a mode means touching the sync validator, the Pydantic `Literal`, and
  the TS union. That is deliberate friction — modes carry legal meaning.
- The API contract is still mirrored by hand in three places
  (`app/schemas/` → `packages/api-client/` → `apps/web/src/types/`). `SourceRef`
  is now a fourth type subject to that drift; see the known issue in
  `CLAUDE.md`.
