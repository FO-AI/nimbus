"use client";

import Link from "next/link";

import { ResponsiveNavBar, type ResponsiveNavItem } from "@/components/ResponsiveNavBar";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

// Every destination carries a one-line description. Grouped items show it under
// the label in the dropdown; top-level items show it on hover (and under the
// label in the mobile panel), so no item in the bar is a bare word you have to
// click to understand.
export const nimbusNavigationItems: ResponsiveNavItem[] = [
  { href: "/home", label: "Home", match: "exact", description: "Start here" },
  {
    label: "Resources",
    items: [
      {
        href: "/guides",
        label: "Guides",
        match: "prefix",
        description: "How to do a task with AI, what's allowed, and which tools are approved",
      },
      {
        href: "/prompts",
        label: "Prompts",
        match: "prefix",
        description: "Ready-made instructions you can copy into an AI tool",
      },
    ],
  },
  {
    href: "/projects",
    label: "Projects",
    match: "prefix",
    description: "What Finance & Operations is already doing with AI",
  },
  {
    href: "/ask",
    label: "Ask Nimbus",
    match: "exact",
    description: "Ask a question and get an answer with links to where it came from",
  },
  {
    href: "/insights",
    label: "Usage",
    match: "exact",
    description: "How much Nimbus is being used — counts only, never per person",
  },
  {
    href: "/profile",
    label: "Profile",
    match: "exact",
    description: "Your account and what you can do in Nimbus",
  },
];

export function AppNavBar() {
  const { isAuthenticated, account, login, logout } = useAuth();

  return (
    <ResponsiveNavBar
      ariaLabel="Nimbus navigation"
      desktopBreakpoint="lg"
      brand={
        <Link href="/home" className="flex items-center gap-3 text-navy hover:text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-carolina text-sm font-bold text-navy">
            N
          </span>
          <span className="text-lg font-semibold tracking-normal">Nimbus</span>
        </Link>
      }
      items={nimbusNavigationItems}
      renderAuthActions={() =>
        isAuthenticated ? (
          <>
            {account ? <span className="text-xs text-muted">{account.name}</span> : null}
            <Button variant="secondary" size="sm" type="button" onClick={logout}>
              Sign out
            </Button>
          </>
        ) : (
          <Button size="sm" type="button" onClick={() => login()}>
            Sign in
          </Button>
        )
      }
    />
  );
}
