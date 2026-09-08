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

  return { searchParams, setFilters };
}
