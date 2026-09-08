"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, Card } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Shown in place of a gated page's content when the visitor isn't signed in.
 * The marketing pitch for Nimbus lives on the public "/" page — this is just
 * a lightweight nudge for anyone who deep-links straight into the product.
 */
export function AuthGate() {
  const { login } = useAuth();
  // Come back to the page that was deep-linked, not to the app's front door.
  const pathname = usePathname();

  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <h1 className="text-xl">Sign in to continue</h1>
      <p className="mt-2 text-sm text-muted">
        This part of Nimbus requires your organization account.
      </p>
      <div className="mt-5 flex flex-col items-center gap-3">
        <Button type="button" onClick={() => login(pathname ?? "/home")}>
          Sign in with Microsoft
        </Button>
        <Link href="/?stay=1" className="text-sm text-muted hover:text-carolina">
          ← Back to the FOAI initiative
        </Link>
      </div>
    </Card>
  );
}
