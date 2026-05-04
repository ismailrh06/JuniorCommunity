import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

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
