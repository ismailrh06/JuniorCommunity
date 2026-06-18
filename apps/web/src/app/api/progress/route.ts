import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

const VALID_ITEM_TYPES = new Set(["mission", "step", "daily"]);
const VALID_STATUSES = new Set(["in_progress", "completed"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * POST /api/progress
 * Body:
 * - Legacy: { lessonId: string, status?: "in_progress" | "completed" }
 * - Gamified: { itemId: string, itemType: "mission" | "step" | "daily", xp?: number }
 * Saves gamified progress, increments XP once per item, and updates streak.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const rawItemId = body.itemId ?? body.lessonId;
  const itemId = typeof rawItemId === "string" ? rawItemId.trim() : "";
  const itemType = typeof body.itemType === "string" ? body.itemType : "mission";
  const status = typeof body.status === "string" ? body.status : "completed";
  const rawXp =
    typeof body.xp === "number" && Number.isFinite(body.xp) ? body.xp : 10;
  const xp = Math.max(0, Math.min(rawXp, 1000));

  if (!itemId || itemId.length > 160) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 });
  }
  if (!VALID_ITEM_TYPES.has(itemType) || !VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: "Invalid progress state" },
      { status: 400 },
    );
  }

  // Mock mode — nothing to persist (client already updates local state)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";
  if (isMock) {
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();

  await (supabase.from("learner_profiles") as any).upsert(
    {
      user_id: user.id,
      updated_at: now,
    },
    { onConflict: "user_id" },
  );

  const { data: existingItem } = await (supabase as any)
    .from("learning_progress_items")
    .select("id, status, xp_awarded, completed_at")
    .eq("user_id", user.id)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .maybeSingle();

  const wasCompleted = existingItem?.status === "completed";

  if (status === "completed" && wasCompleted) {
    return NextResponse.json({
      ok: true,
      alreadyCompleted: true,
      xpAwarded: existingItem.xp_awarded,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: gamifiedProgressError } = await (
    supabase.from("learning_progress_items") as any
  ).upsert(
    {
      user_id: user.id,
      item_id: itemId,
      item_type: itemType,
      status,
      xp_awarded: status === "completed" && !wasCompleted ? xp : 0,
      completed_at: status === "completed" ? now : null,
      metadata: {
        source: "juniorcode-learn",
      },
      updated_at: now,
    },
    { onConflict: "user_id,item_type,item_id" },
  );

  if (gamifiedProgressError) {
    return NextResponse.json(
      { error: gamifiedProgressError.message },
      { status: 500 },
    );
  }

  if (status === "completed" && !wasCompleted) {
    // Streak must run before increment_xp because increment_xp updates last_active_at.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("update_streak", { p_user_id: user.id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("increment_xp", {
      p_user_id: user.id,
      p_xp: xp,
    });
  }

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/progress
 * Returns all gamified progress and learner profile for the current user.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";
  if (isMock) {
    return NextResponse.json({ data: [], mode: "mock" });
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await (supabase as any)
    .from("learning_progress_items")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("learner_profiles")
    .select("xp_points, streak_days, last_active_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ data, profile });
}
