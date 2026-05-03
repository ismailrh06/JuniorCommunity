import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects";
import type { ProjectCategory, ProjectDifficulty } from "@/lib/data/projects";

/**
 * GET /api/projects
 * Query params: category, difficulty, juniorOnly, q, language
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = (searchParams.get("category") ?? "all") as ProjectCategory | "all";
  const difficulty = (searchParams.get("difficulty") ?? "all") as ProjectDifficulty | "all";
  const juniorOnly = searchParams.get("juniorOnly") === "true";
  const q = searchParams.get("q") ?? undefined;
  const language = (searchParams.get("language") ?? "fr") as "fr" | "en" | "es";

  const projects = await getProjects({ category, difficulty, juniorOnly, q, language });

  return NextResponse.json({ projects, total: projects.length });
}
