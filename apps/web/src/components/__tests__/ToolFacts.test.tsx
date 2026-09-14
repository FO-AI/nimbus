import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToolFacts } from "@/components/ToolFacts";
import type { ContentDetail } from "@/types";

function tool(attributes: Record<string, unknown>): ContentDetail {
  return {
    slug: "copilot-chat",
    kind: "tool",
    title: "Copilot Chat",
    summary: "A tool.",
    tags: [],
    attributes,
    source: null,
    featured: false,
    updatedAt: "2026-09-08T00:00:00Z",
    bodyMd: "",
    related: [],
  };
}

describe("ToolFacts", () => {
  it("surfaces the registry fields a reader needs before pasting anything", () => {
    render(
      ToolFacts({
        item: tool({
          status: "approved",
          access: "Anyone with an active Onyen",
          data_tier: "Tier 1 and 2; never Tier 3",
          owner_dept: "ITS",
          owner_contact: "ITS Service Desk — 919-962-HELP",
          url: "https://m365.cloud.microsoft/chat/",
        }),
      }),
    );

    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Tier 1 and 2; never Tier 3")).toBeInTheDocument();
    expect(screen.getByText("Anyone with an active Onyen")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open the tool/ })).toHaveAttribute(
      "href",
      "https://m365.cloud.microsoft/chat/",
    );
  });

  it("labels a status the library actually ships", () => {
    // copilot-studio.md carries `status: approved by request`, which had no
    // entry and reached the reader as the raw stored string.
    render(ToolFacts({ item: tool({ status: "approved by request", data_tier: "Tier 2" }) }));

    expect(screen.getByText("Approved on request")).toBeInTheDocument();
    expect(screen.queryByText("approved by request")).not.toBeInTheDocument();
  });

  it("never prints an unmapped status back at the reader", () => {
    render(ToolFacts({ item: tool({ status: "sort-of-ok", data_tier: "Tier 2" }) }));

    expect(screen.getByText("Status not confirmed")).toBeInTheDocument();
    expect(screen.queryByText("sort-of-ok")).not.toBeInTheDocument();
  });

  it("renders nothing when a page carries no registry attributes", () => {
    const { container } = render(ToolFacts({ item: tool({}) }));
    expect(container).toBeEmptyDOMElement();
  });
});
