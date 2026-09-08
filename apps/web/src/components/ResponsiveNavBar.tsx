"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface ResponsiveNavLink {
  href: string;
  label: string;
  match?: "exact" | "prefix";
  /** One line under the label inside a group; what makes a grouped nav legible on first visit. */
  description?: string;
}

/** A labelled set of links: a dropdown on desktop, an indented sub-list on mobile. */
export interface ResponsiveNavGroup {
  label: string;
  items: ResponsiveNavLink[];
}

export type ResponsiveNavItem = ResponsiveNavLink | ResponsiveNavGroup;

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
    link: "md:min-h-0 md:w-auto md:px-0 md:py-0 md:hover:bg-transparent",
    activeLink: "md:px-3 md:py-1.5 md:hover:bg-cloud",
    desktopOnly: "hidden md:block",
    mobileOnly: "md:hidden",
  },
  lg: {
    panel:
      "lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-x-4 lg:gap-y-2 lg:border-0 lg:pt-0",
    action:
      "lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:pt-0 lg:[&>a]:w-auto lg:[&>button]:w-auto",
    toggle: "lg:hidden",
    link: "lg:min-h-0 lg:w-auto lg:px-0 lg:py-0 lg:hover:bg-transparent",
    activeLink: "lg:px-3 lg:py-1.5 lg:hover:bg-cloud",
    desktopOnly: "hidden lg:block",
    mobileOnly: "lg:hidden",
  },
} as const;

type BreakpointStyles = (typeof breakpointStyles)[keyof typeof breakpointStyles];

const breakpointQueries = {
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
} as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carolina focus-visible:ring-offset-2";

function isGroup(item: ResponsiveNavItem): item is ResponsiveNavGroup {
  return "items" in item;
}

function isItemActive(item: ResponsiveNavLink, pathname: string) {
  if (!item.match) return false;
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function ResponsiveNavBar({
  ...props
}: ResponsiveNavBarProps) {
  const pathname = usePathname();
  // Remounting on route change resets every open panel and dropdown at once.
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

    const handleEscape = (event: globalThis.KeyboardEvent) => {
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
            "hover:border-carolina hover:bg-cloud",
            focusRing,
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
          {items.map((item) =>
            isGroup(item) ? (
              <NavGroup
                key={item.label}
                group={item}
                pathname={pathname}
                styles={styles}
                onNavigate={closeMenu}
              />
            ) : (
              <NavLink
                key={item.href}
                item={item}
                active={isItemActive(item, pathname)}
                styles={styles}
                onNavigate={closeMenu}
              />
            ),
          )}
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

function NavLink({
  item,
  active,
  styles,
  onNavigate,
}: {
  item: ResponsiveNavLink;
  active: boolean;
  styles: BreakpointStyles;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-navy",
        focusRing,
        active ? "border border-carolina/35 bg-cloud" : "hover:bg-cloud",
        styles.link,
        active && styles.activeLink,
      )}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

/**
 * Renders a group both ways and lets CSS pick one per breakpoint: an indented
 * sub-list inside the stacked mobile panel, and a menu-button dropdown on
 * desktop. Dropdowns inside a stacked panel are awkward to use, so mobile never
 * gets one.
 */
function NavGroup({
  group,
  pathname,
  styles,
  onNavigate,
}: {
  group: ResponsiveNavGroup;
  pathname: string;
  styles: BreakpointStyles;
  onNavigate: () => void;
}) {
  const labelId = `navgroup-${useId().replaceAll(":", "")}`;

  return (
    <>
      <div
        role="group"
        aria-labelledby={labelId}
        className={cn("flex w-full flex-col gap-1", styles.mobileOnly)}
      >
        <div
          id={labelId}
          className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
        >
          {group.label}
        </div>
        {group.items.map((item) => {
          const active = isItemActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "ml-3 flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 text-navy",
                focusRing,
                active ? "border border-carolina/35 bg-cloud" : "hover:bg-cloud",
              )}
              onClick={onNavigate}
            >
              <span>{item.label}</span>
              {item.description ? (
                <span className="text-xs font-normal text-muted">{item.description}</span>
              ) : null}
            </Link>
          );
        })}
      </div>
      <div className={cn("relative", styles.desktopOnly)}>
        <NavDropdown group={group} pathname={pathname} onNavigate={onNavigate} />
      </div>
    </>
  );
}

const HOVER_CLOSE_DELAY_MS = 150;

/** WAI-ARIA menu-button pattern, plus hover open for mouse users. */
function NavDropdown({
  group,
  pathname,
  onNavigate,
}: {
  group: ResponsiveNavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Hover-opened menus close when the pointer leaves; a click "pins" them
  // instead of snapping shut, which is what hover-then-click users expect.
  const openedByHover = useRef(false);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const baseId = useId().replaceAll(":", "");
  const triggerId = `navmenu-trigger-${baseId}`;
  const menuId = `navmenu-${baseId}`;
  const active = group.items.some((item) => isItemActive(item, pathname));

  const menuItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  const close = (restoreFocus = false) => {
    clearTimeout(leaveTimer.current);
    openedByHover.current = false;
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const openAndFocus = (where: "first" | "last") => {
    pendingFocus.current = where;
    openedByHover.current = false;
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const items = menuItems();
    (pendingFocus.current === "last" ? items[items.length - 1] : items[0])?.focus();
    pendingFocus.current = null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        event.preventDefault();
        if (open && event.key !== "ArrowDown") close();
        else openAndFocus("first");
        break;
      case "ArrowUp":
        event.preventDefault();
        openAndFocus("last");
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close(true);
        }
        break;
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = menuItems();
    const index = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        // Let focus move on naturally; just don't leave the menu hanging open.
        close();
        break;
    }
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (open && !wrapperRef.current?.contains(event.relatedTarget as Node | null)) close();
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => {
        clearTimeout(leaveTimer.current);
        if (!open) {
          openedByHover.current = true;
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (!openedByHover.current) return;
        leaveTimer.current = setTimeout(() => close(), HOVER_CLOSE_DELAY_MS);
      }}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        data-active={active || undefined}
        className={cn(
          "inline-flex min-h-0 items-center gap-1 rounded-lg text-navy transition-colors",
          focusRing,
          active
            ? "border border-carolina/35 bg-cloud px-3 py-1.5 hover:bg-cloud"
            : "px-0 hover:text-carolina",
          open && "text-carolina",
        )}
        onClick={() => {
          if (open && openedByHover.current) {
            openedByHover.current = false;
            return;
          }
          if (open) close();
          else {
            openedByHover.current = false;
            setOpen(true);
          }
        }}
        onKeyDown={onTriggerKeyDown}
      >
        {group.label}
        <ChevronIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={onMenuKeyDown}
          className="absolute left-0 top-full z-20 mt-2 w-72 rounded-xl border border-border bg-surface p-1.5 shadow-soft"
        >
          {group.items.map((item) => {
            const itemActive = isItemActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                tabIndex={-1}
                aria-current={itemActive ? "page" : undefined}
                className={cn(
                  "flex flex-col rounded-lg px-3 py-2 text-navy hover:bg-cloud",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-carolina",
                  itemActive && "border border-carolina/35 bg-cloud",
                )}
                onClick={() => {
                  close();
                  onNavigate();
                }}
              >
                <span>{item.label}</span>
                {item.description ? (
                  <span className="text-xs font-normal text-muted">{item.description}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={cn("h-4 w-4", className)} fill="none">
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
