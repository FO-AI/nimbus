"""/ask request/response schemas."""
from __future__ import annotations

from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(
        min_length=3, max_length=2000, examples=["How do I analyze a budget variance?"]
    )


class Citation(BaseModel):
    # "content" -> sourceKey is a slug; "project" -> sourceKey is a project id.
    sourceType: str
    sourceKey: str
    title: str
    kind: str


class AskResponse(BaseModel):
    answer: str
    citations: list[Citation]
    # True only when the answer cites at least one of the retrieved sources.
    # False covers both "retrieval found nothing" and "the model answered
    # without leaning on what we gave it"; the client warns on both.
    grounded: bool = True
    model: str | None = None
