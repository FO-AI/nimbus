"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";

/** Opt-out query flag for people who want the public page while signed in. */
export const STAY_PARAM = "stay";

/**
 * Returns true when the current URL asks to stay on the public page: either an
 * in-page anchor (so `/#steering-committee` still works for signed-in staff) or
 * an explicit `?stay=1`. Browser-only — call it from an effect.
 */
function wantsToStay(): boolean {
  if (window.location.hash) return true;
  return new URLSearchParams(window.location.search).has(STAY_PARAM);
}

/**
 * Sends an already-signed-in visitor from the public landing page straight to
 * the app, so a persisted session doesn't make them click "Sign in" again.
 *
 * `replace` keeps the landing page out of the history stack — pressing Back
 * from the app would otherwise bounce off this redirect.
 */
export function useSignedInRedirect(destination = "/home"): void {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (wantsToStay()) return;
    router.replace(destination);
  }, [destination, isAuthenticated, router]);
}
