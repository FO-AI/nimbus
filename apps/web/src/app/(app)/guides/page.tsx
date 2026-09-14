"use client";

import { Suspense, useId, useMemo, useState } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SourceBadge } from "@/components/SourceNote";
import {
  Badge,
  Button,
  CardLink,
  EmptyState,
  FilterChip,
  FilterGroup,
  Input,
  PageHeader,
} from "@/components/ui";
import { useContentList } from "@/lib/api/useContent";
import { tagLabel } from "@/lib/contentAttributes";
import { KIND_FILTER_LABEL, KIND_HINT, KIND_LABEL } from "@/lib/contentKind";
import { useQueryFilters } from "@/lib/useQueryFilters";
import type { ContentKind } from "@/types";

// Guides holds three of the four kinds; prompts have their own page. Labels
// and hints come from the shared map so the chip, the badge on the card, and
// the badge on the detail page cannot say three different things.
const GUIDE_KINDS: ContentKind[] = ["playbook", "guidance", "tool"];

const KIND_FILTERS: { label: string; kind: ContentKind | null; hint: string }[] = [
  { label: "All", kind: null, hint: "Every guide, rule, and tool page" },
  ...GUIDE_KINDS.map((kind) => ({
    label: KIND_FILTER_LABEL[kind],
    kind,
    hint: KIND_HINT[kind],
  })),
];

/** Enough tags to be useful at a glance without becoming a wall. */
const VISIBLE_TAG_COUNT = 8;

function isGuideKind(value: string | null): value is ContentKind {
  return KIND_FILTERS.some((f) => f.kind !== null && f.kind === value);
}

export default function GuidesPage() {
  // useSearchParams (inside useQueryFilters) needs a Suspense boundary above it.
  return (
    <Suspense fallback={<LoadingSpinner label="Loading guides…" />}>
      <GuidesLibrary />
    </Suspense>
  );
}

function GuidesLibrary() {
  const { items, loading, error, reload } = useContentList();
  const { searchParams, setFilters, readFilter } = useQueryFilters();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [showAllTags, setShowAllTags] = useState(false);
  const allTagsId = useId();

  // Guides = everything except prompts (those have their own library page).
  const guides = useMemo(() => items.filter((i) => i.kind !== "prompt"), [items]);

  // Most-used tags first so the visible eight are the ones most worth filtering by.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    guides.forEach((i) => i.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return Array.from(counts.entries())
      .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
      .map(([t]) => t);
  }, [guides]);

  const kindParam = searchParams.get("kind");
  const kind = isGuideKind(kindParam) ? kindParam : null;
  // A stale or hand-edited ?tag= that no longer exists is ignored once the list
  // has loaded, so a shared link never leaves an empty page with no chip to clear.
  const tag = readFilter("tag", tags, { loading, fallback: null });

  const primaryTags = tags.slice(0, VISIBLE_TAG_COUNT);
  const moreTags = tags.slice(VISIBLE_TAG_COUNT);
  // An active tag from a shared link must stay visible even if it is not a top one.
  const pinnedTag = tag && !showAllTags && moreTags.some((t) => t === tag) ? tag : null;

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return guides.filter(
      (i) =>
        (kind === null || i.kind === kind) &&
        (tag === null || i.tags.includes(tag)) &&
        (needle === "" ||
          i.title.toLowerCase().includes(needle) ||
          i.summary.toLowerCase().includes(needle)),
    );
  }, [guides, kind, tag, search]);

  const filtered = kind !== null || tag !== null || search.trim() !== "";

  const clearFilters = () => {
    setSearch("");
    setFilters({ kind: null, tag: null, q: null });
  };

  const selectTag = (next: string | null) => setFilters({ tag: next });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guides"
        description="Three kinds of page: playbooks walk you through a task step by step, guidance explains what the University allows, and tool pages cover each approved AI tool and who can use it."
      />

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-4">
        <Input
          className="max-w-md"
          type="search"
          aria-label="Search guides by title or summary"
          placeholder="Search guides by title or summary…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFilters({ q: e.target.value });
          }}
        />

        <FilterGroup label="Type" hint="What kind of page this is">
          {KIND_FILTERS.map((f) => (
            <FilterChip
              key={f.label}
              type="button"
              active={kind === f.kind}
              title={f.hint}
              onClick={() => setFilters({ kind: f.kind })}
            >
              {f.label}
            </FilterChip>
          ))}
        </FilterGroup>

        {tags.length > 0 ? (
          <FilterGroup label="Topic" hint="Pick one to narrow the list">
            {primaryTags.map((t) => (
              <TagChip key={t} tag={t} active={tag === t} onSelect={selectTag} />
            ))}
            {pinnedTag ? <TagChip tag={pinnedTag} active onSelect={selectTag} /> : null}
            {moreTags.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                aria-expanded={showAllTags}
                aria-controls={allTagsId}
                onClick={() => setShowAllTags((v) => !v)}
              >
                {showAllTags ? "Show fewer topics" : `Show all ${tags.length} topics`}
              </Button>
            ) : null}
            {showAllTags && moreTags.length > 0 ? (
              <div
                id={allTagsId}
                className="mt-1 flex w-full flex-wrap gap-2 border-t border-border-subtle pt-3"
              >
                {moreTags.map((t) => (
                  <TagChip key={t} tag={t} active={tag === t} onSelect={selectTag} />
                ))}
              </div>
            ) : null}
          </FilterGroup>
        ) : null}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading guides…" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-muted" aria-live="polite">
              {visible.length} {visible.length === 1 ? "guide" : "guides"}
              {filtered ? ` of ${guides.length}` : ""}
            </p>
            {filtered ? (
              <Button variant="ghost" size="sm" type="button" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="No guides match the current filters."
              action={
                <Button variant="secondary" type="button" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            >
              Try a different search term, or clear the filters to see every guide.
            </EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => (
                <CardLink key={item.slug} href={`/guides/${item.slug}`}>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary" title={KIND_HINT[item.kind]}>
                      {KIND_LABEL[item.kind]}
                    </Badge>
                    <SourceBadge source={item.source} />
                    {item.featured ? <Badge variant="featured" title="Picked out by the AI team as a good place to start">
                      Featured
                    </Badge> : null}
                  </div>
                  <h2 className="text-lg">{item.title}</h2>
                  <p className="text-sm text-muted">{item.summary}</p>
                </CardLink>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Clicking the active tag clears it, so a chip is both the filter and its undo. */
function TagChip({
  tag,
  active,
  onSelect,
}: {
  tag: string;
  active: boolean;
  onSelect: (tag: string | null) => void;
}) {
  return (
    <FilterChip
      type="button"
      active={active}
      title={active ? `Remove the ${tagLabel(tag)} filter` : `Show only ${tagLabel(tag)} guides`}
      onClick={() => onSelect(active ? null : tag)}
    >
      {tagLabel(tag)}
    </FilterChip>
  );
}
