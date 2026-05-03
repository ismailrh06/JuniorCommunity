import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

/**
 * POST /api/progress
 * Body: { lessonId: string, status?: "in_progress" | "completed" }
 * Saves lesson progress to user_progress, increments XP if completed.
 */
export async function POST(request: Request) {
  const body = await request.json() as {
    lessonId: string;
    status?: "in_progress" | "completed";
  };

  const { lessonId, status = "completed" } = body;
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Mock mode — nothing to persist (client already updates local state)
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

  const now = new Date().toISOString();

  const progressRow = {
    user_id: user.id,
    lesson_id: lessonId,
    status,
    started_at: status === "in_progress" ? now : null,
    completed_at: status === "completed" ? now : null,
  };

  // Upsert progress row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: progressError } = await (supabase.from("user_progress") as any)
    .upsert(progressRow, { onConflict: "user_id,lesson_id" });

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 500 });
  }

  // Award XP + update streak when lesson is completed
  if (status === "completed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("increment_xp", { p_user_id: user.id, p_xp: 10 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("update_streak", { p_user_id: user.id });
  }

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/progress
 * Returns all progress for the current user.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";
  if (isMock) {
    return NextResponse.json({ data: [], mode: "mock" });
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("*, lesson:lessons(id, title, type, duration_minutes, path_id)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
