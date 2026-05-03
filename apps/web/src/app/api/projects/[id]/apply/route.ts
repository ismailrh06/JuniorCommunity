import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

/**
 * POST /api/projects/[id]/apply
 * Body: { coverLetter: string; proposedBudget: number; proposedDurationDays: number }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";

  if (isMock) {
    // In mock mode, just validate the body and acknowledge
    const body = await request.json() as { coverLetter?: string; proposedBudget?: number };
    if (!body.coverLetter?.trim()) {
      return NextResponse.json({ error: "coverLetter required" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, mode: "mock", projectId });
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    coverLetter?: string;
    proposedBudget?: number;
    proposedDurationDays?: number;
  };

  if (!body.coverLetter?.trim()) {
    return NextResponse.json({ error: "coverLetter required" }, { status: 400 });
  }
  if (!body.proposedBudget || !body.proposedDurationDays) {
    return NextResponse.json({ error: "proposedBudget and proposedDurationDays required" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("applications") as any).insert({
    project_id: projectId,
    applicant_id: user.id,
    cover_letter: body.coverLetter,
    proposed_budget: body.proposedBudget,
    proposed_duration_days: body.proposedDurationDays,
    status: "pending",
  });

  if (error) {
    if (error.message.includes("unique")) {
      return NextResponse.json({ error: "Already applied to this project" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Track analytics event
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("track_event", {
      p_event: "project_applied",
      p_properties: { project_id: projectId },
    });
  } catch {
    // non-blocking
  }

  return NextResponse.json({ ok: true });
}
