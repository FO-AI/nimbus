"""Tests for /api/v1/content: browse, detail, and usage events."""
from __future__ import annotations

import pytest
from sqlalchemy import select

from app.models.content_event import ContentEvent
from app.models.content_item import ContentItem


@pytest.fixture
def seeded(db_session):
    """A small corpus: one guide, one prompt, one unpublished item."""
    db_session.query(ContentEvent).delete()
    db_session.query(ContentItem).delete()
    db_session.add_all(
        [
            ContentItem(
                slug="variance-guide",
                kind="playbook",
                title="Analyze budget variance",
                summary="Walk through a variance analysis.",
                body_md="## Steps\nUse the variance prompt.",
                tags=["budget", "excel"],
                attributes={},
                related_slugs=["variance-prompt", "missing-slug"],
                featured=True,
                published=True,
            ),
            ContentItem(
                slug="variance-prompt",
                kind="prompt",
                title="Draft a variance narrative",
                summary="Turn variances into a narrative.",
                body_md="## When to use this\nAfter month-end close.",
                tags=["budget", "writing"],
                attributes={"prompt": "Draft a narrative for [DEPT].", "audience": "Finance"},
                related_slugs=[],
                featured=False,
                published=True,
            ),
            ContentItem(
                slug="secret-draft",
                kind="guidance",
                title="Unpublished draft",
                summary="Should never appear.",
                body_md="",
                tags=[],
                attributes={},
                related_slugs=[],
                featured=False,
                published=False,
            ),
        ]
    )
    db_session.commit()
    yield
    db_session.query(ContentEvent).delete()
    db_session.query(ContentItem).delete()
    db_session.commit()


def test_list_returns_published_only(client, seeded):
    body = client.get("/api/v1/content").json()
    slugs = [i["slug"] for i in body["items"]]
    assert body["total"] == 2
    assert "secret-draft" not in slugs
    # Featured items sort first.
    assert slugs[0] == "variance-guide"


def test_list_filters_by_kind_tag_and_q(client, seeded):
    by_kind = client.get("/api/v1/content", params={"kind": "prompt"}).json()
    assert [i["slug"] for i in by_kind["items"]] == ["variance-prompt"]

    by_tag = client.get("/api/v1/content", params={"tag": "writing"}).json()
    assert [i["slug"] for i in by_tag["items"]] == ["variance-prompt"]

    by_q = client.get("/api/v1/content", params={"q": "month-end"}).json()
    assert [i["slug"] for i in by_q["items"]] == ["variance-prompt"]


def test_list_rejects_unknown_kind(client, seeded):
    assert client.get("/api/v1/content", params={"kind": "bogus"}).status_code == 422


def test_detail_resolves_related_and_skips_missing(client, seeded):
    body = client.get("/api/v1/content/variance-guide").json()
    assert body["bodyMd"].startswith("## Steps")
    assert body["related"] == [
        {"slug": "variance-prompt", "kind": "prompt", "title": "Draft a variance narrative"}
    ]


def test_detail_404_for_missing_and_unpublished(client, seeded):
    assert client.get("/api/v1/content/nope").status_code == 404
    assert client.get("/api/v1/content/secret-draft").status_code == 404


def test_copy_event_recorded(client, seeded, db_session):
    resp = client.post("/api/v1/content/variance-prompt/events", json={"eventType": "copy"})
    assert resp.status_code == 200
    events = list(db_session.execute(select(ContentEvent)).scalars())
    assert len(events) == 1
    assert events[0].content_slug == "variance-prompt"
    assert events[0].event_type == "copy"
    assert len(events[0].user_hash) == 64


def test_event_rejects_unknown_type_and_slug(client, seeded):
    bad_type = client.post(
        "/api/v1/content/variance-prompt/events", json={"eventType": "hack"}
    )
    assert bad_type.status_code == 422
    bad_slug = client.post("/api/v1/content/nope/events", json={"eventType": "view"})
    assert bad_slug.status_code == 404


# --- provenance (`source`) --------------------------------------------------


@pytest.fixture
def sourced(db_session):
    """One linked tool, one imported prompt, one in-house guide."""
    db_session.query(ContentEvent).delete()
    db_session.query(ContentItem).delete()
    db_session.add_all(
        [
            ContentItem(
                slug="linked-tool",
                kind="tool",
                title="A linked tool",
                summary="Summarized from ITS.",
                body_md="Body.",
                tags=[],
                attributes={},
                related_slugs=[],
                source={
                    "mode": "link",
                    "url": "https://its.unc.edu/ai/copilot/",
                    "publisher": "UNC ITS",
                    "retrieved": "2026-09-08",
                },
                published=True,
            ),
            ContentItem(
                slug="imported-prompt",
                kind="prompt",
                title="An imported prompt",
                summary="Adapted from elsewhere.",
                body_md="Body.",
                tags=[],
                attributes={"prompt": "Do the thing."},
                related_slugs=[],
                source={
                    "mode": "import",
                    "url": "https://example.com/library",
                    "license": "CC BY-SA 4.0",
                    "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
                    "attribution": "Someone Else",
                    "adapted": True,
                },
                published=True,
            ),
            ContentItem(
                slug="in-house",
                kind="guidance",
                title="Written here",
                summary="Ours.",
                body_md="Body.",
                tags=[],
                attributes={},
                related_slugs=[],
                source={},
                published=True,
            ),
        ]
    )
    db_session.commit()
    yield
    db_session.query(ContentItem).delete()
    db_session.commit()


def test_list_returns_source_for_linked_and_imported(client, sourced):
    items = {i["slug"]: i for i in client.get("/api/v1/content").json()["items"]}
    assert items["linked-tool"]["source"]["publisher"] == "UNC ITS"
    assert items["imported-prompt"]["source"]["license"] == "CC BY-SA 4.0"
    # An imported item's licence URL is aliased to camelCase for the frontend.
    assert items["imported-prompt"]["source"]["licenseUrl"].endswith("/by-sa/4.0/")
    assert items["in-house"]["source"] is None


def test_detail_returns_source(client, sourced):
    body = client.get("/api/v1/content/imported-prompt").json()
    assert body["source"]["mode"] == "import"
    assert body["source"]["adapted"] is True
    assert body["bodyMd"] == "Body."
