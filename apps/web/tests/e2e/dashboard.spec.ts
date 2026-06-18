import { test, expect, type BrowserContext } from "@playwright/test";

function encodeMockUser(user: {
  id?: string;
  email: string;
  full_name: string;
  role?: string;
}): string {
  const payload = {
    id: user.id ?? "test-user-id",
    email: user.email,
    full_name: user.full_name,
    role: user.role ?? "learner",
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

async function setMockUser(
  context: BrowserContext,
  user: { email: string; full_name: string; role?: string },
) {
  await context.addCookies([
    {
      name: "jc-mock-user",
      value: encodeMockUser(user),
      url: "http://localhost:3000",
    },
  ]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe("Dashboard — unauthenticated", () => {
  test("redirects to /auth/login when not logged in", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("Dashboard — authenticated", () => {
  test.beforeEach(async ({ context }) => {
    await setMockUser(context, {
      email: "alice@example.com",
      full_name: "Alice Martin",
      role: "learner",
    });
  });

  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("loads dashboard page successfully", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    // Should not redirect to login
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });

  test("shows user's name on the dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/alice/i).first()).toBeVisible();
  });

  test("shows navigation to Learn and Marketplace", async ({ page }) => {
    await page.goto("/dashboard");
    let learnLink = page.locator("a[href='/learn']:visible").first();
    let marketplaceLink = page
      .locator("a[href='/marketplace']:visible")
      .first();

    if (!(await marketplaceLink.isVisible().catch(() => false))) {
      await page.locator("button[aria-label='Menu']").click({ force: true });
      learnLink = page.locator("a[href='/learn']:visible").first();
      marketplaceLink = page
        .locator("a[href='/marketplace']:visible")
        .first();
    }

    await expect(learnLink).toBeVisible();
    await expect(marketplaceLink).toBeVisible();
  });

  test("shows XP or progress stats", async ({ page }) => {
    await page.goto("/dashboard");
    // Look for XP, points, or level indicator
    await expect(
      page.getByText(/xp|level|niveau|points/i).first(),
    ).toBeVisible();
  });
});

test.describe("Dashboard — admin user", () => {
  test("admin can access /admin page", async ({ page, context }) => {
    await setMockUser(context, {
      email: "admin@example.com",
      full_name: "Admin User",
      role: "admin",
    });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);
    await context.clearCookies();
  });
});
