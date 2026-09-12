"use client";

import { useCallback, useEffect, useState } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, PageHeader } from "@/components/ui";
import { useApiClient } from "@/lib/api/useApiClient";
import { SUPPORT_EMAIL } from "@/lib/config";
import type { MeResponse } from "@/types";

export default function ProfilePage() {
  const api = useApiClient();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMe(await api.getMe());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your profile"
        description="Who Nimbus thinks you are, and what that lets you do. Nimbus reads this from your University sign-in — to change your name or email, contact ITS."
      />

      <Card>
        {loading ? (
          <LoadingSpinner label="Loading profile…" />
        ) : error ? (
          <ErrorState error={error} onRetry={load} />
        ) : me ? (
          <div className="space-y-5">
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[200px_1fr]">
              <dt className="font-medium text-muted">Name</dt>
              <dd>{me.name || "Not set"}</dd>
              <dt className="font-medium text-muted">Email</dt>
              <dd>{me.email || "Not set"}</dd>
              <dt className="font-medium text-muted">What you can do</dt>
              <dd>
                {me.isAdmin
                  ? "Browse everything, plus review, edit, and archive AI projects."
                  : "Browse guides and prompts, ask questions, and suggest new AI ideas."}
              </dd>
            </dl>

            {/* Identifiers matter only when someone is chasing a support ticket,
                so they sit behind a disclosure rather than heading the page with
                a GUID labelled "Subject". */}
            <details className="border-t border-border-subtle pt-4 text-sm">
              <summary className="cursor-pointer font-medium text-navy">
                Technical details (for IT support)
              </summary>
              <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-[200px_1fr]">
                <dt className="font-medium text-muted">Account ID</dt>
                <dd className="break-all font-mono text-xs">{me.subject}</dd>
                <dt className="font-medium text-muted">Roles</dt>
                <dd>{me.roles.length ? me.roles.join(", ") : "None"}</dd>
                <dt className="font-medium text-muted">Groups</dt>
                <dd className="break-all">{me.groups.length ? me.groups.join(", ") : "None"}</dd>
              </dl>
              <p className="mt-3 text-xs text-muted">
                Roles and groups come from your University account and control what you can see and
                edit here. Quote the Account ID if you contact{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> about access.
              </p>
            </details>
          </div>
        ) : null}
      </Card>

      {me?.isDevPrincipal ? (
        <p className="text-sm text-muted">
          <small>
            Sign-in is turned off for local development, so this is a placeholder test identity —
            not a real signed-in user.
          </small>
        </p>
      ) : null}
    </div>
  );
}
