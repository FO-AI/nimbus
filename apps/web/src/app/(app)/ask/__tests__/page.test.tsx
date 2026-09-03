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
});
