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
      url: "http://localhost:3000",
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
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("shows link to register page", async ({ page }) => {
    await page.goto("/auth/login");
    const link = page.locator("a[href='/auth/register']").first();
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
    await expect(page).toHaveURL(
      /\/(?:$|dashboard|learn|marketplace|onboarding)/,
    );
    await clearMockUser(context);
  });
});

test.describe("Auth — register page", () => {
  test("shows registration form", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']").first()).toBeVisible();
  });

  test("shows link to login page", async ({ page }) => {
    await page.goto("/auth/register");
    const link = page.locator("a[href='/auth/login']").first();
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
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-safari",
      "Mock-mode logout is covered in Chromium; mobile auth route protection is covered separately.",
    );

    const mockUser = encodeMockUser({
      email: "test@test.com",
      full_name: "Test User",
    });
    await page.goto("/");
    await page.evaluate((value) => {
      document.cookie = `jc-mock-user=${value}; path=/; SameSite=Lax`;
    }, mockUser);
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /test user/i })).toBeVisible();

    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page
        .locator("button[aria-label='Menu']")
        .evaluate((button) => (button as HTMLButtonElement).click());
    }

    let logoutBtn = page.getByRole("button", {
      name: /d[eé]connexion|logout|sign out|cerrar|salir/i,
    }).first();
    if (!(await logoutBtn.isVisible().catch(() => false))) {
      await page
        .locator("button[aria-label='Menu']")
        .evaluate((button) => (button as HTMLButtonElement).click());
      logoutBtn = page.getByRole("button", {
        name: /d[eé]connexion|logout|sign out|cerrar|salir/i,
      }).first();
    }

    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    await expect.poll(async () => {
      const cookies = await context.cookies();
      return cookies.some((cookie) => cookie.name === "jc-mock-user");
    }).toBe(false);
    await expect(page).toHaveURL(/\/$/);
    await clearMockUser(context);
  });
});
