import type { ProjectStatus } from "@/types";

import { Badge } from "@/components/ui";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  proposed: "Proposed",
  idea: "Idea",
  pilot: "Pilot",
  active: "Active",
  paused: "Paused",
  done: "Done",
  rejected: "Rejected",
};

/** What each stage actually means, for hover on any status pill. */
export const STATUS_HINTS: Record<ProjectStatus, string> = {
  proposed: "Submitted by staff, waiting to be reviewed",
  idea: "Reviewed and worth doing, but not started yet",
  pilot: "Being trialled with a small group",
  active: "In use day to day",
  paused: "Stopped for now, may restart later",
  done: "Finished and handed over",
  rejected: "Reviewed and not going ahead",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  const variant =
    status === "active"
      ? "success"
      : status === "pilot"
        ? "primary"
        : status === "proposed"
          ? "warning"
          : status === "rejected"
            ? "danger"
            : "default";

  return (
    <Badge variant={variant} title={STATUS_HINTS[status]}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
