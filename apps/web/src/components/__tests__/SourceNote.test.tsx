import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SourceBadge, SourceNote } from "@/components/SourceNote";
import type { SourceRef } from "@/types";

const link: SourceRef = {
  mode: "link",
  url: "https://its.unc.edu/ai/copilot/",
  title: "AI tools at Carolina",
  publisher: "UNC ITS",
  adapted: false,
  retrieved: "2026-09-08",
};

const imported: SourceRef = {
  mode: "import",
  url: "https://example.com/library",
  title: "Some prompt library",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: "Someone Else",
  adapted: true,
};

describe("SourceNote", () => {
  it("points a linked item at the page that is actually authoritative", () => {
    render(<SourceNote source={link} />);

    expect(screen.getByText(/UNC ITS/)).toBeInTheDocument();
    expect(screen.getByText(/the original is correct/)).toBeInTheDocument();

    const anchor = screen.getByRole("link", { name: /AI tools at Carolina/ });
    expect(anchor).toHaveAttribute("href", link.url);
    expect(anchor).toHaveAttribute("target", "_blank");
    // Without noopener the linked page gets a handle on this window.
    expect(anchor.getAttribute("rel")).toContain("noopener");
  });

  it("carries attribution and the licence for imported material", () => {
    render(<SourceNote source={imported} />);

    expect(screen.getByText(/Adapted for UNC from/)).toBeInTheDocument();
    expect(screen.getByText(/Someone Else/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CC BY-SA 4.0" })).toHaveAttribute(
      "href",
      imported.licenseUrl,
    );
    // CC BY-SA is share-alike: the page has to say the adaptation is too.
    expect(screen.getByText(/shared under the same terms/)).toBeInTheDocument();
  });
});

describe("SourceBadge", () => {
  it("renders nothing for in-house content", () => {
    const { container } = render(<SourceBadge source={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("distinguishes linked from adapted items", () => {
    const { rerender } = render(<SourceBadge source={link} />);
    expect(screen.getByText("Links out")).toBeInTheDocument();

    rerender(<SourceBadge source={imported} />);
    expect(screen.getByText("Adapted")).toBeInTheDocument();
  });
});
