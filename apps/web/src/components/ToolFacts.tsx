import type { ContentDetail } from "@/types";

import { Badge, ButtonLink, Card } from "@/components/ui";
import { attr } from "@/lib/contentAttributes";

function statusVariant(status: string) {
  if (status.startsWith("approved")) return "success" as const;
  if (status === "pilot" || status === "under-review") return "warning" as const;
  if (status === "retired") return "danger" as const;
  return "default" as const;
}

/**
 * Frontmatter ships these as slugs; "under-review" was rendering literally.
 * The set is closed and `test_tool_status_is_one_the_ui_can_label` in
 * `apps/api/app/tests/test_content_library.py` fails the build on a status
 * with no entry here — an unmapped one used to reach readers as a raw slug
 * with no tooltip, which is exactly what this map exists to prevent.
 */
const TOOL_STATUS_LABELS: Record<string, string> = {
  approved: "Approved",
  "approved by request": "Approved on request",
  pilot: "In pilot",
  "under-review": "Under review",
  retired: "Retired",
};

const TOOL_STATUS_HINTS: Record<string, string> = {
  approved: "Cleared for Finance & Operations use, within the data rules below",
  "approved by request":
    "Cleared for use, but you have to ask for access before you can start",
  pilot: "Being trialled with a small group — check before relying on it",
  "under-review": "Not yet cleared for use; the review is still in progress",
  retired: "No longer supported. Do not start anything new with this tool.",
};

/** Belt and braces for a status that slips past the library lint. */
const UNKNOWN_STATUS_LABEL = "Status not confirmed";
const UNKNOWN_STATUS_HINT =
  "This tool's status has not been recorded. Check with the Finance & Operations AI team before using it.";

/**
 * The registry facts for a `kind: tool` page — status, who can use it, what
 * data it accepts, and who owns it.
 *
 * These live in `attributes` and had no rendering, which made the tool
 * registry's most load-bearing field (the data tier) invisible to the person
 * deciding whether to paste something in.
 */
export function ToolFacts({ item }: { item: ContentDetail }) {
  const status = attr(item, "status");
  const access = attr(item, "access");
  const dataTier = attr(item, "data_tier");
  const owner = attr(item, "owner_dept");
  const contact = attr(item, "owner_contact");
  const url = attr(item, "url");

  if (!status && !access && !dataTier && !owner) return null;

  const rows: { label: string; value: string }[] = [];
  if (access) rows.push({ label: "Who can use it", value: access });
  if (dataTier) rows.push({ label: "Data it accepts", value: dataTier });
  if (owner) rows.push({ label: "Owned by", value: owner });
  if (contact) rows.push({ label: "Support", value: contact });

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Tool registry
          </span>
          {status ? (
            <Badge
              variant={TOOL_STATUS_LABELS[status] ? statusVariant(status) : "warning"}
              title={TOOL_STATUS_HINTS[status] ?? UNKNOWN_STATUS_HINT}
            >
              {TOOL_STATUS_LABELS[status] ?? UNKNOWN_STATUS_LABEL}
            </Badge>
          ) : null}
        </div>
        {url ? (
          <ButtonLink href={url} target="_blank" rel="noreferrer noopener" size="sm">
            Open the tool ↗<span className="sr-only"> (opens in a new tab)</span>
          </ButtonLink>
        ) : null}
      </div>

      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-sm font-semibold text-muted">{row.label}</dt>
            <dd className="text-sm text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
