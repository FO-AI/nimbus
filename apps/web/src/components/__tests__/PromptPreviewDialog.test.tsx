import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PromptPreviewDialog } from "@/components/PromptPreviewDialog";
import type { ContentSummary } from "@/types";

const item: ContentSummary = {
  slug: "vendor-email-draft",
  kind: "prompt",
  title: "Vendor email draft",
  summary: "Draft a courteous follow-up to a vendor.",
  tags: ["procurement"],
  attributes: {
    prompt: "Write a short, polite email to {vendor} asking for {thing}.",
    department: "Procurement",
    tool: "Copilot Chat",
    example_input: "Vendor: Acme. Thing: the revised quote.",
    example_output: "A three-sentence email with a clear ask and a deadline.",
  },
  source: null,
  featured: false,
  updatedAt: "2026-01-01T00:00:00Z",
};

function Harness({ onCopied = vi.fn() }: { onCopied?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Preview
      </button>
      {open ? (
        <PromptPreviewDialog
          item={item}
          departmentLabel="Procurement"
          onClose={() => setOpen(false)}
          onCopied={onCopied}
        />
      ) : null}
    </>
  );
}

describe("PromptPreviewDialog", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    // Order matters: userEvent.setup() installs its own getter-only clipboard
    // stub, so ours has to be defined (defineProperty, not assignment) after it.
    user = userEvent.setup();
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    document.body.style.overflow = "";
  });

  it("opens as a labelled modal showing the prompt and example, with focus on the primary action", async () => {
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Preview" }));

    const dialog = screen.getByRole("dialog", { name: "Vendor email draft" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText(/Write a short, polite email/)).toBeInTheDocument();
    expect(screen.getByText("Vendor: Acme. Thing: the revised quote.")).toBeInTheDocument();
    expect(screen.getByText(/three-sentence email/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open full page" })).toHaveAttribute(
      "href",
      "/prompts/vendor-email-draft",
    );
    expect(screen.getByRole("button", { name: "Copy prompt" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("copies the prompt from inside the dialog and reports it", async () => {
    const onCopied = vi.fn();
    render(<Harness onCopied={onCopied} />);

    await user.click(screen.getByRole("button", { name: "Preview" }));
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));

    expect(writeText).toHaveBeenCalledWith(item.attributes.prompt);
    await waitFor(() => expect(onCopied).toHaveBeenCalledOnce());
  });

  it("closes on cancel (Escape), restores focus and scrolling", async () => {
    render(<Harness />);

    const trigger = screen.getByRole("button", { name: "Preview" });
    await user.click(trigger);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on a backdrop click but not on a click inside the content", async () => {
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Preview" }));
    const dialog = screen.getByRole("dialog");

    fireEvent.click(screen.getByText(/Write a short, polite email/));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Regression: the dialog used to forward the native `close` event to onClose,
  // so StrictMode's double-invoked effect closed it again as it opened.
  it("stays open under StrictMode's double-invoked effects", async () => {
    render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );

    await user.click(screen.getByRole("button", { name: "Preview" }));

    expect(screen.getByRole("dialog", { name: "Vendor email draft" })).toHaveAttribute("open");
  });

  it("closes from the explicit close controls", async () => {
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Preview" }));
    await user.click(screen.getByRole("button", { name: "Close preview" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Preview" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
