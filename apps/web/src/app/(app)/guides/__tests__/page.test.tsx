import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import GuidesPage from "@/app/(app)/guides/page";
import type { ContentSummary } from "@/types";

import { installHistorySync, setUrl, useSearchParamsMock } from "../../../../../test/urlSearchParams";

vi.mock("next/navigation", () => ({ useSearchParams: () => useSearchParamsMock() }));

function guide(
  slug: string,
  kind: ContentSummary["kind"],
  title: string,
  tags: string[],
): ContentSummary {
  return {
    slug,
    kind,
    title,
    summary: `About ${title}.`,
    tags,
    attributes: {},
    source: null,
    featured: false,
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

// Ten distinct tags, so the top-eight cut and the "More tags" disclosure both bite.
const RARE_TAG = "records-retention";
const items: ContentSummary[] = [
  guide("excel-variance", "playbook", "Budget variance in Excel", ["excel", "copilot", "finance"]),
  guide("inbox-triage", "playbook", "Inbox triage", ["outlook", "copilot", "email"]),
  guide("sensitive-data", "guidance", "Sensitive data", ["policy", "copilot", "privacy"]),
  guide("copilot-chat", "tool", "Copilot Chat", ["copilot", "chat"]),
  guide("retention", "guidance", "Keeping records", ["policy", RARE_TAG]),
  guide("promptlab", "tool", "PromptLab", ["copilot", "experiments", "sandbox"]),
];

// The client identity has to be stable: useContentList reloads whenever it changes.
const listContent = vi.fn();
const api = { listContent, recordContentEvent: vi.fn().mockResolvedValue(undefined) };
vi.mock("@/lib/api/useApiClient", () => ({ useApiClient: () => api }));

let restoreHistory: () => void;

describe("GuidesPage", () => {
  beforeEach(() => {
    listContent.mockResolvedValue({ items, total: items.length });
    restoreHistory = installHistorySync();
    setUrl("/guides");
  });

  afterEach(() => {
    restoreHistory();
    setUrl("/guides");
  });

  /** Waits past the loading state so the tag list and result count are populated. */
  async function renderGuides() {
    render(<GuidesPage />);
    return screen.findByText("6 guides");
  }

  it("applies the filters in the URL on first render, so a shared link reproduces the view", async () => {
    setUrl("/guides?kind=guidance&tag=policy");
    render(<GuidesPage />);

    await screen.findByText("2 guides of 6");
    expect(screen.getByRole("link", { name: /Sensitive data/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Inbox triage/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guidance" })).toHaveClass("bg-carolina");
    expect(screen.getByRole("button", { name: "policy" })).toHaveAttribute("aria-pressed", "true");
  });

  it("writes each filter to the query string so Back returns to the filtered list", async () => {
    const user = userEvent.setup();
    await renderGuides();

    await user.click(screen.getByRole("button", { name: "Playbooks" }));
    await waitFor(() => expect(window.location.search).toBe("?kind=playbook"));

    await user.click(screen.getByRole("button", { name: "copilot" }));
    await waitFor(() => expect(window.location.search).toBe("?kind=playbook&tag=copilot"));
    expect(await screen.findByText("2 guides of 6")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search guides" }), "inbox");
    await waitFor(() => expect(window.location.search).toContain("q=inbox"));
    expect(await screen.findByText("1 guide of 6")).toBeInTheDocument();
  });

  it("clicking the active tag again clears it", async () => {
    const user = userEvent.setup();
    await renderGuides();

    await user.click(screen.getByRole("button", { name: "copilot" }));
    await waitFor(() => expect(window.location.search).toBe("?tag=copilot"));

    await user.click(screen.getByRole("button", { name: "copilot" }));
    await waitFor(() => expect(window.location.search).toBe(""));
  });

  it("clears every filter, and the query string with them", async () => {
    const user = userEvent.setup();
    setUrl("/guides?kind=guidance&tag=policy&q=records");
    render(<GuidesPage />);

    await user.click(await screen.findByRole("button", { name: "Clear filters" }));

    await waitFor(() => expect(window.location.search).toBe(""));
    expect(await screen.findByText("6 guides")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search guides" })).toHaveValue("");
  });

  it("shows only the most common tags until the disclosure is opened", async () => {
    const user = userEvent.setup();
    await renderGuides();

    const tagFilters = screen.getByRole("group", { name: "Filter by tag" });
    expect(within(tagFilters).getAllByRole("button", { pressed: false })).toHaveLength(8);
    expect(within(tagFilters).queryByRole("button", { name: RARE_TAG })).not.toBeInTheDocument();

    const disclosure = screen.getByRole("button", { name: /More tags/ });
    expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await user.click(disclosure);

    expect(disclosure).toHaveAttribute("aria-expanded", "true");
    expect(within(tagFilters).getByRole("button", { name: RARE_TAG })).toBeInTheDocument();
  });

  it("keeps an uncommon tag visible when it arrives from the URL", async () => {
    setUrl(`/guides?tag=${RARE_TAG}`);
    render(<GuidesPage />);

    const chip = await screen.findByRole("button", { name: RARE_TAG });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /More tags/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("ignores a tag that no longer exists rather than showing an unexplained empty list", async () => {
    setUrl("/guides?tag=retired-tag");
    render(<GuidesPage />);

    expect(await screen.findByText("6 guides")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "retired-tag" })).not.toBeInTheDocument();
  });
});
