"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

import { CopyPromptButton } from "@/components/CopyPromptButton";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PromptPreviewDialog } from "@/components/PromptPreviewDialog";
import { SourceBadge } from "@/components/SourceNote";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  FilterChip,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";
import { useApiClient } from "@/lib/api/useApiClient";
import { useContentList } from "@/lib/api/useContent";
import { useQueryFilters } from "@/lib/useQueryFilters";
import type { ContentSummary } from "@/types";

const ALL = "all";

// §4c uses "All" for a prompt that is not department-specific. Rendered
// verbatim it sits next to the reset chip and reads like a second reset.
const DEPARTMENT_LABEL: Record<string, string> = { All: "Any department" };

function departmentLabel(value: string): string {
  return DEPARTMENT_LABEL[value] ?? value;
}

/** Frontmatter `attributes` values are typed as unknown; narrow to a string. */
function attr(item: ContentSummary, key: "department" | "tool" | "audience"): string | null {
  const value = item.attributes[key];
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function sortedValues(items: ContentSummary[], key: "department" | "tool"): string[] {
  const all = new Set<string>();
  items.forEach((i) => {
    const v = attr(i, key);
    if (v) all.add(v);
  });
  return Array.from(all).sort();
}

const ORIGINS = new Set(["unc", "adapted"]);

export default function PromptsPage() {
  // useSearchParams (inside useQueryFilters) needs a Suspense boundary above it.
  return (
    <Suspense fallback={<LoadingSpinner label="Loading prompts…" />}>
      <PromptsLibrary />
    </Suspense>
  );
}

function PromptsLibrary() {
  const api = useApiClient();
  const { items, loading, error, reload } = useContentList("prompt");
  const { searchParams, setFilters } = useQueryFilters();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [preview, setPreview] = useState<ContentSummary | null>(null);

  const departments = useMemo(() => sortedValues(items, "department"), [items]);
  const tools = useMemo(() => sortedValues(items, "tool"), [items]);

  // A stale or hand-edited URL value that matches nothing is treated as "all"
  // once the list is known, so the controls never show a selection that has
  // no effect. Until then, trust the URL so the controls do not flicker.
  const known = (value: string | null, options: string[]) =>
    value && (loading || options.includes(value)) ? value : ALL;
  const department = known(searchParams.get("department"), departments);
  const tool = known(searchParams.get("tool"), tools);
  const originParam = searchParams.get("origin");
  const origin = originParam && ORIGINS.has(originParam) ? originParam : ALL;

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return items.filter((i) => {
      if (department !== ALL && attr(i, "department") !== department) return false;
      if (tool !== ALL && attr(i, "tool") !== tool) return false;
      if (origin === "unc" && i.source) return false;
      if (origin === "adapted" && i.source?.mode !== "import") return false;
      if (needle === "") return true;
      const prompt = typeof i.attributes.prompt === "string" ? i.attributes.prompt : "";
      return (
        i.title.toLowerCase().includes(needle) ||
        i.summary.toLowerCase().includes(needle) ||
        prompt.toLowerCase().includes(needle) ||
        i.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [items, department, tool, origin, search]);

  const filtered = department !== ALL || tool !== ALL || origin !== ALL || search.trim() !== "";

  const clearFilters = () => {
    setSearch("");
    setFilters({ department: null, tool: null, origin: null, q: null });
  };

  const recordCopy = (slug: string) => void api.recordContentEvent(slug, "copy").catch(() => {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt library"
        description="Reusable prompts you can copy, adapt, and paste into approved AI tools. Preview a prompt to read it first, or open it for usage notes, examples, and what to double-check in the output."
      />

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <Input
          className="max-w-md"
          aria-label="Search prompts"
          placeholder="Search prompts…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFilters({ q: e.target.value });
          }}
        />

        {departments.length > 0 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by department">
            <FilterChip
              type="button"
              active={department === ALL}
              onClick={() => setFilters({ department: null })}
            >
              All prompts
            </FilterChip>
            {departments.map((d) => (
              <FilterChip
                key={d}
                type="button"
                active={department === d}
                onClick={() => setFilters({ department: department === d ? null : d })}
              >
                {departmentLabel(d)}
              </FilterChip>
            ))}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
          <Field label="Tool">
            <Select value={tool} onChange={(e) => setFilters({ tool: e.target.value === ALL ? null : e.target.value })}>
              <option value={ALL}>Any approved tool</option>
              {tools.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Origin">
            <Select
              value={origin}
              onChange={(e) => setFilters({ origin: e.target.value === ALL ? null : e.target.value })}
            >
              <option value={ALL}>Anywhere</option>
              <option value="unc">Written at UNC</option>
              <option value="adapted">Adapted from an open library</option>
            </Select>
          </Field>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading prompts…" />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-muted" aria-live="polite">
              {visible.length} {visible.length === 1 ? "prompt" : "prompts"}
              {filtered ? ` of ${items.length}` : ""}
            </p>
            {filtered ? (
              <Button variant="ghost" size="sm" type="button" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="No prompts match the current filters."
              action={
                <Button variant="secondary" type="button" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            >
              Try a different search term, or clear the filters to see every prompt.
            </EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => (
                <Card
                  key={item.slug}
                  className="relative flex min-h-64 flex-col gap-3 transition hover:-translate-y-0.5 hover:border-carolina hover:shadow-md"
                >
                  <div className="flex flex-wrap gap-2">
                    {attr(item, "department") ? (
                      <Badge variant="primary">
                        {departmentLabel(attr(item, "department") as string)}
                      </Badge>
                    ) : null}
                    <SourceBadge source={item.source} />
                    {item.featured ? <Badge variant="featured">Featured</Badge> : null}
                  </div>
                  <h2 className="text-lg">
                    {/* Stretched link: the whole card opens the prompt, but the
                        card stays a single link for screen readers and Tab. */}
                    <Link
                      className="after:absolute after:inset-0 after:rounded-xl after:content-[''] hover:text-carolina focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-carolina focus-visible:after:ring-offset-2"
                      href={`/prompts/${item.slug}`}
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted">{item.summary}</p>
                  {typeof item.attributes.prompt === "string" ? (
                    // Above the stretched link so the buttons stay clickable.
                    <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
                      <CopyPromptButton
                        text={item.attributes.prompt}
                        onCopied={() => recordCopy(item.slug)}
                      />
                      <Button
                        variant="secondary"
                        type="button"
                        aria-label={`Preview ${item.title}`}
                        onClick={() => setPreview(item)}
                      >
                        Preview
                      </Button>
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {preview ? (
        <PromptPreviewDialog
          item={preview}
          departmentLabel={attr(preview, "department") ? departmentLabel(attr(preview, "department") as string) : undefined}
          onClose={() => setPreview(null)}
          onCopied={() => recordCopy(preview.slug)}
        />
      ) : null}
    </div>
  );
}
