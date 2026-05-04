// @ts-nocheck
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

// Valid events and their required properties
const VALID_EVENTS = new Set([
  "signup",
  "path_started",
  "module_started",
  "module_completed",
  "project_applied",
  "page_view",
  "badge_earned",
]);

type AnalyticsPayload = {
  event: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
};

/**
 * POST /api/analytics
 * Body: { event: string; properties?: object; sessionId?: string }
 *
 * Tracks an analytics event. Works in both mock and real mode.
 * In mock mode, events are logged to console.
 * In real mode, events are stored in the analytics_events table via RPC.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as AnalyticsPayload;
  const { event, properties = {}, sessionId } = body;

  if (!event || !VALID_EVENTS.has(event)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";

  if (isMock) {
    // In mock mode, just acknowledge
    console.info("[analytics:mock]", event, properties);
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  try {
    const supabase = await getSupabaseServerClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("track_event", {
      p_event: event,
      p_properties: properties,
      p_session_id: sessionId ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * GET /api/analytics
 * Admin-only: returns aggregated analytics summary.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";

  if (isMock) {
    // Return synthetic mock analytics
    return NextResponse.json({
      summary: [
        {
          event: "signup",
          total: 142,
          unique_users: 142,
          last_7d: 12,
          last_30d: 38,
        },
        {
          event: "path_started",
          total: 118,
          unique_users: 99,
          last_7d: 9,
          last_30d: 31,
        },
        {
          event: "module_started",
          total: 687,
          unique_users: 94,
          last_7d: 54,
          last_30d: 187,
        },
        {
          event: "module_completed",
          total: 423,
          unique_users: 87,
          last_7d: 38,
          last_30d: 129,
        },
        {
          event: "project_applied",
          total: 56,
          unique_users: 44,
          last_7d: 7,
          last_30d: 22,
        },
        {
          event: "badge_earned",
          total: 94,
          unique_users: 71,
          last_7d: 11,
          last_30d: 28,
        },
      ],
      mode: "mock",
    });
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check admin role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("analytics_events")
    .select("event, user_id, created_at");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate client-side (simple approach; in prod use analytics_summary view)
  const aggregated: Record<
    string,
    {
      total: number;
      unique_users: Set<string>;
      last_7d: number;
      last_30d: number;
    }
  > = {};
  const now = Date.now();
  const day7 = 7 * 24 * 60 * 60 * 1000;
  const day30 = 30 * 24 * 60 * 60 * 1000;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const row of (data ?? []) as any[]) {
    if (!aggregated[row.event]) {
      aggregated[row.event] = {
        total: 0,
        unique_users: new Set(),
        last_7d: 0,
        last_30d: 0,
      };
    }
    const bucket = aggregated[row.event];
    bucket.total++;
    if (row.user_id) bucket.unique_users.add(row.user_id);
    const age = now - new Date(row.created_at).getTime();
    if (age <= day7) bucket.last_7d++;
    if (age <= day30) bucket.last_30d++;
  }

  const summary = Object.entries(aggregated).map(([event, stats]) => ({
    event,
    total: stats.total,
    unique_users: stats.unique_users.size,
    last_7d: stats.last_7d,
    last_30d: stats.last_30d,
  }));

  return NextResponse.json({ summary });
}
