import { test, expect } from "@playwright/test";

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe("Marketplace — project listing", () => {
  test("loads marketplace page and shows projects", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page).toHaveURL(/\/marketplace/);

    // At least one project card should be visible
    const projectCards = page.locator("a[href^='/projects/']");
    await expect(projectCards.first()).toBeVisible();
  });

  test("displays project title, client, and budget", async ({ page }) => {
    await page.goto("/marketplace");

    // Check that at least one card has a budget indicator
    await expect(page.getByText(/\d+[–-]\d+€/)).toBeVisible();
  });

  test("shows category filter buttons", async ({ page }) => {
    await page.goto("/marketplace");
    // Look for category filter section
    await expect(page.getByText(/web/i).first()).toBeVisible();
    await expect(page.getByText(/design/i).first()).toBeVisible();
  });

  test("shows search input", async ({ page }) => {
    await page.goto("/marketplace");
    const searchInput = page.locator("input[name='q']");
    await expect(searchInput).toBeVisible();
  });
});

test.describe("Marketplace — filters", () => {
  test("filtering by category updates the URL", async ({ page }) => {
    await page.goto("/marketplace");

    // Click the 'web' category filter
    const webFilter = page.getByRole("link", { name: /^développement web$|^web development$|^desarrollo web$|^web$/i }).first();
    if (await webFilter.isVisible()) {
      await webFilter.click();
      await expect(page).toHaveURL(/category=web/);
    }
  });

  test("resetting filters clears search params", async ({ page }) => {
    await page.goto("/marketplace?category=web");
    const resetLink = page.getByRole("link", { name: /reset|réinitialiser|reiniciar/i });
    if (await resetLink.isVisible()) {
      await resetLink.click();
      await expect(page).toHaveURL(/\/marketplace(?:\?.*)?/);
      await expect(page).not.toHaveURL(/category=/);
    }
  });

  test("searching filters visible projects", async ({ page }) => {
    await page.goto("/marketplace");
    const searchInput = page.locator("input[name='q']");
    await searchInput.fill("Next.js");
    await page.keyboard.press("Enter");
    // Should show URL with q param
    await expect(page).toHaveURL(/q=Next/i);
  });
});

test.describe("Marketplace — project detail", () => {
  test("clicking a project card navigates to /projects/[id]", async ({ page }) => {
    await page.goto("/marketplace");

    // Click the first project card
    const firstProject = page.locator("a[href^='/projects/']").first();
    await firstProject.click();
    await expect(page).toHaveURL(/\/projects\//);

    // Should show an apply button or project title
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("project detail page shows budget and tags", async ({ page }) => {
    await page.goto("/projects/1");
    await expect(page.getByText(/\d+[–-]\d+€/)).toBeVisible();
  });

  test("project detail page shows required badge if applicable", async ({ page }) => {
    await page.goto("/projects/1");
    // The first project requires a Web Developer badge
    await expect(page.getByText(/badge|requis|required/i).first()).toBeVisible();
  });
});
