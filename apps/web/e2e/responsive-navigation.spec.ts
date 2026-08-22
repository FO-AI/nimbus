import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    )
    .toBe(true);
}

test("public navigation works at 390px and resets across the md breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.locator('nav[aria-label="FOAI navigation"] button[aria-controls]');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(page.getByRole("button", { name: "Close FOAI navigation" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.getByRole("link", { name: "Organization" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(toggle).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Organization" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await page.getByRole("link", { name: "Organization" }).click();
  await expect(page).toHaveURL(/\/organization$/);
  await expect(page.getByRole("button", { name: "Open FOAI navigation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expectNoHorizontalOverflow(page);
});

test("Nimbus navigation works at 390px and resets across the lg breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/home");

  const toggle = page.locator('nav[aria-label="Nimbus navigation"] button[aria-controls]');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await expectNoHorizontalOverflow(page);

  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(toggle).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await page.getByRole("link", { name: "Profile" }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("button", { name: "Open Nimbus navigation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page.getByRole("button", { name: "Open Nimbus navigation" }).click();
  await expect(page.getByRole("link", { name: "Profile" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expectNoHorizontalOverflow(page);
});

test("both desktop headers expose navigation without disclosure buttons", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open FOAI navigation" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Steering Committee" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.goto("/home");
  await expect(page.getByRole("button", { name: "Open Nimbus navigation" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Insights" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
