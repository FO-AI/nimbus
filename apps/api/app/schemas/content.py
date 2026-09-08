"""Content browse/read schemas (guides, prompts, tools, guidance)."""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class SourceRef(BaseModel):
    """Where a content item came from and on what terms.

    Present only for externally sourced material; in-house content sends
    `null`. `mode` drives how the frontend renders it: `link` shows an
    "authoritative source" callout, `import` shows an attribution/licence
    line, `practice` marks public exercise material.
    """

    mode: Literal["link", "import", "practice"]
    url: str
    title: str | None = None
    publisher: str | None = None
    license: str | None = None
    licenseUrl: str | None = None
    attribution: str | None = None
    adapted: bool = False
    retrieved: str | None = None


class ContentSummary(BaseModel):
    """Card-level view returned by the list endpoint."""

    slug: str
    kind: str
    title: str
    summary: str
    tags: list[str]
    # Kind-specific fields (prompt text, audience, tool owner, ...).
    attributes: dict
    # Provenance for linked/imported material; null for in-house content.
    source: SourceRef | None = None
    featured: bool
    updatedAt: datetime


class RelatedItem(BaseModel):
    """Resolved cross-link, enough to render a link card."""

    slug: str
    kind: str
    title: str


class ContentDetail(ContentSummary):
    bodyMd: str
    related: list[RelatedItem]


class ContentListResponse(BaseModel):
    items: list[ContentSummary]
    total: int


class ContentEventRequest(BaseModel):
    eventType: Literal["copy", "view"]


class ContentEventResponse(BaseModel):
    status: str = Field(default="recorded", examples=["recorded"])
