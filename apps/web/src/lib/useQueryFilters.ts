"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Filter state that lives in the URL query string, so it survives Back/Forward
 * and can be shared as a link.
 *
 * Writes go through `history.replaceState`, which the App Router intercepts and
 * feeds back into `useSearchParams` — no server round trip, and no history entry
 * per chip click (Back leaves the page rather than undoing one filter at a time).
 *
 * Any component calling this must sit under a `<Suspense>` boundary: Next 16
 * fails the production build otherwise, because `useSearchParams` opts the tree
 * out of prerendering.
 */
export function useQueryFilters() {
  const searchParams = useSearchParams();

  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}`,
      );
    },
    [searchParams],
  );

  /**
   * Read one filter from the URL, falling back when the value matches nothing.
   *
   * A stale or hand-edited param that no longer corresponds to an option would
   * otherwise leave a control showing a selection that filters nothing out.
   * While the options are still loading the URL is trusted, so the controls
   * don't flicker to the fallback and back on first paint.
   */
  const readFilter = useCallback(
    <TFallback extends string | null>(
      key: string,
      options: readonly string[],
      { loading = false, fallback }: { loading?: boolean; fallback: TFallback },
    ): string | TFallback => {
      const value = searchParams.get(key);
      if (!value) return fallback;
      return loading || options.includes(value) ? value : fallback;
    },
    [searchParams],
  );

  return { searchParams, setFilters, readFilter };
}
