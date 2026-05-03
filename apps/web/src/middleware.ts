import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import type { Database } from "@juniorcode/db";

const PROTECTED_ROUTES = ["/dashboard", "/dashboard/", "/onboarding", "/settings", "/admin"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

function redirectTo(request: NextRequest, pathname: string, searchParams?: Record<string, string>) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return NextResponse.redirect(url);
}

function getMockRole(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  try {
    const user = JSON.parse(Buffer.from(cookieValue, "base64").toString("utf-8")) as { role?: string };
    return user.role ?? null;
  } catch {
    return null;
  }
}

function handleMockMode(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const mockUserCookie = request.cookies.get("jc-mock-user")?.value;
  const isLoggedIn = !!mockUserCookie;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !isLoggedIn) {
    return redirectTo(request, "/auth/login", { redirectTo: pathname });
  }

  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminRoute && isLoggedIn) {
    const role = getMockRole(mockUserCookie);
    if (!role) return redirectTo(request, "/auth/login");
    if (role !== "admin") return redirectTo(request, "/dashboard");
  }

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && isLoggedIn) {
    return redirectTo(request, "/dashboard");
  }

  return NextResponse.next({ request });
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isMockMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder");

  if (isMockMode) return handleMockMode(request);

  let supabaseResponse = NextResponse.next({ request });

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  // @ts-ignore — false positive: we use getAll/setAll (non-deprecated API)
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !user) {
    return redirectTo(request, "/auth/login", { redirectTo: pathname });
  }

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && user) {
    return redirectTo(request, "/dashboard");
  }

  return supabaseResponse;
}

export const config = {
  // eslint-disable-next-line no-useless-escape
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
