import { expect, test } from "@playwright/test";

// Browse-and-copy UX over the mock stack: the Resources dropdown, the prompt
// preview dialog, and filters that survive a back-navigation. These need a real
// browser — the dialog's focus trap and the history round-trip have no jsdom
// equivalent.

test.describe("Resources navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/home");
  });

  test("opens on hover and on click, and closes on an outside click", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Resources" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.hover();
    await expect(page.getByRole("menu", { name: "Resources" })).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Each item carries the one-line description that makes the group legible.
    const menu = page.getByRole("menu", { name: "Resources" });
    await expect(menu.getByRole("menuitem", { name: /^Guides/ })).toContainText(
      "Playbooks, guidance, and the tool registry",
    );
    await expect(menu.getByRole("menuitem", { name: /^Prompts/ })).toContainText(
      "Copy-paste prompts for everyday work",
    );

    await page.getByRole("heading", { level: 1 }).click();
    await expect(menu).toBeHidden();

    await trigger.click();
    await expect(page.getByRole("menu", { name: "Resources" })).toBeVisible();
  });

  test("is fully operable from the keyboard", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Resources" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const menu = page.getByRole("menu", { name: "Resources" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: /^Guides/ })).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem", { name: /^Prompts/ })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/guides$/);
    // The trigger reads as active for both routes underneath it.
    await expect(page.getByRole("button", { name: "Resources" })).toHaveAttribute(
      "data-active",
      "true",
    );
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
  const tagFilters = page.getByRole("group", { name: "Filter by tag" });
  const tagChips = tagFilters.locator("button[aria-pressed]");
  await expect(tagChips).toHaveCount(8);

  const disclosure = tagFilters.getByRole("button", { name: /^(More|Fewer) tags/ });
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

  const departmentFilters = page.getByRole("group", { name: "Filter by department" });
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
