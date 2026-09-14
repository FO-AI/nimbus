import type { ContentSummary } from "@/types";

/**
 * Frontmatter `attributes` is a free-form bag typed as `unknown` per key, so
 * every consumer has to narrow before rendering. This is that narrowing, in
 * one place — it was previously copied into each page that needed it.
 */
export function attr(item: ContentSummary, key: string): string | null {
  const value = item.attributes[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

/** The distinct, sorted values of one attribute across a list — filter options. */
export function attributeValues(items: ContentSummary[], key: string): string[] {
  const all = new Set<string>();
  items.forEach((item) => {
    const value = attr(item, key);
    if (value) all.add(value);
  });
  return Array.from(all).sort();
}

/**
 * Tags are authored as slugs (`acceptable-use`, `public-records`, `its`) and
 * used to render verbatim, which put lowercase slugs in front of readers and
 * turned the acronym ITS into the word "its".
 *
 * Overrides apply per hyphen-separated word, not to the whole slug: `ai` alone
 * was fixed but `ai-literacy` and `hr-operations` still reached readers as
 * "Ai literacy" and "Hr operations".
 */
const TAG_WORD_OVERRIDES: Record<string, string> = {
  ai: "AI",
  ap: "AP",
  dgog: "DGOG",
  ferpa: "FERPA",
  hipaa: "HIPAA",
  hr: "HR",
  iso: "ISO",
  it: "IT",
  its: "ITS",
  ohr: "OHR",
  phi: "PHI",
  pii: "PII",
  rfp: "RFP",
  sog: "SOG",
};

/** Names that no per-word rule recovers, because the capitals are internal. */
const TAG_LABEL_OVERRIDES: Record<string, string> = {
  connectcarolina: "ConnectCarolina",
  "linkedin-learning": "LinkedIn Learning",
  promptlab: "PromptLab",
};

export function tagLabel(tag: string): string {
  const key = tag.trim().toLowerCase();
  if (key === "") return "";

  const exact = TAG_LABEL_OVERRIDES[key];
  if (exact) return exact;

  const words = key
    .split("-")
    .filter(Boolean)
    .map((word) => TAG_WORD_OVERRIDES[word] ?? word);

  const [first, ...rest] = words;
  if (first === undefined) return "";
  // Sentence case, not title case: "Acceptable use", not "Acceptable Use".
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
}
