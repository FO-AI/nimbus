import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrganizationPage from "@/app/(public)/organization/page";

const internNames = [
  "Chris Kim",
  "Kaiji Fu",
  "Ayush Sagar",
  "Eesham Bhattad",
  "Daniel Zhang",
];

describe("OrganizationPage", () => {
  it("renders the sponsor, the lead, and every intern", () => {
    render(<OrganizationPage />);

    expect(screen.getByText("Nathan Knuffman")).toBeInTheDocument();
    expect(screen.getByText("Om Shewale")).toBeInTheDocument();
    for (const name of internNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("summarizes the current headcount", () => {
    render(<OrganizationPage />);

    expect(
      screen.getByText((_, element) =>
        element?.textContent?.trim() === "Currently: 1 sponsor · 1 lead · 5 interns",
      ),
    ).toBeInTheDocument();
  });

  it("leaves no roster placeholders on the page", () => {
    const { container } = render(<OrganizationPage />);

    expect(container.textContent).not.toMatch(/\[Intern Name\]|\[Focus area\]/);
  });
});
