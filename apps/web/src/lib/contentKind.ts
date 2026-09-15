import type { ContentKind } from "@/types";

/**
 * What the library's four `kind` values are called in front of a reader, and
 * what each one means. Exported because four places render them — the home
 * page badges, the guides filter chips and badges, and `/ask` citations — and
 * they had already drifted: the filter hints said "Step-by-step walkthroughs
 * of a specific task" while the badge tooltip beside them said "A step-by-step
 * walkthrough of a specific task".
 *
 * `prompt` is here too, even though it has no guides filter: featured prompts
 * appear on the home page and prompts are cited by `/ask`.
 */
export const KIND_LABEL: Record<ContentKind, string> = {
  playbook: "Playbook",
  guidance: "Guidance",
  tool: "Tool",
  prompt: "Prompt",
};

export const KIND_HINT: Record<ContentKind, string> = {
  playbook: "A step-by-step walkthrough of a specific task",
  guidance: "University rules and policy, explained in plain language",
  tool: "An approved AI tool: what it does and who can use it",
  prompt: "Ready-made instructions you can copy into an AI tool",
};

/**
 * A citation says what kind of page it points at. `/ask` also cites projects,
 * which are not content items, and `Citation.kind` is a free-form string on
 * the API — so an unmapped kind falls back to a plain reader-facing word
 * rather than printing the stored value.
 */
export const CITATION_LABEL: Record<string, string> = {
  ...KIND_LABEL,
  tool: "Tool page",
  project: "AI project",
};

export const CITATION_LABEL_FALLBACK = "Nimbus page";

/** Plural, for a filter chip that selects a set rather than naming one page. */
export const KIND_FILTER_LABEL: Record<ContentKind, string> = {
  playbook: "Playbooks",
  guidance: "Guidance",
  tool: "Tools",
  prompt: "Prompts",
};
