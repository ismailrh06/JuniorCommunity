/**
 * Mock auth — used when Supabase is not yet configured (placeholder env vars).
 * Stores the user as a base64-encoded JSON cookie so the server can read it too.
 */

const COOKIE_NAME = "jc-mock-user";

export type MockUser = {
  id: string;
  email: string;
  full_name: string;
  role: "learner" | "student" | "client" | "admin" | "mentor";
};

export function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.includes("placeholder") || url === "";
}

/** Browser only — save mock user to cookie (7 days) */
export function saveMockUser(user: MockUser): void {
  const encoded = btoa(JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

/** Browser only — clear mock user */
export function clearMockUser(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

// ── Onboarding ──────────────────────────────────────────

const ONBOARDING_COOKIE = "jc-onboarding";

export type OnboardingData = {
  goal: "learn" | "mission" | "portfolio";
  level: "beginner" | "some" | "experienced";
  path: string;
  completedAt: string;
};

/** Browser only — save onboarding choices (30 days) */
export function saveOnboarding(data: OnboardingData): void {
  const encoded = btoa(JSON.stringify(data));
  document.cookie = `${ONBOARDING_COOKIE}=${encoded}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

/** Server only — read onboarding from raw cookie header string */
export function getOnboardingFromCookies(cookieHeader: string): OnboardingData | null {
  const match = new RegExp(`(?:^|; )${ONBOARDING_COOKIE}=([^;]*)`).exec(cookieHeader);
  if (!match) return null;
  try {
    return JSON.parse(Buffer.from(match[1], "base64").toString("utf8")) as OnboardingData;
  } catch {
    return null;
  }
}

/** Browser only — read mock user */
export function getMockUserBrowser(): MockUser | null {
  if (typeof document === "undefined") return null;
  const match = new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`).exec(document.cookie);
  if (!match) return null;
  try {
    return JSON.parse(atob(match[1])) as MockUser;
  } catch {
    return null;
  }
}
