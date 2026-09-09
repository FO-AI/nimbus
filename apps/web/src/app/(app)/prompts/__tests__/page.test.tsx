import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PromptsPage from "@/app/(app)/prompts/page";
import type { ContentSummary } from "@/types";

import { installHistorySync, setUrl, useSearchParamsMock } from "../../../../../test/urlSearchParams";

vi.mock("next/navigation", () => ({ useSearchParams: () => useSearchParamsMock() }));

function prompt(
  slug: string,
  title: string,
  department: string,
  tool: string,
  source: ContentSummary["source"] = null,
): ContentSummary {
  return {
    slug,
    kind: "prompt",
    title,
    summary: `Use this to ${title.toLowerCase()}.`,
    tags: [department.toLowerCase()],
    attributes: { prompt: `Prompt body for ${title}.`, department, tool },
    source,
    featured: false,
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

const items: ContentSummary[] = [
  prompt("vendor-email-draft", "Draft a vendor email", "Procurement", "Copilot Chat"),
  prompt("bid-comparison", "Compare bids", "Procurement", "Excel"),
  prompt("variance-narrative", "Write a variance narrative", "Finance", "Excel", {
    mode: "import",
    url: "https://example.org/library",
    adapted: true,
  }),
];

// The client identity has to be stable: useContentList reloads whenever it changes.
const listContent = vi.fn();
const recordContentEvent = vi.fn();
const api = { listContent, recordContentEvent };
vi.mock("@/lib/api/useApiClient", () => ({ useApiClient: () => api }));

let restoreHistory: () => void;

describe("PromptsPage", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    // After userEvent.setup(), which installs a getter-only clipboard stub.
    user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    writeText.mockClear();
    recordContentEvent.mockClear().mockResolvedValue(undefined);
    listContent.mockResolvedValue({ items, total: items.length });
    restoreHistory = installHistorySync();
    setUrl("/prompts");
  });

  afterEach(() => {
    restoreHistory();
    setUrl("/prompts");
  });

  it("applies the filters in the URL on first render", async () => {
    setUrl("/prompts?department=Finance&origin=adapted");
    render(<PromptsPage />);

    expect(await screen.findByText("1 prompt of 3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /variance narrative/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finance" })).toHaveClass("bg-carolina");
    expect(screen.getByRole("combobox", { name: "Origin" })).toHaveValue("adapted");
  });

  it("writes department, tool and search to the query string", async () => {
    render(<PromptsPage />);
    await screen.findByText("3 prompts");

    await user.click(screen.getByRole("button", { name: "Procurement" }));
    await waitFor(() => expect(window.location.search).toBe("?department=Procurement"));
    expect(await screen.findByText("2 prompts of 3")).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Tool" }), "Excel");
    await waitFor(() => expect(window.location.search).toBe("?department=Procurement&tool=Excel"));

    await user.type(screen.getByRole("textbox", { name: "Search prompts" }), "bids");
    await waitFor(() => expect(window.location.search).toContain("q=bids"));
    expect(await screen.findByText("1 prompt of 3")).toBeInTheDocument();
  });

  it("clears the filters and the query string together", async () => {
    setUrl("/prompts?department=Finance&q=variance");
    render(<PromptsPage />);

    await user.click(await screen.findByRole("button", { name: "Clear filters" }));

    await waitFor(() => expect(window.location.search).toBe(""));
    expect(await screen.findByText("3 prompts")).toBeInTheDocument();
  });

  it("previews a prompt before copying, and still records the copy", async () => {
    render(<PromptsPage />);
    await screen.findByText("3 prompts");

    await user.click(screen.getByRole("button", { name: "Preview Draft a vendor email" }));

    const dialog = screen.getByRole("dialog", { name: "Draft a vendor email" });
    expect(dialog).toHaveTextContent("Prompt body for Draft a vendor email.");

    // Scoped to the dialog: the cards behind it have their own copy buttons,
    // which a real browser makes inert but jsdom still exposes.
    await user.click(within(dialog).getByRole("button", { name: "Copy prompt" }));

    expect(writeText).toHaveBeenCalledWith("Prompt body for Draft a vendor email.");
    await waitFor(() =>
      expect(recordContentEvent).toHaveBeenCalledWith("vendor-email-draft", "copy"),
    );
  });

  it("offers a way out of an empty result set", async () => {
    setUrl("/prompts?q=nothing-matches-this");
    render(<PromptsPage />);

    const empty = await screen.findByText(/No prompts match/);
    await user.click(
      within(empty.closest("div[class*='rounded-xl']") as HTMLElement).getByRole("button", {
        name: "Clear filters",
      }),
    );

    expect(await screen.findByText("3 prompts")).toBeInTheDocument();
  });
});
