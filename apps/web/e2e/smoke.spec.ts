import { expect, test } from "@playwright/test";

// Smoke test: the app loads and the browse-first home renders. Runs with auth
// disabled (see playwright.config.ts webServer env), so no Entra config is needed.
test("home loads", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "AI enablement hub" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask Nimbus" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Propose an AI use case" })).toBeVisible();
});

test("public FOAI landing loads without signing in", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Building AI fluency across Finance & Operations." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "The Steering Committee" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reach the FOAI team" })).toBeVisible();
});

test("local dev auth-disabled banner is shown", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Auth is disabled/i)).toBeVisible();
});
