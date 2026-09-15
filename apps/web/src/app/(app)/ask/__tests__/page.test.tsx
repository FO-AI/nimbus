import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import AskPage from "@/app/(app)/ask/page";

const ask = vi.fn();

vi.mock("@/lib/api/useApiClient", () => ({
  useApiClient: () => ({ ask }),
}));

describe("AskPage", () => {
  it("renders markdown in the assistant's answer instead of literal syntax", async () => {
    ask.mockResolvedValueOnce({
      answer:
        "Yes. **PositionIQ** is an AI project with **Human Resources listed as a sponsor**.",
      citations: [
        { sourceType: "project", sourceKey: "positioniq", title: "PositionIQ", kind: "project" },
      ],
      grounded: true,
    });

    const user = userEvent.setup();
    render(<AskPage />);

    await user.type(screen.getByLabelText("Question"), "Is there any project in HR?");
    await user.click(screen.getByRole("button", { name: "Ask" }));

    const bold = await screen.findByText("PositionIQ", { selector: "strong" });
    expect(bold).toBeInTheDocument();

    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument();
  });

  it("warns when the answer is not backed by a Nimbus page", async () => {
    ask.mockResolvedValueOnce({
      answer: "Yes, you can paste anything into any AI tool.",
      citations: [
        { sourceType: "content", sourceKey: "sensitive-data", title: "Sensitive data", kind: "guidance" },
      ],
      grounded: false,
    });

    const user = userEvent.setup();
    render(<AskPage />);

    await user.type(screen.getByLabelText("Question"), "Can I paste Tier 3 data?");
    await user.click(screen.getByRole("button", { name: "Ask" }));

    expect(await screen.findByText(/not backed by a Nimbus page/)).toBeInTheDocument();
    // The pages are still offered, but not as the answer's basis.
    expect(screen.getByText("Related pages you could check")).toBeInTheDocument();
    expect(screen.queryByText("Where this answer came from")).not.toBeInTheDocument();
  });

  it("says nothing about grounding when the answer is cited", async () => {
    ask.mockResolvedValueOnce({
      answer: "Tier 3 data stays out of Copilot.",
      citations: [
        { sourceType: "content", sourceKey: "sensitive-data", title: "Sensitive data", kind: "guidance" },
      ],
      grounded: true,
    });

    const user = userEvent.setup();
    render(<AskPage />);

    await user.type(screen.getByLabelText("Question"), "Can I paste Tier 3 data?");
    await user.click(screen.getByRole("button", { name: "Ask" }));

    expect(await screen.findByText("Where this answer came from")).toBeInTheDocument();
    expect(screen.queryByText(/not backed by a Nimbus page/)).not.toBeInTheDocument();
  });

  it("names the minimum length that unlocks the Ask button", async () => {
    const user = userEvent.setup();
    render(<AskPage />);

    expect(screen.getByText(/Type at least 3 characters/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ask" })).toBeDisabled();

    await user.type(screen.getByLabelText("Question"), "AI");
    expect(screen.getByRole("button", { name: "Ask" })).toBeDisabled();

    await user.type(screen.getByLabelText("Question"), "?");
    expect(screen.getByRole("button", { name: "Ask" })).toBeEnabled();
  });
});
