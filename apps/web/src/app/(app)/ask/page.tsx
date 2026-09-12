"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Markdown } from "@/components/Markdown";
import { Button, Card, FilterChip, Input, PageHeader } from "@/components/ui";
import { useApiClient } from "@/lib/api/useApiClient";
import type { Citation } from "@/types";

interface Turn {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  grounded?: boolean;
}

const STARTER_QUESTIONS = [
  "How do I analyze a budget variance with Copilot?",
  "Are there any AI projects in Finance?",
  "What data can I put into an approved AI tool?",
  "Is there a prompt for drafting a vendor email?",
];

/** Citations render the kind verbatim otherwise — "(playbook)", "(project)". */
const CITATION_LABEL: Record<string, string> = {
  playbook: "Playbook",
  guidance: "Guidance",
  tool: "Tool page",
  prompt: "Prompt",
  project: "AI project",
};

/** Short enough to allow "PTO?", long enough to reject a stray keystroke. */
const MIN_QUESTION_LENGTH = 3;

function citationHref(c: Citation): string {
  if (c.sourceType === "project") return `/projects/${c.sourceKey}`;
  return c.kind === "prompt" ? `/prompts/${c.sourceKey}` : `/guides/${c.sourceKey}`;
}

export default function AskPage() {
  const api = useApiClient();
  const hintId = useId();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [sending, setSending] = useState(false);

  async function ask(question: string) {
    if (!question || sending) return;

    setError(null);
    setSending(true);
    setTurns((prev) => [...prev, { role: "user", content: question }]);
    setInput("");

    try {
      const result = await api.ask(question);
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          citations: result.citations,
          grounded: result.grounded,
        },
      ]);
    } catch (err) {
      setError(err);
    } finally {
      setSending(false);
    }
  }

  const canAsk = input.trim().length >= MIN_QUESTION_LENGTH;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void ask(input.trim());
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ask Nimbus"
        description="Ask a question in your own words about AI at Finance & Operations. Every answer links to the page it came from, so you can check it before you act on it."
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3">
          {turns.length === 0 ? (
            <div className="space-y-3">
              <h2 className="text-base">Not sure what to ask? Try one of these</h2>
              <div
                className="flex flex-col items-start gap-2"
                role="group"
                aria-label="Example questions"
              >
                {STARTER_QUESTIONS.map((q) => (
                  <FilterChip
                    key={q}
                    type="button"
                    className="max-w-full text-left"
                    disabled={sending}
                    onClick={() => void ask(q)}
                  >
                    {q}
                  </FilterChip>
                ))}
              </div>
            </div>
          ) : (
            turns.map((turn, i) => (
              <div
                key={i}
                className={
                  turn.role === "user"
                    ? "max-w-[85%] self-end whitespace-pre-wrap rounded-xl bg-carolina px-4 py-3 text-sm text-navy"
                    : "max-w-[85%] self-start rounded-xl bg-cloud px-4 py-3 text-sm text-foreground"
                }
              >
                {turn.role === "assistant" ? (
                  <Markdown>{turn.content}</Markdown>
                ) : (
                  <div className="whitespace-pre-wrap">{turn.content}</div>
                )}
                {turn.role === "assistant" && turn.grounded === false ? (
                  // The API tells us when an answer is not backed by anything in
                  // the library. Hiding that made an unsupported answer look
                  // exactly like a cited one, on a page whose whole promise is
                  // that answers are cited.
                  <p className="mt-3 flex gap-2 rounded-lg border border-warning/30 bg-warning-bg px-3 py-2 text-xs text-warning">
                    <span aria-hidden="true">⚠</span>
                    <span>
                      Nimbus could not find this in the library, so this answer is not backed by a
                      Nimbus page. Please check with the Finance &amp; Operations AI team before
                      acting on it.
                    </span>
                  </p>
                ) : null}
                {turn.citations && turn.citations.length > 0 ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-muted">
                      Where this answer came from
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {turn.citations.map((c) => (
                        <Link
                          key={`${c.sourceType}-${c.sourceKey}`}
                          className="inline-flex items-center rounded-lg border border-carolina/35 bg-surface px-2 py-1 text-xs font-medium text-navy transition hover:border-carolina hover:bg-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carolina focus-visible:ring-offset-2"
                          href={citationHref(c)}
                        >
                          {c.title}
                          <span className="ml-1 font-normal text-muted">
                            {CITATION_LABEL[c.kind] ?? c.kind}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          )}
          {sending ? <LoadingSpinner label="Searching Nimbus..." /> : null}
        </div>

        {error ? (
          <ErrorState error={error} onRetry={() => setError(null)} retryLabel="Dismiss" />
        ) : null}

        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}>
          <Input
            aria-label="Question"
            aria-describedby={hintId}
            placeholder="Ask about tools, guides, prompts, or projects..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !canAsk}>
            Ask
          </Button>
        </form>
        {/* A disabled button with no reason is a dead end; say what unlocks it. */}
        <p id={hintId} className="mt-2 text-xs text-muted">
          {sending
            ? "Looking through the Nimbus library…"
            : canAsk
              ? "Answers cite the Nimbus pages they came from."
              : "Type your question above, then select Ask."}
        </p>
        <p className="mt-1 text-xs text-muted">
          Nimbus answers from the guides, prompts, and AI projects on this site, and links to the
          page each answer came from. It cannot see your files, your email, or the web.
        </p>
      </Card>
    </div>
  );
}
