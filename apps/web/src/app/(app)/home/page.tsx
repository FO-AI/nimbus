"use client";

import Link from "next/link";

import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge, ButtonLink, Card, CardLink, EmptyState, PageHeader } from "@/components/ui";
import { useContentList } from "@/lib/api/useContent";
import { KIND_HINT, KIND_LABEL } from "@/lib/contentKind";
import type { ContentSummary } from "@/types";

function itemHref(item: ContentSummary): string {
  return item.kind === "prompt" ? `/prompts/${item.slug}` : `/guides/${item.slug}`;
}

/** Enough to show the shape of the library without becoming the whole library. */
const FEATURED_LIMIT = 6;

export default function HomePage() {
  const { items, loading, error, reload } = useContentList();
  const featured = items.filter((i) => i.featured);
  const shown = featured.slice(0, FEATURED_LIMIT);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="UNC Finance & Operations"
        title="AI for Finance & Operations"
        description="Everything staff need to use AI well at work: how-to guides, ready-made prompts, the tools you're approved to use, and what other teams are already doing."
      />

      {/* Three destinations, then the two things you can do. Previously two
          full-width call-to-action banners bracketed the destinations, which
          buried the actual library under repeated prompting. */}
      <div className="grid gap-4 md:grid-cols-3">
        <CardLink href="/guides">
          <h2 className="text-lg">Guides</h2>
          <p className="text-sm text-muted">
            How to do a task with AI, what the University allows, and which tools are approved.
          </p>
        </CardLink>
        <CardLink href="/prompts">
          <h2 className="text-lg">Prompt library</h2>
          <p className="text-sm text-muted">
            Ready-made instructions you can copy straight into an AI tool.
          </p>
        </CardLink>
        <CardLink href="/projects">
          <h2 className="text-lg">AI projects</h2>
          <p className="text-sm text-muted">
            What other Finance &amp; Operations teams are already doing with AI.
          </p>
        </CardLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3 border-carolina/30">
          <div>
            <h2 className="text-lg">Have a question?</h2>
            <p className="mt-1 text-sm text-muted">
              Ask in your own words. Every answer links to the page it came from, so you can check
              it before you act on it.
            </p>
          </div>
          <div className="mt-auto pt-1">
            <ButtonLink href="/ask">Ask Nimbus</ButtonLink>
          </div>
        </Card>
        <Card className="flex flex-col gap-3 border-carolina/30">
          <div>
            <h2 className="text-lg">Have an idea for your team?</h2>
            <p className="mt-1 text-sm text-muted">
              Tell us where AI might help. It takes about two minutes, and the AI team reviews every
              suggestion.
            </p>
          </div>
          <div className="mt-auto pt-1">
            <ButtonLink variant="secondary" href="/propose">
              Suggest an idea
            </ButtonLink>
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2>Start with these</h2>
          <div className="flex gap-3">
            <Link className="text-sm font-medium" href="/guides">
              Browse all guides →
            </Link>
            <Link className="text-sm font-medium" href="/prompts">
              Browse all prompts →
            </Link>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner label="Loading…" />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : shown.length === 0 ? (
          <EmptyState
            title="Nothing highlighted yet"
            action={
              <ButtonLink variant="secondary" href="/guides">
                Browse all guides
              </ButtonLink>
            }
          >
            Nothing has been picked out as a starting point yet — the full library is still there.
          </EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((item) => (
              <CardLink key={item.slug} href={itemHref(item)}>
                <div>
                  <Badge variant="primary" title={KIND_HINT[item.kind]}>
                    {KIND_LABEL[item.kind]}
                  </Badge>
                </div>
                <h2 className="text-lg">{item.title}</h2>
                <p className="text-sm text-muted">{item.summary}</p>
              </CardLink>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
