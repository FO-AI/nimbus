import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProjectsPage from "@/app/(app)/projects/page";
import type { Project } from "@/types";

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    name: "Travel reimbursement automation",
    department: "Finance",
    ownerEmail: "owner@unc.edu",
    sponsor: "",
    stakeholders: [],
    status: "active",
    source: "inventoried",
    summary: "Routes reimbursement requests automatically.",
    businessValue: "",
    risks: "",
    dependencies: "",
    nextSteps: "",
    toolsUsed: [],
    relatedSlugs: [],
    strategicCategory: "",
    startDate: null,
    targetDate: null,
    triageNote: "",
    submittedBy: "",
    lastUpdatedBy: "",
    archivedAt: null,
    archivedBy: "",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const listProjects = vi.fn();
const getMe = vi.fn();
const api = { listProjects, getMe };
vi.mock("@/lib/api/useApiClient", () => ({ useApiClient: () => api }));

describe("ProjectsPage", () => {
  beforeEach(() => {
    listProjects.mockReset();
    getMe.mockReset().mockResolvedValue({ isAdmin: true });
  });

  it("invites the first idea when the list is empty and nothing is filtered", async () => {
    listProjects.mockResolvedValue({ items: [], total: 0 });
    render(<ProjectsPage />);

    expect(await screen.findByText("No projects yet")).toBeInTheDocument();
    // "Clear filters" here would be a button that does nothing.
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    expect(screen.getByText(/Suggest the first one/)).toBeInTheDocument();
    // Twice: the page-header action and the empty state's own invitation.
    expect(screen.getAllByRole("link", { name: "Suggest an idea" })).toHaveLength(2);
  });

  it("offers to clear the filters when a filter is what emptied the list", async () => {
    listProjects.mockResolvedValue({ items: [project()], total: 1 });
    const user = userEvent.setup();
    render(<ProjectsPage />);

    const stage = await screen.findByRole("group", { name: "Stage" });
    await user.click(within(stage).getByRole("button", { name: "Rejected" }));

    expect(await screen.findByText("No projects match your filters")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(await screen.findByRole("link", { name: /Travel reimbursement/ })).toBeInTheDocument();
  });

  it("clears the archived toggle along with the other filters", async () => {
    listProjects.mockResolvedValue({ items: [project()], total: 1 });
    const user = userEvent.setup();
    render(<ProjectsPage />);

    const archived = await screen.findByRole("checkbox");
    await user.click(archived);
    await waitFor(() => expect(listProjects).toHaveBeenCalledWith({ includeArchived: true }));

    // The toggle changes the request, so it counts as a filter and has to reset.
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(archived).not.toBeChecked();
    await waitFor(() => expect(listProjects).toHaveBeenLastCalledWith({ includeArchived: false }));
  });

  it("badges how a project got onto the list in the reviewed vocabulary", async () => {
    listProjects.mockResolvedValue({
      items: [project(), project({ id: 2, name: "Vendor triage", source: "proposed" })],
      total: 2,
    });
    render(<ProjectsPage />);

    // Scoped to the table: the filter chips deliberately use the same words.
    const rows = within(await screen.findByRole("table"));
    expect(rows.getByText("Inventoried")).toBeInTheDocument();
    expect(rows.getByText("Proposal")).toBeInTheDocument();
  });
});
