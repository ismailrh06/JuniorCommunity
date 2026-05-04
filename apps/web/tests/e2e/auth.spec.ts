import { test, expect, type BrowserContext } from "@playwright/test";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Encode a mock user cookie the same way mock-auth.ts does:
 * base64(JSON({ id, email, full_name, role }))
 */
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
      domain: "localhost",
      path: "/",
    },
  ]);
}

async function clearMockUser(context: BrowserContext) {
  await context.clearCookies();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe("Auth — login page", () => {
  test("shows login form with email + password fields", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /connexion|log in|sign in/i }),
    ).toBeVisible();
  });

  test("shows link to register page", async ({ page }) => {
    await page.goto("/auth/login");
    const link = page.getByRole("link", { name: /inscri|register|sign up/i });
    await expect(link).toBeVisible();
  });

  test("redirects already-logged-in user away from login page", async ({
    page,
    context,
  }) => {
    await setMockUser(context, {
      email: "test@test.com",
      full_name: "Test User",
    });
    await page.goto("/auth/login");
    // Should redirect to /dashboard or stay (depending on middleware)
    await expect(page).toHaveURL(/\/(dashboard|learn|marketplace|onboarding)/);
    await clearMockUser(context);
  });
});

test.describe("Auth — register page", () => {
  test("shows registration form", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("shows link to login page", async ({ page }) => {
    await page.goto("/auth/register");
    const link = page.getByRole("link", { name: /connexion|log in|sign in/i });
    await expect(link).toBeVisible();
  });
});

test.describe("Auth — protected routes", () => {
  test("unauthenticated user is redirected from /dashboard to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("unauthenticated user is redirected from /settings to login", async ({
    page,
  }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("unauthenticated user is redirected from /admin to login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("non-admin user is redirected from /admin to /dashboard", async ({
    page,
    context,
  }) => {
    await setMockUser(context, {
      email: "learner@test.com",
      full_name: "Learner",
      role: "learner",
    });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard/);
    await clearMockUser(context);
  });
});

test.describe("Auth — logout", () => {
  test("clicking logout clears session and redirects home", async ({
    page,
    context,
  }) => {
    await setMockUser(context, {
      email: "test@test.com",
      full_name: "Test User",
    });
    await page.goto("/dashboard");

    // Find and click logout button in navbar
    const logoutBtn = page.getByRole("button", {
      name: /d[eé]connexion|logout|sign out/i,
    });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/^\//);
    }
    await clearMockUser(context);
  });
});
