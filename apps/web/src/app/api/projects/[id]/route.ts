import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/data/projects";

/**
 * GET /api/projects/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const language = (searchParams.get("language") ?? "fr") as "fr" | "en" | "es";

  const project = await getProjectById(id, language);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
