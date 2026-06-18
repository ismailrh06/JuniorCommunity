import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@juniorcode/db/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * POST /api/projects/[id]/apply
 * Body: { coverLetter: string; proposedBudget: number; proposedDurationDays: number }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const coverLetter =
    typeof body.coverLetter === "string" ? body.coverLetter.trim() : "";
  const proposedBudget =
    typeof body.proposedBudget === "number" &&
    Number.isFinite(body.proposedBudget)
      ? Math.round(body.proposedBudget)
      : null;
  const proposedDurationDays =
    typeof body.proposedDurationDays === "number" &&
    Number.isFinite(body.proposedDurationDays)
      ? Math.round(body.proposedDurationDays)
      : null;

  if (coverLetter.length < 10 || coverLetter.length > 5000) {
    return NextResponse.json(
      { error: "coverLetter must be between 10 and 5000 characters" },
      { status: 400 },
    );
  }

  if (
    proposedBudget === null ||
    proposedBudget <= 0 ||
    proposedBudget > 100000
  ) {
    return NextResponse.json(
      { error: "proposedBudget must be a positive number" },
      { status: 400 },
    );
  }

  if (
    proposedDurationDays === null ||
    proposedDurationDays <= 0 ||
    proposedDurationDays > 365
  ) {
    return NextResponse.json(
      { error: "proposedDurationDays must be between 1 and 365" },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMock = supabaseUrl.includes("placeholder") || supabaseUrl === "";

  if (isMock) {
    return NextResponse.json({ ok: true, mode: "mock", projectId });
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("applications") as any).insert({
    project_id: projectId,
    applicant_id: user.id,
    cover_letter: coverLetter,
    proposed_budget: proposedBudget,
    proposed_duration_days: proposedDurationDays,
    status: "pending",
  });

  if (error) {
    if (error.message.includes("unique")) {
      return NextResponse.json(
        { error: "Already applied to this project" },
        { status: 409 },
      );
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
