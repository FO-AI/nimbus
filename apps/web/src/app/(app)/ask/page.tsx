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
        description="Answers come only from what's in Nimbus: guides, prompts, and the project inventory, with sources cited."
      />

      <Card>
        <div className="mb-4 flex min-h-80 flex-col gap-3">
          {turns.length === 0 ? (
            <div className="grid gap-5 rounded-xl border border-dashed border-border bg-cloud/45 p-5 md:grid-cols-[1fr_1.2fr]">
              <div className="space-y-3 text-sm">
                <h2 className="text-base">What Nimbus can answer</h2>
                <ul className="list-disc space-y-1.5 pl-5 text-muted">
                  <li>How to do a task with an approved AI tool, using the step-by-step guides.</li>
                  <li>Which reusable prompt fits the job you have in front of you.</li>
                  <li>What AI projects and pilots are underway across Finance &amp; Operations.</li>
                  <li>What is and isn&apos;t allowed under the acceptable-use guidance.</li>
                </ul>
                <p className="text-muted">
                  Every answer links to the Nimbus pages it came from, so you can check the
                  source before you act on it. Nimbus cannot see your files, email, or the web.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-base">Try one of these</h2>
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
                {turn.citations && turn.citations.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {turn.citations.map((c) => (
                      <Link
                        key={`${c.sourceType}-${c.sourceKey}`}
                        className="inline-flex items-center rounded-full border border-carolina/35 bg-surface px-2.5 py-1 text-xs font-medium text-navy transition hover:border-carolina hover:bg-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carolina focus-visible:ring-offset-2"
                        href={citationHref(c)}
                      >
                        {c.title}
                        <span className="ml-1 text-muted">({c.kind})</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
          {sending ? <LoadingSpinner label="Searching Nimbus..." /> : null}
        </div>

        {error ? <ErrorState error={error} /> : null}

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
              : `Type a question of at least ${MIN_QUESTION_LENGTH} characters to enable Ask.`}
        </p>
      </Card>
    </div>
  );
}
