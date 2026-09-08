"""Lint the shipped content library under `apps/api/content/`.

The library is hand-authored markdown — 70-odd files after the resource
catalog import — so the failure modes are editorial, not logical: a typo in a
`related_slugs` entry, a body link to a page that was renamed, an imported
prompt whose licence line was dropped. The sync reports per-file schema
errors; these tests cover the cross-file invariants it cannot see.
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

from app.services.content_sync import ParsedItem, load_content_dir

CONTENT_DIR = Path(__file__).resolve().parents[2] / "content"

# Internal links in a body: /guides/<slug> or /prompts/<slug>.
_INTERNAL_LINK_RE = re.compile(r"\]\((/(?:guides|prompts)/([a-z0-9-]+))\)")


@pytest.fixture(scope="module")
def library() -> list[ParsedItem]:
    items, errors = load_content_dir(CONTENT_DIR)
    assert errors == [], f"content files failed to parse: {errors}"
    assert items, "no content found — is CONTENT_DIR wrong?"
    return items


def test_every_related_slug_resolves(library):
    slugs = {i.slug for i in library}
    dangling = sorted(
        (i.slug, related)
        for i in library
        for related in i.related_slugs
        if related not in slugs
    )
    assert dangling == []


def test_every_internal_body_link_resolves(library):
    slugs = {i.slug for i in library}
    broken = sorted(
        (item.slug, path)
        for item in library
        for path, target in _INTERNAL_LINK_RE.findall(item.body_md)
        if target not in slugs
    )
    assert broken == []


def test_no_link_destination_contains_whitespace(library):
    """A wrap that puts a newline inside `](…)` renders the link as literal text.

    The internal-link checks below match on `](/guides/slug)`, so a link broken
    this way slips past them silently — this catches it directly.
    """
    broken = sorted(
        (item.slug, match.group(0)[:60])
        for item in library
        for match in re.finditer(r"\]\([^)]*\s[^)]*\)", item.body_md)
    )
    assert broken == []


def test_internal_links_use_the_real_routes(library):
    """`/p/…` and `/t/…` are not routes in the app; they 404 silently."""
    bad = sorted(
        (item.slug, match)
        for item in library
        for match in re.findall(r"\]\((/[pt]/[a-z0-9-]+)\)", item.body_md)
    )
    assert bad == []


def test_imported_content_carries_attribution(library):
    """CC BY-SA and OGL both require attribution to travel with the text."""
    incomplete = sorted(
        item.slug
        for item in library
        if item.source.get("mode") == "import"
        and not all(item.source.get(f) for f in ("license", "license_url", "attribution", "url"))
    )
    assert incomplete == []


def test_linked_content_names_its_publisher(library):
    unattributed = sorted(
        item.slug
        for item in library
        if item.source.get("mode") == "link"
        and not (item.source.get("publisher") and item.source.get("url"))
    )
    assert unattributed == []


def test_every_prompt_has_copyable_text_and_a_tool(library):
    prompts = [i for i in library if i.kind == "prompt"]
    assert len(prompts) > 50, "the imported prompt library is missing"
    missing = sorted(
        i.slug
        for i in prompts
        if not str(i.attributes.get("prompt", "")).strip()
        or not str(i.attributes.get("tool", "")).strip()
    )
    assert missing == []


def test_every_prompt_links_to_the_data_guidance(library):
    """Every prompt page must reach the tier rules in one click."""
    missing = sorted(
        i.slug
        for i in library
        if i.kind == "prompt" and "sensitive-data" not in i.related_slugs
    )
    assert missing == []


def test_tools_declare_status_and_data_tier(library):
    incomplete = sorted(
        i.slug
        for i in library
        if i.kind == "tool"
        and not (i.attributes.get("status") and i.attributes.get("data_tier"))
    )
    assert incomplete == []


def test_every_prompt_links_the_prompting_guidance(library):
    """§4b: every prompt page must reach the CLEAR framework in one click."""
    missing = sorted(
        i.slug
        for i in library
        if i.kind == "prompt" and "how-to-write-a-prompt" not in i.related_slugs
    )
    assert missing == []


def test_every_prompt_names_a_real_tool(library):
    """`tool` is a display label and drifts; `tool_slug` is the identity.

    Without this the library filter can offer a tool name that matches no
    registry entry, which is how the two got out of step in the first place.
    """
    tools = {i.slug for i in library if i.kind == "tool"}
    dangling = sorted(
        (i.slug, i.attributes.get("tool_slug"))
        for i in library
        if i.kind == "prompt" and i.attributes.get("tool_slug") not in tools
    )
    assert dangling == []
