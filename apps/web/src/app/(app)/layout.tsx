"use client";

import type { ReactNode } from "react";

import { AppNavBar } from "@/components/AppNavBar";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AppNavBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {isAuthenticated ? children : <AuthGate />}
      </main>
    </>
  );
}
