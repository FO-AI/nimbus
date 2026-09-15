"use client";

import Link from "next/link";

import { ResponsiveNavBar, type ResponsiveNavItem } from "@/components/ResponsiveNavBar";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * A flat bar: every destination is one click away, and every label says what
 * it is rather than what it is called internally. Guides and Prompts used to
 * sit behind a "Resources" dropdown, which cost a click on the two most-used
 * pages and spent a nav slot on a filler word.
 *
 * Descriptions are not decoration — they are the hover explanation on desktop
 * and visible sub-text on mobile, so no item in the bar is a bare word you
 * have to click to understand. See docs/ui-vocabulary.md for the rules these
 * labels follow.
 */
export const nimbusNavigationItems: ResponsiveNavItem[] = [
  { href: "/home", label: "Home", match: "exact", description: "Start here" },
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
  {
    href: "/ask",
    label: "Ask",
    match: "exact",
    description: "Ask a question and get an answer with links to where it came from",
  },
  {
    href: "/projects",
    label: "AI projects",
    match: "prefix",
    description: "What Finance & Operations teams are building with AI, and how far along they are",
  },
  {
    href: "/insights",
    label: "Activity",
    match: "exact",
    description: "How much Nimbus is being used — totals only, never per person",
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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-carolina text-sm font-bold text-navy">
            N
          </span>
          {/* "Nimbus" alone says nothing about what the tool is. The subtitle is
              the only place a first-time visitor learns it on every page. */}
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-[-0.01em]">Nimbus</span>
            <span className="text-xs font-normal text-muted">
              AI help for Finance &amp; Operations
            </span>
          </span>
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
