"use client";

import { useAuth } from "@/lib/auth/AuthProvider";

export function AuthDisabledBanner() {
  const { authDisabled } = useAuth();

  if (!authDisabled) return null;

  return (
    <div className="border-b border-warning/20 bg-warning-bg px-4 py-2 text-center text-sm font-medium text-warning">
      Auth is disabled (local development mode). Do not use this configuration in a deployed
      environment.
    </div>
  );
}
