import type { SourceRef } from "@/types";

import { Badge } from "@/components/ui";

/**
 * Renders a content item's provenance.
 *
 * `link` items are summaries of a page that remains the authority, so the
 * outbound link is the point — it gets a callout. `import` items carry
 * somebody else's licence, so attribution has to travel with the content and
 * sits quietly at the foot of the page. `practice` marks public exercise
 * material.
 */
export function SourceNote({ source }: { source: SourceRef }) {
  if (source.mode === "link") {
    return (
      <div className="rounded-xl border border-carolina/30 bg-cloud/60 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-carolina">
          Authoritative source
        </div>
        <p className="mt-2 text-sm text-navy">
          This page summarizes guidance published by{" "}
          <strong className="font-semibold">{source.publisher}</strong>. Where the two
          differ, the original is correct.
        </p>
        <a
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-carolina underline underline-offset-2 hover:text-navy"
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {source.title ?? source.url}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        {source.retrieved ? (
          <p className="mt-2 text-xs text-muted">Summarized from the page as of {source.retrieved}.</p>
        ) : null}
      </div>
    );
  }

  if (source.mode === "practice") {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Practice material
        </div>
        <p className="mt-2 text-sm text-muted">
          Uses a public UNC document as safe, Tier 0 exercise material.{" "}
          <a
            className="font-semibold text-carolina underline underline-offset-2"
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {source.title ?? "Open the document"} ↗
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4 text-sm text-muted">
      <p>
        {source.adapted ? "Adapted for UNC from " : "From "}
        <a
          className="font-medium text-carolina underline underline-offset-2"
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {source.title ?? source.url} ↗
        </a>
        {source.attribution ? <> by {source.attribution}</> : null}.
      </p>
      {source.license ? (
        <p className="mt-1">
          Licensed under{" "}
          {source.licenseUrl ? (
            <a
              className="font-medium text-carolina underline underline-offset-2"
              href={source.licenseUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {source.license}
            </a>
          ) : (
            source.license
          )}
          . This adaptation is shared under the same terms.
        </p>
      ) : null}
    </div>
  );
}

/** Compact provenance marker for list cards. */
export function SourceBadge({ source }: { source: SourceRef | null }) {
  if (!source) return null;
  if (source.mode === "link") return <Badge>Links out</Badge>;
  if (source.mode === "practice") return <Badge>Practice</Badge>;
  return <Badge>Adapted</Badge>;
}
