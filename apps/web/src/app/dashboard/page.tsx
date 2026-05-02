import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Briefcase, Trophy, ArrowRight } from "lucide-react";
import { getSupabaseServerClient } from "@juniorcode/db/server";
import { getOnboardingFromCookies } from "@/lib/mock-auth";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ProgressSection } from "@/components/dashboard/progress-section";
import { BadgesSection } from "@/components/dashboard/badges-section";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Mon espace JuniorCode — progression, badges et projets.",
};

const COPY: Record<Language, {
  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  level: string;
  consecutiveDays: string;
  demoNotice: string;
  goalMessages: Record<string, string>;
  recommendedPath: string;
  startPath: string;
  paths: Record<string, { label: string; emoji: string; firstModule: string }>;
}> = {
  fr: {
    greetings: {
      morning: "Bonjour",
      afternoon: "Bon après-midi",
      evening: "Bonsoir",
    },
    level: "Niveau",
    consecutiveDays: "jours de suite",
    demoNotice: "Mode démo — connecte Supabase pour activer toutes les fonctionnalités.",
    goalMessages: {
      learn: "Ton objectif : apprendre une nouvelle compétence. Commence par ton premier module !",
      mission: "Ton objectif : décrocher une première mission. Acquiers les badges requis pour postuler.",
      portfolio: "Ton objectif : construire ton portfolio. Complète ton parcours et publie tes projets.",
    },
    recommendedPath: "Ton parcours recommandé",
    startPath: "Commencer",
    paths: {
      "web-developer": { label: "Développeur Web", emoji: "💻", firstModule: "HTML & CSS Fondamentaux" },
      "ui-designer": { label: "Designer UI", emoji: "🎨", firstModule: "Design System & Figma" },
      "data-analyst": { label: "Data Analyst", emoji: "📊", firstModule: "Python & Pandas Intro" },
      "algorithms": { label: "Algorithmique", emoji: "🧠", firstModule: "Structures de données" },
    },
  },
  en: {
    greetings: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    level: "Level",
    consecutiveDays: "day streak",
    demoNotice: "Demo mode — connect Supabase to enable all features.",
    goalMessages: {
      learn: "Your goal: learn a new skill. Start with your first module!",
      mission: "Your goal: land your first mission. Earn the required badges to apply.",
      portfolio: "Your goal: build your portfolio. Complete your path and publish your projects.",
    },
    recommendedPath: "Your recommended path",
    startPath: "Start",
    paths: {
      "web-developer": { label: "Web Developer", emoji: "💻", firstModule: "HTML & CSS Fundamentals" },
      "ui-designer": { label: "UI Designer", emoji: "🎨", firstModule: "Design System & Figma" },
      "data-analyst": { label: "Data Analyst", emoji: "📊", firstModule: "Python & Pandas Intro" },
      "algorithms": { label: "Algorithms", emoji: "🧠", firstModule: "Data Structures" },
    },
  },
  es: {
    greetings: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
    },
    level: "Nivel",
    consecutiveDays: "días seguidos",
    demoNotice: "Modo demo — conecta Supabase para activar todas las funciones.",
    goalMessages: {
      learn: "Tu objetivo: aprender una nueva habilidad. ¡Empieza con tu primer módulo!",
      mission: "Tu objetivo: conseguir tu primera misión. Gana las insignias requeridas.",
      portfolio: "Tu objetivo: construir tu portafolio. Completa tu camino y publica tus proyectos.",
    },
    recommendedPath: "Tu camino recomendado",
    startPath: "Empezar",
    paths: {
      "web-developer": { label: "Desarrollador Web", emoji: "💻", firstModule: "HTML & CSS Fundamentos" },
      "ui-designer": { label: "Diseñador UI", emoji: "🎨", firstModule: "Design System & Figma" },
      "data-analyst": { label: "Analista de Datos", emoji: "📊", firstModule: "Python & Pandas Intro" },
      "algorithms": { label: "Algoritmia", emoji: "🧠", firstModule: "Estructuras de datos" },
    },
  },
};

/** Read the mock user cookie server-side */
function getMockUserFromCookies(cookieStore: ReturnType<typeof cookies>): { full_name: string; email: string; role: string } | null {
  const raw = cookieStore.get("jc-mock-user")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as { full_name: string; email: string; role: string };
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const languageCookie = cookieStore.get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = COPY[language];

  // ── Detect mock mode (Supabase not configured) ──────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMockMode = supabaseUrl.includes("placeholder") || supabaseUrl === "";

  if (isMockMode) {
    const mockUser = getMockUserFromCookies(cookieStore);
    if (!mockUser) redirect("/auth/login");

    const rawOnboarding = cookieStore.get("jc-onboarding")?.value ?? "";
    const onboarding = rawOnboarding ? getOnboardingFromCookies(
      `jc-onboarding=${rawOnboarding}`
    ) : null;

    const pathKey = onboarding?.path ?? "web-developer";
    const pathInfo = copy.paths[pathKey] ?? copy.paths["web-developer"];
    const goalMsg = onboarding?.goal ? copy.goalMessages[onboarding.goal] : null;
    let goalIcon = <BookOpen className="h-4 w-4" />;
    if (onboarding?.goal === "mission") goalIcon = <Briefcase className="h-4 w-4" />;
    else if (onboarding?.goal === "portfolio") goalIcon = <Trophy className="h-4 w-4" />;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Demo banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-xs text-amber-700">
            ⚠️ {copy.demoNotice}{" "}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              supabase.com
            </a>
          </p>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {getGreeting(language)}, 👋
              </p>
              <h1 className="text-2xl font-bold text-gray-900">
                {mockUser.full_name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">
                  {copy.level} 1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

          {/* Onboarding-based recommendation */}
          {onboarding && (
            <div className="space-y-4">
              {/* Goal message */}
              {goalMsg && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <span className="mt-0.5 text-blue-600">{goalIcon}</span>
                  <p className="text-sm text-blue-800">{goalMsg}</p>
                </div>
              )}

              {/* Path card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{copy.recommendedPath}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {pathInfo.emoji} {pathInfo.label}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Module 1 — {pathInfo.firstModule}
                    </p>
                  </div>
                  <Link
                    href="/learn"
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    {copy.startPath} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <DashboardStats language={language} xpPoints={0} completedLessons={0} badgesEarned={0} currentLevel={1} />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProgressSection language={language} learnerProfile={null} recentProgress={[]} />
              <RecentActivity language={language} recentProgress={[]} />
            </div>
            <div className="space-y-6">
              <QuickActions language={language} currentLevel={1} readyJunior={false} />
              <BadgesSection language={language} badges={[]} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Real Supabase mode ───────────────────────────────────
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Load all data in parallel
  const [profileRes, learnerProfileRes, badgesRes, progressRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("learner_profiles")
      .select("*, current_path:learning_paths(*)")
      .eq("user_id", user.id)
      .single(),
    supabase.from("user_badges")
      .select("*, badge:badges(*)")
      .eq("user_id", user.id),
    supabase.from("user_progress")
      .select("*, lesson:lessons(title, type, duration_minutes)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5),
  ]);

  const profile = profileRes.data as { full_name: string; avatar_url: string | null; role: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const learnerProfile = learnerProfileRes.data as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badges = (badgesRes.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentProgress = (progressRes.data ?? []) as any[];

  const completedCount = recentProgress.length;
  const badgeCount = badges.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {getGreeting(language)}, 👋
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.full_name ?? "Junior"}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {learnerProfile?.ready_junior && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                  🟡 Verified Junior
                </span>
              )}
              {learnerProfile?.is_premium && (
                <span className="text-xs bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full font-medium">
                  ⭐ Premium
                </span>
              )}
              <span className="text-xs text-gray-400">
                {copy.level} {learnerProfile?.current_level ?? 0}
              </span>
            </div>
          </div>

          {/* Streak */}
          {(learnerProfile?.streak_days ?? 0) > 0 && (
            <div className="hidden sm:flex flex-col items-center bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold text-orange-600">
                {learnerProfile?.streak_days}
              </span>
              <span className="text-xs text-orange-500">{copy.consecutiveDays}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Stats row */}
        <DashboardStats
          language={language}
          xpPoints={learnerProfile?.xp_points ?? 0}
          completedLessons={completedCount}
          badgesEarned={badgeCount}
          currentLevel={learnerProfile?.current_level ?? 0}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressSection
              language={language}
              learnerProfile={learnerProfile}
              recentProgress={recentProgress}
            />
            <RecentActivity language={language} recentProgress={recentProgress} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions
              language={language}
              currentLevel={learnerProfile?.current_level ?? 0}
              readyJunior={learnerProfile?.ready_junior ?? false}
            />
            <BadgesSection language={language} badges={badges} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(language: Language): string {
  const copy = COPY[language].greetings;
  const hour = new Date().getHours();
  if (hour < 12) return copy.morning;
  if (hour < 18) return copy.afternoon;
  return copy.evening;
}
