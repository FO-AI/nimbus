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
