"""Sync git-authored markdown content into the `content_items` table.

Content is authored as markdown files with YAML frontmatter under
`apps/api/content/` (see `content/README.md` for the schema). Git is the
source of truth: this module mirrors the files into the database so the API
can query them. It runs at API startup (see `app.main`) and manually via
`python -m app.services.content_sync` / `make content-sync`.

Sync rules:
  - upsert by slug; files whose sha256 is unchanged are skipped
  - rows with no backing file are deleted, so the DB mirrors git — except when
    any file failed to parse (a broken file must not delete live content) or
    when the scan found nothing at all (a misconfigured CONTENT_DIR must not
    wipe the table)
  - invalid files are collected as errors and never abort the whole sync
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.models.content_item import VALID_KINDS, VALID_SOURCE_MODES, ContentItem

logger = get_logger(__name__)

_FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", re.DOTALL)
_SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
_REQUIRED_FIELDS = ("slug", "kind", "title", "summary")

# --- the `source` block -----------------------------------------------------
# Cross-kind provenance: where the material came from and on what terms. It is
# a closed schema (unknown keys are rejected) so a typo in one of 60 hand-
# written files fails the sync instead of silently dropping an attribution.
_SOURCE_FIELDS = (
    "mode",
    "url",
    "title",
    "publisher",
    "license",
    "license_url",
    "attribution",
    "adapted",
    "retrieved",
)
_URL_RE = re.compile(r"^https://[^\s]+$")
_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


@dataclass
class ParsedItem:
    slug: str
    kind: str
    title: str
    summary: str
    body_md: str
    tags: list[str]
    attributes: dict
    related_slugs: list[str]
    source: dict
    featured: bool
    published: bool
    source_path: str
    checksum: str


@dataclass
class SyncResult:
    created: int = 0
    updated: int = 0
    unchanged: int = 0
    deleted: int = 0
    errors: list[str] = field(default_factory=list)

    def summary(self) -> str:
        return (
            f"created={self.created} updated={self.updated} unchanged={self.unchanged} "
            f"deleted={self.deleted} errors={len(self.errors)}"
        )


def _parse_source(meta: dict) -> dict:
    """Validate and normalize the optional `source` provenance block.

    Returns `{}` for in-house content (no block, or `mode: original`) so the
    column stays falsy and the UI can test it directly.
    """
    raw = meta.get("source")
    if raw is None:
        return {}
    if not isinstance(raw, dict):
        raise ValueError("'source' must be a mapping")

    unknown = sorted(set(raw) - set(_SOURCE_FIELDS))
    if unknown:
        raise ValueError(
            f"source has unknown field(s) {', '.join(unknown)}; "
            f"allowed: {', '.join(_SOURCE_FIELDS)}"
        )

    mode = raw.get("mode")
    if not isinstance(mode, str) or mode not in VALID_SOURCE_MODES:
        raise ValueError(f"source.mode must be one of {', '.join(VALID_SOURCE_MODES)}")
    if mode == "original":
        return {}

    source: dict = {"mode": mode}

    url = raw.get("url")
    if not isinstance(url, str) or not _URL_RE.match(url.strip()):
        raise ValueError(f"source.url is required for mode '{mode}' and must be an https URL")
    source["url"] = url.strip()

    # A linked page is the authority for its own content, so the reader has to
    # be told who published it before they are sent there.
    if mode == "link" and not str(raw.get("publisher", "")).strip():
        raise ValueError("source.publisher is required for mode 'link'")

    # Imported text is redistributed under someone else's terms: attribution
    # and the licence have to travel with the file.
    if mode == "import":
        for name in ("license", "license_url", "attribution"):
            if not str(raw.get(name, "")).strip():
                raise ValueError(f"source.{name} is required for mode 'import'")

    for name in ("title", "publisher", "license", "license_url", "attribution"):
        value = raw.get(name)
        if value is not None:
            if not isinstance(value, str) or not value.strip():
                raise ValueError(f"source.{name} must be a non-empty string")
            source[name] = value.strip()

    if "license_url" in source and not _URL_RE.match(source["license_url"]):
        raise ValueError("source.license_url must be an https URL")

    retrieved = raw.get("retrieved")
    if retrieved is not None:
        # PyYAML parses an unquoted YYYY-MM-DD into a date object.
        text = retrieved.isoformat() if hasattr(retrieved, "isoformat") else str(retrieved)
        if not _DATE_RE.match(text):
            raise ValueError("source.retrieved must be an ISO date (YYYY-MM-DD)")
        source["retrieved"] = text

    if raw.get("adapted") is not None:
        source["adapted"] = bool(raw["adapted"])

    return source


def _str_list(meta: dict, key: str) -> list[str]:
    value = meta.get(key) or []
    if not isinstance(value, list) or not all(isinstance(v, str) for v in value):
        raise ValueError(f"'{key}' must be a list of strings")
    return value


def parse_content_file(path: Path, source_path: str) -> ParsedItem:
    """Parse one markdown file; raises ValueError on any schema problem."""
    raw = path.read_text(encoding="utf-8")
    match = _FRONTMATTER_RE.match(raw)
    if match is None:
        raise ValueError("missing YAML frontmatter (file must start with '---')")

    meta = yaml.safe_load(match.group(1))
    if not isinstance(meta, dict):
        raise ValueError("frontmatter must be a YAML mapping")

    for name in _REQUIRED_FIELDS:
        value = meta.get(name)
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"missing or empty required field '{name}'")

    slug = meta["slug"].strip()
    if not _SLUG_RE.match(slug):
        raise ValueError(f"slug '{slug}' must be lowercase kebab-case ([a-z0-9-])")

    kind = meta["kind"].strip()
    if kind not in VALID_KINDS:
        raise ValueError(f"kind '{kind}' must be one of {', '.join(VALID_KINDS)}")

    attributes = meta.get("attributes", {}) or {}
    if not isinstance(attributes, dict):
        raise ValueError("'attributes' must be a mapping")

    return ParsedItem(
        slug=slug,
        kind=kind,
        title=meta["title"].strip(),
        summary=meta["summary"].strip(),
        body_md=match.group(2).strip(),
        tags=_str_list(meta, "tags"),
        attributes=attributes,
        related_slugs=_str_list(meta, "related_slugs"),
        source=_parse_source(meta),
        featured=bool(meta.get("featured", False)),
        published=bool(meta.get("published", True)),
        source_path=source_path,
        checksum=hashlib.sha256(raw.encode("utf-8")).hexdigest(),
    )


def load_content_dir(content_dir: Path) -> tuple[list[ParsedItem], list[str]]:
    """Parse every *.md file under `content_dir` (excluding READMEs)."""
    items: list[ParsedItem] = []
    errors: list[str] = []
    seen: dict[str, str] = {}

    for path in sorted(content_dir.rglob("*.md")):
        if path.name.lower() == "readme.md":
            continue
        source_path = str(path.relative_to(content_dir))
        try:
            item = parse_content_file(path, source_path)
        except (ValueError, yaml.YAMLError, OSError) as exc:
            errors.append(f"{source_path}: {exc}")
            continue
        if item.slug in seen:
            errors.append(
                f"{source_path}: duplicate slug '{item.slug}' (also in {seen[item.slug]})"
            )
            continue
        seen[item.slug] = source_path
        items.append(item)

    return items, errors


_SYNCED_FIELDS = (
    "kind",
    "title",
    "summary",
    "body_md",
    "tags",
    "attributes",
    "related_slugs",
    "source",
    "featured",
    "published",
    "source_path",
    "checksum",
)


def sync_content(db: Session, content_dir: Path) -> SyncResult:
    """Mirror the content directory into `content_items`. Caller commits."""
    result = SyncResult()
    if not content_dir.is_dir():
        result.errors.append(f"content directory not found: {content_dir}")
        return result

    items, errors = load_content_dir(content_dir)
    result.errors.extend(errors)

    existing = {row.slug: row for row in db.execute(select(ContentItem)).scalars()}

    for item in items:
        row = existing.pop(item.slug, None)
        if row is None:
            db.add(ContentItem(slug=item.slug, **{f: getattr(item, f) for f in _SYNCED_FIELDS}))
            result.created += 1
        elif row.checksum == item.checksum:
            result.unchanged += 1
        else:
            for f in _SYNCED_FIELDS:
                setattr(row, f, getattr(item, f))
            result.updated += 1

    if existing:
        if items and not result.errors:
            for row in existing.values():
                db.delete(row)
                result.deleted += 1
        else:
            logger.warning(
                "Content sync: keeping %d DB row(s) with no backing file "
                "(scan was empty or had errors)",
                len(existing),
            )

    # Make the changes visible to subsequent queries on this session even with
    # autoflush disabled; the caller still owns the commit.
    db.flush()
    return result


def main(argv: list[str] | None = None) -> int:
    from app.core.config import get_settings
    from app.db.session import get_session_factory

    parser = argparse.ArgumentParser(description="Sync markdown content into the database.")
    parser.add_argument(
        "--content-dir",
        default=get_settings().content_dir,
        help="Directory to scan (default: settings.content_dir)",
    )
    args = parser.parse_args(argv)

    session = get_session_factory()()
    try:
        result = sync_content(session, Path(args.content_dir))
        session.commit()
    finally:
        session.close()

    print(result.summary())
    for error in result.errors:
        print(f"ERROR: {error}", file=sys.stderr)
    return 1 if result.errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
