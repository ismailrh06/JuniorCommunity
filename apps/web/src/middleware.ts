import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import type { Database } from "@juniorcode/db";

const PROTECTED_ROUTES = ["/dashboard", "/dashboard/", "/onboarding"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  // Skip middleware if Supabase is not yet configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isMockMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder");

  if (isMockMode) {
    const { pathname } = request.nextUrl;
    const mockUserCookie = request.cookies.get("jc-mock-user")?.value;
    const isLoggedIn = !!mockUserCookie;

    // Redirect unauthenticated users away from protected routes
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (isProtected && !isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    if (isAuthRoute && isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

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

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // eslint-disable-next-line no-useless-escape
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
