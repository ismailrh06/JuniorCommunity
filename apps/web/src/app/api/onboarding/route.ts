import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

export async function POST(request: Request) {
  const body = await request.json() as {
    goal: "learn" | "mission" | "portfolio";
    level: "beginner" | "some" | "experienced";
    path: string;
  };

  const { goal, level, path } = body;
  if (!goal || !level || !path) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // In mock mode (no real Supabase), the cookie was already saved client-side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";
  if (isMock) {
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Resolve learning_path id from slug
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: learningPath } = await (supabase.from("learning_paths") as any)
    .select("id")
    .eq("slug", path)
    .single() as { data: { id: string } | null };

  const upsertData = {
    user_id: user.id,
    onboarding_goal: goal,
    onboarding_level: level,
    onboarding_path: path,
    onboarding_completed_at: new Date().toISOString(),
    current_path_id: learningPath?.id ?? null,
    current_level: 0 as const,
    xp_points: 0,
    streak_days: 0,
    last_active_at: null,
    is_premium: false,
    ready_junior: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("learner_profiles") as any)
    .upsert(upsertData, { onConflict: "user_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
