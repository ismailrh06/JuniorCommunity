import { NextResponse } from "next/server";
import { getLearningPaths, getLessonsForPath } from "@/lib/data/learn";

/**
 * GET /api/learn
 * Returns all active learning paths.
 *
 * GET /api/learn?path=web-developer
 * Returns the lessons for a specific path.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathSlug = searchParams.get("path");

  if (pathSlug) {
    const lessons = await getLessonsForPath(pathSlug);
    return NextResponse.json({ lessons, path: pathSlug });
  }

  const paths = await getLearningPaths();
  return NextResponse.json({ paths, total: paths.length });
}
