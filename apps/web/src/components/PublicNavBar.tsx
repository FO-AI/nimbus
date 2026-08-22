"use client";

import Link from "next/link";

import { ResponsiveNavBar } from "@/components/ResponsiveNavBar";
import { Button, ButtonLink } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

const publicNavigationItems = [
  { href: "/organization", label: "Organization" },
  { href: "/#steering-committee", label: "Steering Committee" },
  { href: "/#contact", label: "Contact" },
];

export function PublicNavBar() {
  const { isAuthenticated, login } = useAuth();

  return (
    <ResponsiveNavBar
      ariaLabel="FOAI navigation"
      desktopBreakpoint="md"
      brand={
        <Link href="/" className="flex items-center gap-3 text-navy hover:text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-carolina text-sm font-bold text-navy shadow-sm">
            F
          </span>
          <span className="text-lg font-semibold tracking-normal">FOAI</span>
        </Link>
      }
      items={publicNavigationItems}
      renderAuthActions={() =>
        isAuthenticated ? (
          <ButtonLink href="/home" size="sm">
            Open Nimbus
          </ButtonLink>
        ) : (
          <Button size="sm" type="button" onClick={() => login("/home")}>
            Sign in
          </Button>
        )
      }
    />
  );
}
