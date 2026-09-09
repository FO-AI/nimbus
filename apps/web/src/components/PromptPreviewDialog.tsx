"use client";

import { useEffect, useId, useRef } from "react";

import { CopyPromptButton } from "@/components/CopyPromptButton";
import { SourceBadge } from "@/components/SourceNote";
import { Badge, Button, ButtonLink } from "@/components/ui";
import type { ContentSummary } from "@/types";

interface Props {
  item: ContentSummary;
  /** Label for the department badge; the page owns the display mapping. */
  departmentLabel?: string;
  onClose: () => void;
  /** Called after a successful copy — the page records the usage event. */
  onCopied: () => void;
}

/**
 * Read a prompt before copying it, without leaving the library.
 *
 * Built on the native `<dialog>` opened with `showModal()`, which gives the
 * focus trap, `aria-modal`, and the Escape key for free. The dialog is mounted
 * only while open, so opening/closing is just mounting/unmounting; the effect
 * below owns everything that has to be undone on the way out.
 */
export function PromptPreviewDialog({ item, departmentLabel, onClose, onCopied }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { prompt, example_input, example_output, tool } = item.attributes;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    // Land on the primary action rather than the "×" that showModal() would pick.
    dialog.querySelector<HTMLElement>("[data-dialog-actions] button")?.focus();

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-labelledby={titleId}
      // Escape fires `cancel`; taking over here keeps React in charge of
      // unmounting. There is deliberately no `onClose` handler: the effect's
      // cleanup calls close(), and under StrictMode's double-invoked effects
      // that would re-enter onClose and unmount the dialog as it opened.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // The backdrop is a pseudo-element of the dialog, so a click on it targets
      // the dialog itself; the inner wrapper absorbs clicks on real content.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[min(100vw-2rem,44rem)] rounded-xl border border-border bg-surface p-0 text-foreground shadow-soft backdrop:bg-navy/50"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              {departmentLabel ? <Badge variant="primary">{departmentLabel}</Badge> : null}
              {typeof tool === "string" && tool ? <Badge>{tool}</Badge> : null}
              <SourceBadge source={item.source} />
            </div>
            <h2 id={titleId} className="text-lg">
              {item.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{item.summary}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            aria-label="Close preview"
            className="shrink-0 px-2"
            onClick={onClose}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
        </div>

        <div className="space-y-5 overflow-y-auto p-5">
          {typeof prompt === "string" ? (
            <section className="space-y-2">
              <h3>Prompt</h3>
              <pre className="whitespace-pre-wrap rounded-lg border border-border bg-cloud/70 p-4 font-mono text-sm text-navy">
                {prompt}
              </pre>
            </section>
          ) : null}
          {example_input || example_output ? (
            <section className="space-y-3">
              <h3>Example</h3>
              {example_input ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Input
                  </p>
                  <p className="text-sm text-muted">{String(example_input)}</p>
                </div>
              ) : null}
              {example_output ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    What a good result looks like
                  </p>
                  <p className="text-sm text-muted">{String(example_output)}</p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <div
          data-dialog-actions
          className="flex flex-wrap items-center gap-2 border-t border-border p-5"
        >
          {typeof prompt === "string" ? (
            <CopyPromptButton text={prompt} onCopied={onCopied} />
          ) : null}
          <ButtonLink variant="secondary" href={`/prompts/${item.slug}`}>
            Open full page
          </ButtonLink>
          <Button variant="ghost" type="button" className="ml-auto" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
