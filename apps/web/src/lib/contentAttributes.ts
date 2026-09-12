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
 * turned the acronym ITS into the word "its". Acronyms and multi-word names
 * that do not survive naive title-casing are listed explicitly.
 */
const TAG_LABEL_OVERRIDES: Record<string, string> = {
  ai: "AI",
  ap: "AP",
  ferpa: "FERPA",
  hipaa: "HIPAA",
  hr: "HR",
  it: "IT",
  its: "ITS",
  phi: "PHI",
  pii: "PII",
  ohr: "OHR",
  "public-records": "Public records",
  "acceptable-use": "Acceptable use",
};

export function tagLabel(tag: string): string {
  const key = tag.trim().toLowerCase();
  const override = TAG_LABEL_OVERRIDES[key];
  if (override) return override;
  const spaced = key.replaceAll("-", " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
