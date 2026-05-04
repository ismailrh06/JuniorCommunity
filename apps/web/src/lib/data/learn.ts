// @ts-nocheck
/**
 * Data layer for learning content — reads from Supabase when configured, falls back to mock data.
 */
import { getSupabaseServerClient } from "@juniorcode/db/server";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  modulesCount: number;
  estimatedDuration: string;
  isActive: boolean;
}

export interface Lesson {
  id: string;
  pathId: string;
  title: string;
  description: string | null;
  type: "lesson" | "exercise" | "project";
  orderIndex: number;
  durationMinutes: number;
  level: 0 | 1 | 2 | 3 | 4;
  badgeId: string | null;
  isPremium: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PATHS: LearningPath[] = [
  {
    id: "mock-web",
    slug: "web-developer",
    title: "Développeur Web",
    description:
      "HTML, CSS, JavaScript, React. De zéro à ton premier projet live.",
    icon: "💻",
    modulesCount: 12,
    estimatedDuration: "6-8 semaines",
    isActive: true,
  },
  {
    id: "mock-design",
    slug: "ui-designer",
    title: "Designer UI",
    description:
      "Figma, principes design, création de maquettes et design systems.",
    icon: "🎨",
    modulesCount: 8,
    estimatedDuration: "4-5 semaines",
    isActive: true,
  },
  {
    id: "mock-data",
    slug: "data-analyst",
    title: "Data Analyst Junior",
    description:
      "Python, pandas, visualisation de données, premiers dashboards.",
    icon: "📊",
    modulesCount: 10,
    estimatedDuration: "5-6 semaines",
    isActive: true,
  },
  {
    id: "mock-prog",
    slug: "programming-languages",
    title: "Langages de programmation",
    description:
      "Python, Java, C, C++, C#, TypeScript. Choisis le langage adapté à ton objectif.",
    icon: "⌨️",
    modulesCount: 7,
    estimatedDuration: "6-7 semaines",
    isActive: true,
  },
  {
    id: "mock-algo",
    slug: "algorithms",
    title: "Algorithmes fondamentaux",
    description:
      "Logique, Big O, tableaux, récursion, tri, recherche, graphes.",
    icon: "🧠",
    modulesCount: 10,
    estimatedDuration: "7-8 semaines",
    isActive: true,
  },
];

const MOCK_LESSONS: Record<string, Lesson[]> = {
  "web-developer": [
    {
      id: "w1",
      pathId: "mock-web",
      title: "Introduction au Web",
      description: "HTTP, DNS, modèle client-serveur.",
      type: "lesson",
      orderIndex: 1,
      durationMinutes: 20,
      level: 0,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w2",
      pathId: "mock-web",
      title: "HTML fondamentaux",
      description: "Balises sémantiques, formulaires, accessibilité.",
      type: "lesson",
      orderIndex: 2,
      durationMinutes: 45,
      level: 0,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w3",
      pathId: "mock-web",
      title: "CSS de base",
      description: "Sélecteurs, boîte CSS, couleurs, typographie.",
      type: "lesson",
      orderIndex: 3,
      durationMinutes: 45,
      level: 0,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w4",
      pathId: "mock-web",
      title: "Flexbox & Grid",
      description: "Mise en page moderne.",
      type: "lesson",
      orderIndex: 4,
      durationMinutes: 40,
      level: 1,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w5",
      pathId: "mock-web",
      title: "Projet : Portfolio statique",
      description: "Crée et déploie ton portfolio.",
      type: "project",
      orderIndex: 5,
      durationMinutes: 90,
      level: 1,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w6",
      pathId: "mock-web",
      title: "JavaScript fondamentaux",
      description: "Variables, DOM, fonctions, boucles.",
      type: "lesson",
      orderIndex: 6,
      durationMinutes: 60,
      level: 1,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w7",
      pathId: "mock-web",
      title: "Git & GitHub",
      description: "Versionner son code, branches, PRs.",
      type: "lesson",
      orderIndex: 7,
      durationMinutes: 40,
      level: 1,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w8",
      pathId: "mock-web",
      title: "Fetch API & async/await",
      description: "Requêtes HTTP, Promises.",
      type: "lesson",
      orderIndex: 8,
      durationMinutes: 45,
      level: 2,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w9",
      pathId: "mock-web",
      title: "Introduction à React",
      description: "Composants, JSX, props, hooks.",
      type: "lesson",
      orderIndex: 9,
      durationMinutes: 60,
      level: 2,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w10",
      pathId: "mock-web",
      title: "Projet JS : Quiz interactif",
      description: "App quiz complète.",
      type: "project",
      orderIndex: 10,
      durationMinutes: 120,
      level: 2,
      badgeId: null,
      isPremium: false,
    },
    {
      id: "w11",
      pathId: "mock-web",
      title: "Next.js & déploiement",
      description: "App Router, déploiement Vercel.",
      type: "lesson",
      orderIndex: 11,
      durationMinutes: 60,
      level: 3,
      badgeId: null,
      isPremium: true,
    },
    {
      id: "w12",
      pathId: "mock-web",
      title: "Projet final : App complète",
      description: "App full-stack Next.js + Supabase.",
      type: "project",
      orderIndex: 12,
      durationMinutes: 180,
      level: 3,
      badgeId: null,
      isPremium: true,
    },
  ],
};

function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url === "" || url.includes("placeholder");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getLearningPaths(): Promise<LearningPath[]> {
  if (isMockMode()) return MOCK_PATHS;

  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("learning_paths")
      .select(
        "id, slug, title, description, icon, modules_count, estimated_duration, is_active",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error || !data?.length) return MOCK_PATHS;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description ?? "",
      icon: row.icon ?? "📚",
      modulesCount: row.modules_count,
      estimatedDuration: row.estimated_duration ?? "",
      isActive: row.is_active,
    }));
  } catch {
    return MOCK_PATHS;
  }
}

export async function getLessonsForPath(pathSlug: string): Promise<Lesson[]> {
  if (isMockMode()) {
    return MOCK_LESSONS[pathSlug] ?? [];
  }

  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pathData } = await (supabase as any)
      .from("learning_paths")
      .select("id")
      .eq("slug", pathSlug)
      .single();

    if (!pathData) return MOCK_LESSONS[pathSlug] ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("lessons")
      .select(
        "id, path_id, title, description, type, order_index, duration_minutes, level, badge_id, is_premium",
      )
      .eq("path_id", pathData.id)
      .order("order_index", { ascending: true });

    if (error || !data?.length) return MOCK_LESSONS[pathSlug] ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((row: any) => ({
      id: row.id,
      pathId: row.path_id,
      title: row.title,
      description: row.description ?? null,
      type: row.type as Lesson["type"],
      orderIndex: row.order_index,
      durationMinutes: row.duration_minutes,
      level: row.level as Lesson["level"],
      badgeId: row.badge_id ?? null,
      isPremium: row.is_premium,
    }));
  } catch {
    return MOCK_LESSONS[pathSlug] ?? [];
  }
}
