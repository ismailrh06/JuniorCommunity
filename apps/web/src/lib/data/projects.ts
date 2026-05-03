/**
 * Data layer for projects — reads from Supabase when configured, falls back to mock data.
 * Used by both server components (direct import) and API routes.
 */
import { getSupabaseServerClient } from "@juniorcode/db/server";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProjectCategory = "web" | "design" | "data" | "mobile" | "other";
export type ProjectDifficulty = "junior" | "intermediate" | "senior";

export interface ProjectListItem {
  id: string;
  title: string;
  client: string;
  budget: string; // formatted "300–500€"
  durationDays: number;
  durationLabel: string; // localized "2 weeks"
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  tags: string[];
  juniorOnly: boolean;
  requiredBadge: string | null; // badge name string
  status: string;
  createdAt: string;
}

export interface ProjectFilters {
  category?: ProjectCategory | "all";
  difficulty?: ProjectDifficulty | "all";
  juniorOnly?: boolean;
  q?: string;
  language?: "fr" | "en" | "es";
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: ProjectListItem[] = [
  {
    id: "1",
    title: "Landing page pour notre startup FinTech",
    client: "PayEasy",
    budget: "300–500€",
    durationDays: 14,
    durationLabel: "2 semaines",
    category: "web",
    difficulty: "junior",
    tags: ["Next.js", "Tailwind", "Figma"],
    juniorOnly: true,
    requiredBadge: "🌐 Web Developer L1",
    status: "open",
    createdAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Refonte UI de notre application mobile",
    client: "FoodTrack",
    budget: "400–700€",
    durationDays: 21,
    durationLabel: "3 semaines",
    category: "design",
    difficulty: "junior",
    tags: ["Figma", "UX", "Design System"],
    juniorOnly: false,
    requiredBadge: "🎨 UI Designer L1",
    status: "open",
    createdAt: "2026-05-03T00:00:00Z",
  },
  {
    id: "3",
    title: "Dashboard analytics pour une asso culturelle",
    client: "CultureParis",
    budget: "200–400€",
    durationDays: 10,
    durationLabel: "10 jours",
    category: "data",
    difficulty: "junior",
    tags: ["Python", "Pandas", "Streamlit"],
    juniorOnly: true,
    requiredBadge: "📊 Data Analyst L1",
    status: "open",
    createdAt: "2026-05-05T00:00:00Z",
  },
  {
    id: "4",
    title: "Site vitrine pour cabinet d'avocats",
    client: "Durand & Associés",
    budget: "500–800€",
    durationDays: 21,
    durationLabel: "3 semaines",
    category: "web",
    difficulty: "junior",
    tags: ["Next.js", "SEO", "CMS"],
    juniorOnly: false,
    requiredBadge: "🌐 Web Developer L1",
    status: "open",
    createdAt: "2026-05-07T00:00:00Z",
  },
];

function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url === "" || url.includes("placeholder");
}

function formatBudget(min: number, max: number): string {
  if (min === max) return `${min}€`;
  return `${min}–${max}€`;
}

function formatDuration(days: number, language: string): string {
  if (language === "en") {
    if (days < 7) return `${days} days`;
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }
  if (language === "es") {
    if (days < 7) return `${days} días`;
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "1 semana" : `${weeks} semanas`;
  }
  // fr (default)
  if (days < 7) return `${days} jours`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "1 semaine" : `${weeks} semaines`;
}

function applyFilters(projects: ProjectListItem[], filters: ProjectFilters): ProjectListItem[] {
  return projects.filter((p) => {
    if (filters.category && filters.category !== "all" && p.category !== filters.category) return false;
    if (filters.difficulty && filters.difficulty !== "all" && p.difficulty !== filters.difficulty) return false;
    if (filters.juniorOnly && !p.juniorOnly) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getProjects(filters: ProjectFilters = {}): Promise<ProjectListItem[]> {
  const language = filters.language ?? "fr";

  if (isMockMode()) {
    const projects = MOCK_PROJECTS.map((p) => ({
      ...p,
      durationLabel: formatDuration(p.durationDays, language),
    }));
    return applyFilters(projects, filters);
  }

  try {
    const supabase = await getSupabaseServerClient();
    let query = supabase
      .from("projects")
      .select("id, title, client_id, budget_min, budget_max, duration_days, category, difficulty, tags, junior_only, required_badge_id, status, created_at, badges!required_badge_id(name, icon)")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (filters.category && filters.category !== "all") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = (query as any).eq("category", filters.category);
    }
    if (filters.difficulty && filters.difficulty !== "all") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = (query as any).eq("difficulty", filters.difficulty);
    }
    if (filters.juniorOnly) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = (query as any).eq("junior_only", true);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (query as any);
    if (error || !data?.length) return applyFilters(MOCK_PROJECTS, filters);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: ProjectListItem[] = (data as any[]).map((row: any) => {
      const badgeLabel = row.badges
        ? `${row.badges.icon} ${row.badges.name}`
        : null;
      return {
        id: row.id as string,
        title: row.title as string,
        client: (row.client_id as string).slice(0, 8), // placeholder until we join profiles
        budget: formatBudget(row.budget_min as number, row.budget_max as number),
        durationDays: row.duration_days as number,
        durationLabel: formatDuration(row.duration_days as number, language),
        category: row.category as ProjectCategory,
        difficulty: row.difficulty as ProjectDifficulty,
        tags: row.tags as string[],
        juniorOnly: row.junior_only as boolean,
        requiredBadge: badgeLabel,
        status: row.status as string,
        createdAt: row.created_at as string,
      };
    });

    if (filters.q) return applyFilters(mapped, { q: filters.q });
    return mapped;
  } catch {
    return applyFilters(MOCK_PROJECTS, filters);
  }
}

export async function getProjectById(id: string, language = "fr"): Promise<ProjectListItem | null> {
  if (isMockMode()) {
    const project = MOCK_PROJECTS.find((p) => p.id === id) ?? null;
    if (!project) return null;
    return { ...project, durationLabel: formatDuration(project.durationDays, language) };
  }

  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("projects")
      .select("*, badges!required_badge_id(name, icon)")
      .eq("id", id)
      .single();

    if (error || !data) return MOCK_PROJECTS.find((p) => p.id === id) ?? null;

    return {
      id: data.id,
      title: data.title as string,
      client: data.client_id as string,
      budget: formatBudget(data.budget_min as number, data.budget_max as number),
      durationDays: data.duration_days as number,
      durationLabel: formatDuration(data.duration_days as number, language),
      category: data.category as ProjectCategory,
      difficulty: data.difficulty as ProjectDifficulty,
      tags: data.tags as string[],
      juniorOnly: data.junior_only as boolean,
      requiredBadge: data.badges ? `${data.badges.icon} ${data.badges.name}` : null,
      status: data.status as string,
      createdAt: data.created_at as string,
    };
  } catch {
    return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
  }
}
