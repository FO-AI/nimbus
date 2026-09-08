"""Tests for the git-to-DB content sync (services/content_sync.py)."""
from __future__ import annotations

from pathlib import Path

import pytest
from sqlalchemy import select

from app.models.content_item import ContentItem
from app.services.content_sync import sync_content

PLAYBOOK = """---
slug: test-playbook
kind: playbook
title: A test playbook
summary: How to test things.
tags: [testing, excel]
related_slugs: [test-guidance]
featured: true
---

Step one, step two.
"""

GUIDANCE = """---
slug: test-guidance
kind: guidance
title: A test guidance page
summary: What not to paste.
---

Never paste secrets.
"""

TOOL = """---
slug: test-tool
kind: tool
title: A test tool
summary: An approved tool.
attributes:
  status: approved
  owner_dept: ITS
---

Tool details.
"""


def write(content_dir: Path, name: str, text: str) -> Path:
    path = content_dir / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return path


def rows(db) -> dict[str, ContentItem]:
    return {r.slug: r for r in db.execute(select(ContentItem)).scalars()}


def test_sync_creates_items(tmp_path, db_session):
    write(tmp_path, "playbooks/a.md", PLAYBOOK)
    write(tmp_path, "guidance/b.md", GUIDANCE)
    write(tmp_path, "tools/c.md", TOOL)
    write(tmp_path, "README.md", "# not content")

    result = sync_content(db_session, tmp_path)

    assert result.errors == []
    assert result.created == 3
    by_slug = rows(db_session)
    assert set(by_slug) == {"test-playbook", "test-guidance", "test-tool"}
    playbook = by_slug["test-playbook"]
    assert playbook.kind == "playbook"
    assert playbook.tags == ["testing", "excel"]
    assert playbook.related_slugs == ["test-guidance"]
    assert playbook.featured is True
    assert playbook.published is True
    assert playbook.body_md == "Step one, step two."
    assert by_slug["test-tool"].attributes["status"] == "approved"


def test_sync_is_idempotent(tmp_path, db_session):
    write(tmp_path, "a.md", PLAYBOOK)
    sync_content(db_session, tmp_path)

    result = sync_content(db_session, tmp_path)

    assert (result.created, result.updated, result.unchanged) == (0, 0, 1)


def test_sync_updates_changed_file(tmp_path, db_session):
    write(tmp_path, "a.md", PLAYBOOK)
    sync_content(db_session, tmp_path)
    write(tmp_path, "a.md", PLAYBOOK.replace("A test playbook", "A renamed playbook"))

    result = sync_content(db_session, tmp_path)

    assert (result.created, result.updated) == (0, 1)
    assert rows(db_session)["test-playbook"].title == "A renamed playbook"


def test_sync_deletes_removed_files(tmp_path, db_session):
    a = write(tmp_path, "a.md", PLAYBOOK)
    write(tmp_path, "b.md", GUIDANCE)
    sync_content(db_session, tmp_path)
    a.unlink()

    result = sync_content(db_session, tmp_path)

    assert result.deleted == 1
    assert set(rows(db_session)) == {"test-guidance"}


def test_invalid_file_is_reported_and_blocks_deletion(tmp_path, db_session):
    write(tmp_path, "a.md", PLAYBOOK)
    write(tmp_path, "b.md", GUIDANCE)
    sync_content(db_session, tmp_path)

    # The playbook file breaks (bad kind); the sync must keep serving its row.
    write(tmp_path, "a.md", PLAYBOOK.replace("kind: playbook", "kind: bogus"))
    result = sync_content(db_session, tmp_path)

    assert len(result.errors) == 1
    assert "a.md" in result.errors[0]
    assert result.deleted == 0
    assert set(rows(db_session)) == {"test-playbook", "test-guidance"}


def test_duplicate_slug_is_an_error(tmp_path, db_session):
    write(tmp_path, "a.md", PLAYBOOK)
    write(tmp_path, "b.md", PLAYBOOK)

    result = sync_content(db_session, tmp_path)

    assert result.created == 1
    assert any("duplicate slug" in e for e in result.errors)


def test_missing_required_field_and_frontmatter(tmp_path, db_session):
    write(tmp_path, "a.md", "---\nslug: x\nkind: playbook\ntitle: X\n---\nbody")
    write(tmp_path, "b.md", "no frontmatter at all")

    result = sync_content(db_session, tmp_path)

    assert result.created == 0
    assert len(result.errors) == 2


def test_empty_scan_never_wipes_the_table(tmp_path, db_session):
    write(tmp_path, "a.md", PLAYBOOK)
    sync_content(db_session, tmp_path)
    (tmp_path / "a.md").unlink()

    result = sync_content(db_session, tmp_path)

    assert result.deleted == 0
    assert set(rows(db_session)) == {"test-playbook"}


def test_missing_directory_is_an_error(tmp_path, db_session):
    result = sync_content(db_session, tmp_path / "nope")

    assert result.errors
    assert result.created == 0


# --- the `source` provenance block -----------------------------------------

LINKED = """---
slug: linked-tool
kind: tool
title: A linked tool
summary: Summarized from an external page.
source:
  mode: link
  url: https://its.unc.edu/ai/copilot/
  title: AI tools at Carolina
  publisher: UNC ITS
  retrieved: 2026-09-08
---

We summarize; they are the authority.
"""

IMPORTED = """---
slug: imported-prompt
kind: prompt
title: An imported prompt
summary: Adapted from an openly licensed library.
source:
  mode: import
  url: https://example.com/library
  license: CC BY-SA 4.0
  license_url: https://creativecommons.org/licenses/by-sa/4.0/
  attribution: Someone Else
  adapted: true
---

Usage notes.
"""

ORIGINAL = """---
slug: own-work
kind: prompt
title: Written here
summary: Ours.
source:
  mode: original
---

Usage notes.
"""


def test_sync_parses_link_source(tmp_path, db_session):
    write(tmp_path, "tools/linked.md", LINKED)
    sync_content(db_session, tmp_path)
    source = rows(db_session)["linked-tool"].source
    assert source["mode"] == "link"
    assert source["publisher"] == "UNC ITS"
    # PyYAML turns an unquoted YYYY-MM-DD into a date; it must land as a string.
    assert source["retrieved"] == "2026-09-08"


def test_sync_parses_import_source_with_licence(tmp_path, db_session):
    write(tmp_path, "prompts/imported.md", IMPORTED)
    sync_content(db_session, tmp_path)
    source = rows(db_session)["imported-prompt"].source
    assert source["license"] == "CC BY-SA 4.0"
    assert source["attribution"] == "Someone Else"
    assert source["adapted"] is True


def test_sync_treats_original_mode_as_no_source(tmp_path, db_session):
    write(tmp_path, "prompts/own.md", ORIGINAL)
    sync_content(db_session, tmp_path)
    assert rows(db_session)["own-work"].source == {}


def test_sync_defaults_source_to_empty(tmp_path, db_session):
    write(tmp_path, "playbooks/a.md", PLAYBOOK)
    sync_content(db_session, tmp_path)
    assert rows(db_session)["test-playbook"].source == {}


@pytest.mark.parametrize(
    ("frontmatter", "expected"),
    [
        ("  mode: borrowed\n  url: https://example.com/x", "source.mode must be one of"),
        ("  mode: link\n  publisher: X", "source.url is required"),
        ("  mode: link\n  url: http://example.com/x\n  publisher: X", "source.url is required"),
        ("  mode: link\n  url: https://example.com/x", "source.publisher is required"),
        (
            "  mode: import\n  url: https://example.com/x\n  attribution: A"
            "\n  license_url: https://example.com/l",
            "source.license is required",
        ),
        (
            "  mode: link\n  url: https://example.com/x\n  publisher: X\n  retrieved: soon",
            "source.retrieved must be an ISO date",
        ),
        (
            "  mode: link\n  url: https://example.com/x\n  publisher: X\n  licence: CC0",
            "unknown field(s) licence",
        ),
    ],
)
def test_sync_rejects_invalid_source(tmp_path, db_session, frontmatter, expected):
    write(
        tmp_path,
        "tools/broken.md",
        f"---\nslug: broken\nkind: tool\ntitle: T\nsummary: S\n"
        f"source:\n{frontmatter}\n---\n\nBody.\n",
    )
    result = sync_content(db_session, tmp_path)
    assert result.created == 0
    assert len(result.errors) == 1
    assert expected in result.errors[0]
