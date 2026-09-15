import { expect, test } from "@playwright/test";

// Browse-and-copy UX over the mock stack: the flat top-level navigation, the
// prompt preview dialog, and filters that survive a back-navigation. These need
// a real browser — the dialog's focus trap and the history round-trip have no
// jsdom equivalent.

test.describe("Primary navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/home");
  });

  test("reaches every destination in one click, with no dropdown in the way", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Nimbus navigation" });
    // Guides and Prompts were previously nested under a "Resources" menu button.
    await expect(nav.getByRole("button", { name: "Resources" })).toHaveCount(0);

    await nav.getByRole("link", { name: /^Guides/ }).click();
    await expect(page).toHaveURL(/\/guides$/);
    await expect(nav.getByRole("link", { name: /^Guides/ })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await nav.getByRole("link", { name: /^Prompts/ }).click();
    await expect(page).toHaveURL(/\/prompts$/);
  });

  test("explains every destination on hover, so no label is a bare word", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Nimbus navigation" });

    await expect(nav.getByRole("link", { name: /^Guides/ })).toHaveAttribute(
      "title",
      "How to do a task with AI, what's allowed, and which tools are approved",
    );
    await expect(nav.getByRole("link", { name: /^Ask/ })).toHaveAttribute(
      "title",
      "Ask a question and get an answer with links to where it came from",
    );
    // The brand says what Nimbus is, on every page.
    await expect(nav).toContainText("AI help for Finance & Operations");
  });
});

test("previews a prompt in a modal, traps focus there, and copies from it", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/prompts");

  const trigger = page.getByRole("button", { name: /^Preview / }).first();
  await trigger.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog.getByRole("link", { name: "Open full page" })).toBeVisible();

  // Tabbing all the way round stays inside the dialog (native showModal()).
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);

  await dialog.getByRole("button", { name: "Copy prompt" }).click();
  await expect(dialog.getByRole("button", { name: /Copied/ })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).not.toBe("");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("guide filters live in the URL and survive a back-navigation", async ({ page }) => {
  await page.goto("/guides");

  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await expect(page).toHaveURL(/\?kind=tool$/);

  // The 30-plus tag list is collapsed to the most common few behind a disclosure.
  const tagFilters = page.getByRole("group", { name: "Topic" });
  const tagChips = tagFilters.locator("button[aria-pressed]");
  await expect(tagChips).toHaveCount(8);

  const disclosure = tagFilters.getByRole("button", { name: /^Show (all \d+ topics|fewer topics)/ });
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await disclosure.click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  expect(await tagChips.count()).toBeGreaterThan(8);

  const firstGuide = page.locator("main a[href^='/guides/']").first();
  const href = await firstGuide.getAttribute("href");
  await firstGuide.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));

  await page.goBack();
  await expect(page).toHaveURL(/\?kind=tool$/);
  await expect(page.getByRole("button", { name: "Tools", exact: true })).toHaveClass(/bg-carolina/);
});

test("prompt filters survive a back-navigation and can be cleared", async ({ page }) => {
  await page.goto("/prompts");

  const departmentFilters = page.getByRole("group", { name: "Team" });
  await departmentFilters.getByRole("button").nth(1).click();
  await expect(page).toHaveURL(/\?department=/);
  const filteredCount = await page.getByText(/ prompts? of /).textContent();

  await page.locator("main a[href^='/prompts/']").first().click();
  await expect(page).toHaveURL(/\/prompts\/.+/);

  await page.goBack();
  await expect(page).toHaveURL(/\?department=/);
  await expect(page.getByText(/ prompts? of /)).toHaveText(filteredCount ?? "");

  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(page).toHaveURL(/\/prompts$/);
});
