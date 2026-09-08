"use client";

import Link from "next/link";

import { ResponsiveNavBar, type ResponsiveNavItem } from "@/components/ResponsiveNavBar";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

export const nimbusNavigationItems: ResponsiveNavItem[] = [
  { href: "/home", label: "Home", match: "exact" },
  {
    label: "Resources",
    items: [
      {
        href: "/guides",
        label: "Guides",
        match: "prefix",
        description: "Playbooks, guidance, and the tool registry",
      },
      {
        href: "/prompts",
        label: "Prompts",
        match: "prefix",
        description: "Copy-paste prompts for everyday work",
      },
    ],
  },
  { href: "/projects", label: "Projects", match: "prefix" },
  { href: "/ask", label: "Ask", match: "exact" },
  { href: "/insights", label: "Insights", match: "exact" },
  { href: "/profile", label: "Profile", match: "exact" },
];

export function AppNavBar() {
  const { isAuthenticated, account, login, logout } = useAuth();

  return (
    <ResponsiveNavBar
      ariaLabel="Nimbus navigation"
      desktopBreakpoint="lg"
      brand={
        <Link href="/home" className="flex items-center gap-3 text-navy hover:text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-carolina text-sm font-bold text-navy shadow-sm">
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
