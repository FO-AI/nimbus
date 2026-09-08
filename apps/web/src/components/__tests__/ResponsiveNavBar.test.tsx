import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

const resourcesTrigger = () => screen.getByRole("button", { name: "Resources" });

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
    const guidesLink = screen.getByRole("link", { name: /^Guides/ });
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

  it("lists Guides and Prompts as described sub-items of a Resources group in the stacked panel", () => {
    render(<TestNav />);

    const group = screen.getByRole("group", { name: "Resources" });
    expect(within(group).getByRole("link", { name: /^Guides/ })).toHaveTextContent(
      "Playbooks, guidance, and the tool registry",
    );
    expect(within(group).getByRole("link", { name: /^Prompts/ })).toHaveTextContent(
      "Copy-paste prompts for everyday work",
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it.each([
    ["/home", /^Home$/],
    ["/guides", /^Guides/],
    ["/guides/budget-variance", /^Guides/],
    ["/prompts", /^Prompts/],
    ["/prompts/month-end", /^Prompts/],
    ["/projects", /^Projects$/],
    ["/projects/42", /^Projects$/],
    ["/ask", /^Ask$/],
    ["/insights", /^Insights$/],
    ["/profile", /^Profile$/],
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
      expect(resourcesTrigger()).not.toHaveAttribute("data-active");
    },
  );

  describe("Resources dropdown", () => {
    it("is a closed menu button by default", () => {
      render(<TestNav />);

      const trigger = resourcesTrigger();
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("toggles on click and lists described menu items", async () => {
      const user = userEvent.setup();
      render(<TestNav />);

      await user.click(resourcesTrigger());

      const trigger = resourcesTrigger();
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const menu = screen.getByRole("menu", { name: "Resources" });
      expect(trigger).toHaveAttribute("aria-controls", menu.id);
      const items = within(menu).getAllByRole("menuitem");
      expect(items.map((item) => item.getAttribute("href"))).toEqual(["/guides", "/prompts"]);
      expect(items[0]).toHaveTextContent("Playbooks, guidance, and the tool registry");
      expect(items[1]).toHaveTextContent("Copy-paste prompts for everyday work");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("opens on hover and closes once the pointer leaves", async () => {
      const user = userEvent.setup();
      render(<TestNav />);

      await user.hover(resourcesTrigger());
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.unhover(resourcesTrigger());
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    });

    it("opens with Enter, moves with arrow keys, and Escape returns focus to the trigger", async () => {
      const user = userEvent.setup();
      render(<TestNav />);

      resourcesTrigger().focus();
      await user.keyboard("{Enter}");

      const items = within(screen.getByRole("menu")).getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(items[1]).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(items[0]).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(items[1]).toHaveFocus();
      await user.keyboard("{End}");
      expect(items[1]).toHaveFocus();
      await user.keyboard("{Home}");
      expect(items[0]).toHaveFocus();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(resourcesTrigger()).toHaveFocus();
      expect(resourcesTrigger()).toHaveAttribute("aria-expanded", "false");
    });

    it("opens with Space and ArrowDown, and ArrowUp lands on the last item", async () => {
      const user = userEvent.setup();
      render(<TestNav />);

      resourcesTrigger().focus();
      await user.keyboard(" ");
      expect(within(screen.getByRole("menu")).getAllByRole("menuitem")[0]).toHaveFocus();
      await user.keyboard("{Escape}");

      await user.keyboard("{ArrowUp}");
      const items = within(screen.getByRole("menu")).getAllByRole("menuitem");
      expect(items[items.length - 1]).toHaveFocus();
    });

    it("closes when focus tabs out of the menu", async () => {
      const user = userEvent.setup();
      render(<TestNav />);

      resourcesTrigger().focus();
      await user.keyboard("{Enter}");
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.tab();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(resourcesTrigger()).not.toHaveFocus();
    });

    it("closes on an outside click", async () => {
      const user = userEvent.setup();
      render(<TestNav />);

      await user.click(resourcesTrigger());
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.click(document.body);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it.each(["/guides", "/guides/copilot-chat", "/prompts", "/prompts/vendor-email"])(
      "shows the trigger as active at %s and marks the matching item current",
      async (pathname) => {
        navigation.pathname = pathname;
        const user = userEvent.setup();
        render(<TestNav />);

        const trigger = resourcesTrigger();
        expect(trigger).toHaveAttribute("data-active", "true");
        expect(trigger).toHaveClass("bg-cloud");

        await user.click(trigger);
        const current = within(screen.getByRole("menu"))
          .getAllByRole("menuitem")
          .filter((item) => item.getAttribute("aria-current") === "page");
        expect(current).toHaveLength(1);
        expect(current[0]).toHaveAttribute("href", pathname.startsWith("/guides") ? "/guides" : "/prompts");
      },
    );
  });
});
