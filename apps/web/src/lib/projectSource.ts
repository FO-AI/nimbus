import type { ProjectSource } from "@/types";

/**
 * How a project got onto the list. Exported so the list badge, the filter
 * chips, and the detail-page badge cannot drift apart — they said "AI team" /
 * "Staff idea" in one place and "Inventoried" / "Proposal" in another.
 *
 * The proposal wording is deliberate. "Added by the AI team" reads as though
 * the AI team thought of the work; these projects come from across Finance &
 * Operations and the team only records them, so the label describes the route
 * onto the list rather than the author of the idea.
 */
export const SOURCE_LABELS: Record<ProjectSource, string> = {
  proposed: "Proposal",
  inventoried: "Inventoried",
};

export const SOURCE_HINTS: Record<ProjectSource, string> = {
  proposed: "Came in as a proposal from a member of staff, through Suggest an idea",
  inventoried: "Work already under way, recorded in the inventory by the AI team",
};
