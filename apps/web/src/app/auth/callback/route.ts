import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

function getSafeRedirectPath(value: string | null): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.includes("\\")) return "/dashboard";
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the intended destination (or dashboard by default)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — redirect to login with error flag
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`,
  );
}
