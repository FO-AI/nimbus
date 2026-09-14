"""/ask grounding: `grounded` must describe the answer, not the retrieval."""

from __future__ import annotations

import pytest

from app.api.v1.routes import ask as ask_route
from app.services.ai.base import AIProvider, ChatMessage, ChatResult
from app.services.rag.retriever import RetrievedSource

API = "/api/v1"


def _source(key: str, title: str) -> RetrievedSource:
    return RetrievedSource(
        source_type="content",
        source_key=key,
        title=title,
        kind="guidance",
        heading="",
        text=f"Body of {title}.",
    )


class _StubProvider(AIProvider):
    name = "stub"

    def __init__(self, answer: str) -> None:
        self.answer = answer

    async def chat(
        self,
        messages: list[ChatMessage],
        *,
        temperature: float = 0.2,
        max_tokens: int | None = None,
    ) -> ChatResult:
        return ChatResult(content=self.answer, model="stub-1", metadata={})

    async def embed(self, texts: list[str]) -> list[list[float]]:
        return [[0.0] for _ in texts]


class _StubRetriever:
    def __init__(self, sources: list[RetrievedSource]) -> None:
        self.sources = sources

    async def search(self, db, query: str, k: int = 6) -> list[RetrievedSource]:
        return self.sources


@pytest.fixture
def stub_ask(client):
    """Pin retrieval and generation so only the grounding logic is under test."""

    def _configure(answer: str, sources: list[RetrievedSource]):
        client.app.dependency_overrides[ask_route.ai_provider] = lambda: _StubProvider(answer)
        client.app.dependency_overrides[ask_route.retriever] = lambda: _StubRetriever(sources)
        return client

    yield _configure

    client.app.dependency_overrides.pop(ask_route.ai_provider, None)
    client.app.dependency_overrides.pop(ask_route.retriever, None)


def test_cited_source_indexes_reads_markers_in_order_without_duplicates():
    assert ask_route.cited_source_indexes("Per [2] and [1], yes. Also [2].", 3) == [2, 1]


def test_cited_source_indexes_ignores_markers_outside_the_context_range():
    assert ask_route.cited_source_indexes("See [9] and [0].", 2) == []


def test_answer_that_cites_a_source_is_grounded(stub_ask):
    c = stub_ask(
        "Tier 3 data stays out of Copilot [1].",
        [_source("sensitive-data", "Sensitive data"), _source("copilot-chat", "Copilot Chat")],
    )
    body = c.post(f"{API}/ask", json={"question": "Can I paste Tier 3 data?"}).json()

    assert body["grounded"] is True
    # Every retrieved page is still offered; grounding changes how the client
    # frames them, not which ones it gets.
    assert [x["sourceKey"] for x in body["citations"]] == ["sensitive-data", "copilot-chat"]


def test_answer_that_cites_nothing_is_not_grounded(stub_ask):
    """The case the warning exists for: retrieval hit, the model ignored it."""
    c = stub_ask(
        "Yes, you can paste anything into any AI tool.",
        [_source("sensitive-data", "Sensitive data")],
    )
    body = c.post(f"{API}/ask", json={"question": "Can I paste Tier 3 data?"}).json()

    assert body["grounded"] is False
    # Still offered, but as related reading rather than as the answer's basis.
    assert [x["sourceKey"] for x in body["citations"]] == ["sensitive-data"]


def test_empty_retrieval_returns_the_fallback_without_calling_the_model(stub_ask):
    c = stub_ask("unused", [])
    body = c.post(f"{API}/ask", json={"question": "Something we have nothing on"}).json()

    assert body["grounded"] is False
    assert body["citations"] == []
    assert body["answer"] == ask_route.FALLBACK_ANSWER
