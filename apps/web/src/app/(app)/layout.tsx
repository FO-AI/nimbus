"use client";

import type { ReactNode } from "react";

import { AppNavBar } from "@/components/AppNavBar";
import { AuthGate } from "@/components/AuthGate";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();

  return (
    <>
      <AppNavBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {!isReady ? (
          // A persisted session is still being restored — showing the sign-in
          // prompt here would flash at every returning user.
          <div className="mt-10 flex justify-center">
            <LoadingSpinner label="Restoring your session…" />
          </div>
        ) : isAuthenticated ? (
          children
        ) : (
          <AuthGate />
        )}
      </main>
    </>
  );
}
