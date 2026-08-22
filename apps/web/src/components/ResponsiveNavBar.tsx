"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface ResponsiveNavItem {
  href: string;
  label: string;
  match?: "exact" | "prefix";
}

interface ResponsiveNavBarProps {
  ariaLabel: string;
  brand: ReactNode;
  items: ResponsiveNavItem[];
  renderAuthActions: (closeMenu: () => void) => ReactNode;
  desktopBreakpoint: "md" | "lg";
}

const breakpointStyles = {
  md: {
    panel:
      "md:flex md:w-auto md:flex-row md:items-center md:gap-x-5 md:gap-y-2 md:border-0 md:pt-0",
    action:
      "md:w-auto md:flex-row md:items-center md:border-0 md:pt-0 md:[&>a]:w-auto md:[&>button]:w-auto",
    toggle: "md:hidden",
  },
  lg: {
    panel:
      "lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-x-4 lg:gap-y-2 lg:border-0 lg:pt-0",
    action:
      "lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:pt-0 lg:[&>a]:w-auto lg:[&>button]:w-auto",
    toggle: "lg:hidden",
  },
} as const;

const breakpointQueries = {
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
} as const;

function isItemActive(item: ResponsiveNavItem, pathname: string) {
  if (!item.match) return false;
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function ResponsiveNavBar({
  ...props
}: ResponsiveNavBarProps) {
  const pathname = usePathname();
  return <ResponsiveNavBarContent key={pathname} {...props} pathname={pathname} />;
}

function ResponsiveNavBarContent({
  ariaLabel,
  brand,
  items,
  renderAuthActions,
  desktopBreakpoint,
  pathname,
}: ResponsiveNavBarProps & { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = `navigation-${useId().replaceAll(":", "")}`;
  const styles = breakpointStyles[desktopBreakpoint];

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia(breakpointQueries[desktopBreakpoint]);
    const closeAtDesktop = () => {
      if (mediaQuery.matches) setIsOpen(false);
    };

    mediaQuery.addEventListener("change", closeAtDesktop);
    window.addEventListener("resize", closeAtDesktop);
    return () => {
      mediaQuery.removeEventListener("change", closeAtDesktop);
      window.removeEventListener("resize", closeAtDesktop);
    };
  }, [desktopBreakpoint]);

  return (
    <nav aria-label={ariaLabel} className="border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3 sm:px-6">
        {brand}
        <button
          ref={toggleRef}
          type="button"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-navy shadow-sm transition-colors",
            "hover:border-carolina hover:bg-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carolina focus-visible:ring-offset-2",
            styles.toggle,
          )}
          aria-controls={panelId}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Close" : "Open"} ${ariaLabel}`}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div
          id={panelId}
          data-state={isOpen ? "open" : "closed"}
          className={cn(
            isOpen ? "flex" : "hidden",
            "w-full flex-col gap-1 border-t border-border pt-3 text-sm font-medium",
            styles.panel,
          )}
        >
          {items.map((item) => {
            const active = isItemActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-navy",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carolina focus-visible:ring-offset-2",
                  active ? "border border-carolina/35 bg-cloud" : "hover:bg-cloud",
                  desktopBreakpoint === "md"
                    ? "md:min-h-0 md:w-auto md:px-0 md:py-0 md:hover:bg-transparent"
                    : "lg:min-h-0 lg:w-auto lg:px-0 lg:py-0 lg:hover:bg-transparent",
                  active &&
                    (desktopBreakpoint === "md"
                      ? "md:px-3 md:py-1.5 md:hover:bg-cloud"
                      : "lg:px-3 lg:py-1.5 lg:hover:bg-cloud"),
                )}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
          <div
            className={cn(
              "flex w-full flex-col gap-2 border-t border-border pt-3 [&>a]:w-full [&>button]:w-full",
              styles.action,
            )}
            onClick={closeMenu}
          >
            {renderAuthActions(closeMenu)}
          </div>
        </div>
      </div>
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
