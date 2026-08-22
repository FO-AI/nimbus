import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { nimbusNavigationItems } from "@/components/AppNavBar";
import { ResponsiveNavBar } from "@/components/ResponsiveNavBar";

const navigation = vi.hoisted(() => ({ pathname: "/home" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

function TestNav({ onAction = vi.fn() }: { onAction?: () => void }) {
  return (
    <ResponsiveNavBar
      ariaLabel="Test navigation"
      brand={<a href="/home">Test brand</a>}
      items={nimbusNavigationItems}
      desktopBreakpoint="lg"
      renderAuthActions={() => (
        <button type="button" onClick={onAction}>
          Sign out
        </button>
      )}
    />
  );
}

function getControlledPanel(toggle: HTMLElement) {
  const panel = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
  if (!panel) throw new Error("Navigation toggle did not reference a panel");
  return panel;
}

describe("ResponsiveNavBar", () => {
  beforeEach(() => {
    navigation.pathname = "/home";
  });

  it("opens and closes an ARIA-linked disclosure panel", async () => {
    const user = userEvent.setup();
    render(<TestNav />);

    const openButton = screen.getByRole("button", { name: "Open Test navigation" });
    const panel = getControlledPanel(openButton);
    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("data-state", "closed");
    expect(panel).toHaveClass("hidden");

    await user.click(openButton);

    expect(screen.getByRole("button", { name: "Close Test navigation" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel).toHaveClass("flex");
  });

  it("closes on Escape and restores focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<TestNav />);

    await user.click(screen.getByRole("button", { name: "Open Test navigation" }));
    const guidesLink = screen.getByRole("link", { name: "Guides" });
    guidesLink.focus();
    fireEvent.keyDown(window, { key: "Escape" });

    const toggle = screen.getByRole("button", { name: "Open Test navigation" });
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when the current route changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TestNav />);

    await user.click(screen.getByRole("button", { name: "Open Test navigation" }));
    navigation.pathname = "/guides";
    rerender(<TestNav />);

    expect(screen.getByRole("button", { name: "Open Test navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("runs a mobile action and closes the panel", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<TestNav onAction={onAction} />);

    const toggle = screen.getByRole("button", { name: "Open Test navigation" });
    await user.click(toggle);
    const panel = getControlledPanel(toggle);
    await user.click(within(panel).getByRole("button", { name: "Sign out" }));

    expect(onAction).toHaveBeenCalledOnce();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it.each([
    ["/home", "Home"],
    ["/guides", "Guides"],
    ["/guides/budget-variance", "Guides"],
    ["/prompts", "Prompts"],
    ["/prompts/month-end", "Prompts"],
    ["/projects", "Projects"],
    ["/projects/42", "Projects"],
    ["/ask", "Ask"],
    ["/insights", "Insights"],
    ["/profile", "Profile"],
  ])("marks %s as the %s page", (pathname, label) => {
    navigation.pathname = pathname;
    render(<TestNav />);

    const activeLink = screen.getByRole("link", { name: label });
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveClass("border-carolina/35", "bg-cloud");
    expect(screen.getAllByRole("link").filter((link) => link.hasAttribute("aria-current"))).toEqual([
      activeLink,
    ]);
  });

  it.each(["/propose", "/home/extra", "/ask/history", "/insights/detail", "/profile/edit"])(
    "leaves primary navigation inactive at %s",
    (pathname) => {
      navigation.pathname = pathname;
      render(<TestNav />);

      expect(screen.queryByRole("link", { current: "page" })).not.toBeInTheDocument();
    },
  );
});
