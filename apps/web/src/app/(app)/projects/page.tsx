"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { STATUS_HINTS, STATUS_LABELS, StatusPill } from "@/components/StatusPill";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  FilterChip,
  FilterGroup,
  Input,
  PageHeader,
} from "@/components/ui";
import { useApiClient } from "@/lib/api/useApiClient";
import { SOURCE_HINTS, SOURCE_LABELS } from "@/lib/projectSource";
import type { MeResponse, Project, ProjectSource, ProjectStatus } from "@/types";

const STAGE_ORDER: ProjectStatus[] = [
  "proposed",
  "idea",
  "pilot",
  "active",
  "paused",
  "done",
  "rejected",
];

// Derived, not retyped: these chips, the status pills in the table, and the
// admin edit dropdown must say the same words, and a second copy of the
// wording is how they drift apart.
const STATUS_FILTERS: { label: string; status: ProjectStatus | null; hint: string }[] = [
  { label: "All", status: null, hint: "Every project, at any stage" },
  ...STAGE_ORDER.map((status) => ({
    label: STATUS_LABELS[status],
    status,
    hint: STATUS_HINTS[status],
  })),
];

// The badge word is what a reader sees on the row, so the chip uses the same
// word and the hint carries the explanation.
const SOURCE_FILTERS: { label: string; source: ProjectSource | null; hint: string }[] = [
  { label: "Any", source: null, hint: "However the project got onto this list" },
  {
    label: SOURCE_LABELS.proposed,
    source: "proposed",
    hint: SOURCE_HINTS.proposed,
  },
  {
    label: SOURCE_LABELS.inventoried,
    source: "inventoried",
    hint: SOURCE_HINTS.inventoried,
  },
];

const STALE_DAYS = 90;

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function updatedLabel(iso: string): string {
  const days = daysSince(iso);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function ProjectsPage() {
  const api = useApiClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [source, setSource] = useState<ProjectSource | null>(null);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, profile] = await Promise.all([
        api.listProjects({ includeArchived: showArchived }),
        api.getMe(),
      ]);
      setProjects(list.items);
      setMe(profile);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [api, showArchived]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const departments = useMemo(() => {
    const all = new Set<string>();
    projects.forEach((p) => p.department && all.add(p.department));
    return Array.from(all).sort();
  }, [projects]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (status === null || p.status === status) &&
        (department === null || p.department === department) &&
        (source === null || p.source === source) &&
        (q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)),
    );
  }, [projects, status, department, source, search]);

  // The archived toggle changes what the request asks for, so it is a filter
  // like any other and "Clear filters" has to reset it — it used to leave the
  // list narrowed and the box ticked.
  const hasActiveFilters =
    status !== null ||
    department !== null ||
    source !== null ||
    search.trim() !== "" ||
    showArchived;

  // Only the filters applied in the browser narrow the loaded list; the
  // archived toggle re-fetches, so it changes both sides of "N of M" and
  // saying "12 of 12" would be noise.
  const narrowed = visible.length !== projects.length;

  const clearFilters = () => {
    setStatus(null);
    setDepartment(null);
    setSource(null);
    setSearch("");
    setShowArchived(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI projects"
        description="Everything Finance & Operations is doing with AI — who owns each one, what stage it has reached, and what happens next. Anyone can suggest an idea."
        actions={
          <div className="flex flex-wrap gap-2">
            {me?.isAdmin ? (
              <ButtonLink variant="secondary" href="/projects/inventory">
                Add an existing project
              </ButtonLink>
            ) : null}
            <ButtonLink href="/propose">Suggest an idea</ButtonLink>
          </div>
        }
      />

      {/* One bordered panel with every filter row labelled. These rows used to
          sit loose on the page with only aria-labels, so three visually
          identical chip rows gave no clue which axis each one filtered. */}
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-4">
        <Input
          type="search"
          className="max-w-md"
          placeholder="Search projects by name or summary…"
          aria-label="Search projects by name or summary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FilterGroup label="Stage" hint="Where the project has got to">
          {STATUS_FILTERS.map((f) => (
            <FilterChip
              key={f.label}
              type="button"
              active={status === f.status}
              title={f.hint}
              onClick={() => setStatus(f.status)}
            >
              {f.label}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label="How it got here" hint="A proposal from staff, or already in the inventory">
          {SOURCE_FILTERS.map((f) => (
            <FilterChip
              key={f.label}
              type="button"
              active={source === f.source}
              title={f.hint}
              onClick={() => setSource(f.source)}
            >
              {f.label}
            </FilterChip>
          ))}
        </FilterGroup>

        {departments.length > 1 ? (
          <FilterGroup label="Department" hint="Pick one to narrow the list">
            {departments.map((d) => (
              <FilterChip
                key={d}
                type="button"
                active={department === d}
                title={department === d ? `Remove the ${d} filter` : `Show only ${d} projects`}
                onClick={() => setDepartment(department === d ? null : d)}
              >
                {d}
              </FilterChip>
            ))}
          </FilterGroup>
        ) : null}

        {me?.isAdmin ? (
          // A toggle, not a third mutually-exclusive filter — so it gets its own
          // row and a checkbox rather than sitting among the radio-like chips.
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-xs accent-carolina"
              checked={showArchived}
              onChange={() => setShowArchived((v) => !v)}
            />
            Also show archived projects (closed or no longer being worked on)
          </label>
        ) : null}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects…" />
      ) : error ? (
        <ErrorState error={error} onRetry={load} />
      ) : visible.length === 0 ? (
        // An unfiltered empty list is a new install, not a bad search: offering
        // "Clear filters" there is a button that does nothing.
        hasActiveFilters ? (
          <EmptyState
            title="No projects match your filters"
            action={
              <Button variant="secondary" type="button" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          >
            <p>
              Try clearing the filters above, or{" "}
              <Link className="font-medium" href="/propose">
                suggest an idea of your own
              </Link>
              .
            </p>
          </EmptyState>
        ) : (
          <EmptyState
            title="No projects yet"
            action={<ButtonLink href="/propose">Suggest an idea</ButtonLink>}
          >
            <p>
              Nothing has been added to the register yet. Suggest the first one — it takes about
              two minutes.
            </p>
          </EmptyState>
        )
      ) : (
        <>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm text-muted" aria-live="polite">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
            {narrowed ? ` of ${projects.length}` : ""}
          </p>
          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" type="button" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-cloud/60 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr
                  key={p.id}
                  className={
                    p.archivedAt
                      ? "border-b border-border opacity-60 last:border-b-0"
                      : "border-b border-border last:border-b-0"
                  }
                >
                  <td className="px-4 py-3 align-top">
                    <Link className="font-medium" href={`/projects/${p.id}`}>
                      {p.name}
                    </Link>
                    <Badge
                      className="ml-2"
                      variant={p.source === "inventoried" ? "primary" : "default"}
                      title={SOURCE_HINTS[p.source]}
                    >
                      {SOURCE_LABELS[p.source]}
                    </Badge>
                    {p.archivedAt ? (
                      <Badge
                        className="ml-2"
                        variant="warning"
                        title="Closed or no longer being worked on. Hidden from the default list."
                      >
                        Archived
                      </Badge>
                    ) : null}
                    {me?.isAdmin && p.status === "proposed" ? (
                      <Badge
                        className="ml-2"
                        variant="featured"
                        title="Waiting for an admin to review it and decide what happens next"
                      >
                        Needs review
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">{p.department || "—"}</td>
                  <td className="px-4 py-3 align-top">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 align-top">{p.ownerEmail || "—"}</td>
                  {/* The amber date is the only thing flagging a stale project,
                      so it needs to say so rather than leaving the reader to
                      guess what the colour means. */}
                  <td
                    className={
                      daysSince(p.updatedAt) >= STALE_DAYS
                        ? "px-4 py-3 align-top text-warning"
                        : "px-4 py-3 align-top"
                    }
                    title={
                      daysSince(p.updatedAt) >= STALE_DAYS
                        ? `No update in over ${STALE_DAYS} days — may be out of date`
                        : undefined
                    }
                  >
                    {updatedLabel(p.updatedAt)}
                    {daysSince(p.updatedAt) >= STALE_DAYS ? (
                      <span className="sr-only"> — no update in over {STALE_DAYS} days</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        </>
      )}
    </div>
  );
}
