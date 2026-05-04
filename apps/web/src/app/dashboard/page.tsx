import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { getSupabaseServerClient } from "@juniorcode/db/server";
import { getOnboardingFromCookies } from "@/lib/mock-auth";
import { Navbar } from "@/components/layout/navbar";
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

const COPY: Record<
  Language,
  {
    greetings: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    level: string;
    consecutiveDays: string;
    demoNotice: string;
    focusTitle: string;
    focusSubtitle: string;
    todayPlan: string;
    readinessTitle: string;
    readinessDescription: string;
    profileReady: string;
    learnReady: string;
    marketplaceReady: string;
    primaryCta: string;
    clientCta: string;
    adminCta: string;
    openMarketplace: string;
    goalMessages: Record<string, string>;
    recommendedPath: string;
    startPath: string;
    paths: Record<
      string,
      { label: string; emoji: string; firstModule: string }
    >;
  }
> = {
  fr: {
    greetings: {
      morning: "Bonjour",
      afternoon: "Bon après-midi",
      evening: "Bonsoir",
    },
    level: "Niveau",
    consecutiveDays: "jours de suite",
    demoNotice:
      "Mode démo — connecte Supabase pour activer toutes les fonctionnalités.",
    focusTitle: "Ton focus maintenant",
    focusSubtitle: "Une action claire pour avancer sans te disperser.",
    todayPlan: "Plan du jour",
    readinessTitle: "Préparation marketplace",
    readinessDescription:
      "Les signaux qui te rapprochent d'une première mission.",
    profileReady: "Profil complété",
    learnReady: "Parcours actif",
    marketplaceReady: "Accès projets",
    primaryCta: "Continuer mon parcours",
    clientCta: "Publier un projet",
    adminCta: "Ouvrir l'admin",
    openMarketplace: "Voir la marketplace",
    goalMessages: {
      learn:
        "Ton objectif : apprendre une nouvelle compétence. Commence par ton premier module !",
      mission:
        "Ton objectif : décrocher une première mission. Acquiers les badges requis pour postuler.",
      portfolio:
        "Ton objectif : construire ton portfolio. Complète ton parcours et publie tes projets.",
    },
    recommendedPath: "Ton parcours recommandé",
    startPath: "Commencer",
    paths: {
      "web-developer": {
        label: "Développeur Web",
        emoji: "💻",
        firstModule: "HTML & CSS Fondamentaux",
      },
      "ui-designer": {
        label: "Designer UI",
        emoji: "🎨",
        firstModule: "Design System & Figma",
      },
      "data-analyst": {
        label: "Data Analyst",
        emoji: "📊",
        firstModule: "Python & Pandas Intro",
      },
      algorithms: {
        label: "Algorithmique",
        emoji: "🧠",
        firstModule: "Structures de données",
      },
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
    focusTitle: "Your current focus",
    focusSubtitle: "One clear action to keep momentum.",
    todayPlan: "Today plan",
    readinessTitle: "Marketplace readiness",
    readinessDescription: "Signals that move you closer to a first mission.",
    profileReady: "Profile completed",
    learnReady: "Active path",
    marketplaceReady: "Project access",
    primaryCta: "Continue my path",
    clientCta: "Post a project",
    adminCta: "Open admin",
    openMarketplace: "Browse marketplace",
    goalMessages: {
      learn: "Your goal: learn a new skill. Start with your first module!",
      mission:
        "Your goal: land your first mission. Earn the required badges to apply.",
      portfolio:
        "Your goal: build your portfolio. Complete your path and publish your projects.",
    },
    recommendedPath: "Your recommended path",
    startPath: "Start",
    paths: {
      "web-developer": {
        label: "Web Developer",
        emoji: "💻",
        firstModule: "HTML & CSS Fundamentals",
      },
      "ui-designer": {
        label: "UI Designer",
        emoji: "🎨",
        firstModule: "Design System & Figma",
      },
      "data-analyst": {
        label: "Data Analyst",
        emoji: "📊",
        firstModule: "Python & Pandas Intro",
      },
      algorithms: {
        label: "Algorithms",
        emoji: "🧠",
        firstModule: "Data Structures",
      },
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
    demoNotice:
      "Modo demo — conecta Supabase para activar todas las funciones.",
    focusTitle: "Tu foco ahora",
    focusSubtitle: "Una acción clara para avanzar sin dispersarte.",
    todayPlan: "Plan de hoy",
    readinessTitle: "Preparación marketplace",
    readinessDescription: "Señales que te acercan a una primera misión.",
    profileReady: "Perfil completado",
    learnReady: "Ruta activa",
    marketplaceReady: "Acceso a proyectos",
    primaryCta: "Continuar mi ruta",
    clientCta: "Publicar proyecto",
    adminCta: "Abrir admin",
    openMarketplace: "Ver marketplace",
    goalMessages: {
      learn:
        "Tu objetivo: aprender una nueva habilidad. ¡Empieza con tu primer módulo!",
      mission:
        "Tu objetivo: conseguir tu primera misión. Gana las insignias requeridas.",
      portfolio:
        "Tu objetivo: construir tu portafolio. Completa tu camino y publica tus proyectos.",
    },
    recommendedPath: "Tu camino recomendado",
    startPath: "Empezar",
    paths: {
      "web-developer": {
        label: "Desarrollador Web",
        emoji: "💻",
        firstModule: "HTML & CSS Fundamentos",
      },
      "ui-designer": {
        label: "Diseñador UI",
        emoji: "🎨",
        firstModule: "Design System & Figma",
      },
      "data-analyst": {
        label: "Analista de Datos",
        emoji: "📊",
        firstModule: "Python & Pandas Intro",
      },
      algorithms: {
        label: "Algoritmia",
        emoji: "🧠",
        firstModule: "Estructuras de datos",
      },
    },
  },
};

/** Read the mock user cookie server-side */
function getMockUserFromCookies(
  cookieStore: ReturnType<typeof cookies>,
): { full_name: string; email: string; role: string } | null {
  const raw = cookieStore.get("jc-mock-user")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as {
      full_name: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}

type DashboardData = {
  name: string;
  role: string;
  currentLevel: number;
  xpPoints: number;
  streakDays: number;
  readyJunior: boolean;
  isPremium: boolean;
  completedCount: number;
  badgeCount: number;
  learnerProfile: any | null;
  badges: any[];
  recentProgress: any[];
  onboardingGoal?: string | null;
  onboardingPath?: string | null;
};

function getDashboardFocus(language: Language, data: DashboardData) {
  const copy = COPY[language];

  if (data.role === "admin") {
    return {
      icon: ShieldCheck,
      href: "/admin",
      label: copy.adminCta,
      title: "Admin console",
      description:
        "Surveille les utilisateurs, projets, candidatures et signaux analytics.",
    };
  }

  if (data.role === "client") {
    return {
      icon: Briefcase,
      href: "/marketplace",
      label: copy.clientCta,
      title: "Brief client",
      description:
        "Dépose une mission claire et trouve un junior vérifié pour avancer vite.",
    };
  }

  if (data.readyJunior) {
    return {
      icon: Trophy,
      href: "/marketplace",
      label: copy.openMarketplace,
      title: "Prêt pour les projets",
      description:
        "Ton profil est prêt : explore les missions adaptées à ton niveau.",
    };
  }

  return {
    icon: BookOpen,
    href: "/learn",
    label: copy.primaryCta,
    title: copy.recommendedPath,
    description: data.onboardingGoal
      ? (copy.goalMessages[data.onboardingGoal] ?? copy.focusSubtitle)
      : copy.focusSubtitle,
  };
}

function DashboardShell({
  language,
  data,
  children,
}: {
  language: Language;
  data: DashboardData;
  children: React.ReactNode;
}) {
  const copy = COPY[language];
  const focus = getDashboardFocus(language, data);
  const FocusIcon = focus.icon;
  const readiness = [
    { label: copy.profileReady, done: !!data.name && data.name !== "Junior" },
    {
      label: copy.learnReady,
      done:
        !!data.learnerProfile ||
        data.role === "client" ||
        data.role === "admin",
    },
    {
      label: copy.marketplaceReady,
      done: data.readyJunior || data.role === "client" || data.role === "admin",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-stretch">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="mb-2 text-sm text-slate-400">
                    {getGreeting(language)}
                  </p>
                  <h1 className="text-3xl font-extrabold tracking-normal sm:text-4xl">
                    {data.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                      {copy.level} {data.currentLevel}
                    </span>
                    {data.isPremium && (
                      <span className="rounded-full border border-brand-300/40 bg-brand-400/15 px-3 py-1 text-xs font-semibold text-brand-100">
                        Premium
                      </span>
                    )}
                    {data.readyJunior && (
                      <span className="rounded-full border border-yellow-300/40 bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-100">
                        Verified Junior
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {readiness.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 ${item.done ? "text-emerald-300" : "text-slate-500"}`}
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Target className="h-4 w-4 text-brand-300" />
                  {copy.focusTitle}
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-400/15 text-brand-200">
                    <FocusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">{focus.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {focus.description}
                    </p>
                  </div>
                </div>
                <Link
                  href={focus.href}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  {focus.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">{children}</div>
      </main>
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const languageCookie = cookieStore
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
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
    const onboarding = rawOnboarding
      ? getOnboardingFromCookies(`jc-onboarding=${rawOnboarding}`)
      : null;

    const pathKey = onboarding?.path ?? "web-developer";
    const pathInfo = copy.paths[pathKey] ?? copy.paths["web-developer"];
    const goalMsg = onboarding?.goal
      ? copy.goalMessages[onboarding.goal]
      : null;
    let goalIcon = <BookOpen className="h-4 w-4" />;
    if (onboarding?.goal === "mission")
      goalIcon = <Briefcase className="h-4 w-4" />;
    else if (onboarding?.goal === "portfolio")
      goalIcon = <Trophy className="h-4 w-4" />;

    const mockData: DashboardData = {
      name: mockUser.full_name,
      role: mockUser.role,
      currentLevel: 1,
      xpPoints: 0,
      streakDays: 0,
      readyJunior: false,
      isPremium: false,
      completedCount: 0,
      badgeCount: 0,
      learnerProfile: null,
      badges: [],
      recentProgress: [],
      onboardingGoal: onboarding?.goal,
      onboardingPath: onboarding?.path,
    };

    return (
      <DashboardShell language={language} data={mockData}>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {copy.demoNotice}{" "}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            supabase.com
          </a>
        </div>

        {onboarding && (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            {goalMsg && (
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <span className="mt-0.5 text-blue-600">{goalIcon}</span>
                <p className="text-sm text-blue-800">{goalMsg}</p>
              </div>
            )}
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-400">
                {copy.recommendedPath}
              </p>
              <h2 className="mt-2 font-bold text-slate-950">
                {pathInfo.emoji} {pathInfo.label}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Module 1 - {pathInfo.firstModule}
              </p>
              <Link
                href="/learn"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
              >
                {copy.startPath} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        <DashboardStats
          language={language}
          xpPoints={0}
          completedLessons={0}
          badgesEarned={0}
          currentLevel={1}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProgressSection
              language={language}
              learnerProfile={null}
              recentProgress={[]}
            />
            <RecentActivity language={language} recentProgress={[]} />
          </div>
          <div className="space-y-6">
            <QuickActions
              language={language}
              currentLevel={1}
              readyJunior={false}
            />
            <BadgesSection language={language} badges={[]} />
          </div>
        </div>
      </DashboardShell>
    );
  }

  // ── Real Supabase mode ───────────────────────────────────
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Generated DB types can lag behind migrations during local setup.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  // Load all data in parallel. Counts are fetched separately so stats are real,
  // not limited to the recent activity list.
  const [
    profileRes,
    learnerProfileRes,
    badgesRes,
    progressRes,
    completedCountRes,
  ] = await Promise.all([
    db.from("profiles").select("*").eq("id", user.id).single(),
    db
      .from("learner_profiles")
      .select("*, current_path:learning_paths(*)")
      .eq("user_id", user.id)
      .maybeSingle(),
    db.from("user_badges").select("*, badge:badges(*)").eq("user_id", user.id),
    db
      .from("user_progress")
      .select("*, lesson:lessons(title, type, duration_minutes)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5),
    db
      .from("user_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed"),
  ]);

  const profile = profileRes.data as {
    full_name: string | null;
    avatar_url: string | null;
    role: string;
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const learnerProfile = learnerProfileRes.data as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badges = (badgesRes.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentProgress = (progressRes.data ?? []) as any[];

  const completedCount = completedCountRes.count ?? recentProgress.length;
  const badgeCount = badges.length;
  const realData: DashboardData = {
    name: profile?.full_name ?? user.email?.split("@")[0] ?? "Junior",
    role: profile?.role ?? "learner",
    currentLevel: learnerProfile?.current_level ?? 0,
    xpPoints: learnerProfile?.xp_points ?? 0,
    streakDays: learnerProfile?.streak_days ?? 0,
    readyJunior: learnerProfile?.ready_junior ?? false,
    isPremium: learnerProfile?.is_premium ?? false,
    completedCount,
    badgeCount,
    learnerProfile,
    badges,
    recentProgress,
    onboardingGoal: learnerProfile?.onboarding_goal,
    onboardingPath: learnerProfile?.onboarding_path,
  };

  return (
    <DashboardShell language={language} data={realData}>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <DashboardStats
            language={language}
            xpPoints={learnerProfile?.xp_points ?? 0}
            completedLessons={completedCount}
            badgesEarned={badgeCount}
            currentLevel={learnerProfile?.current_level ?? 0}
          />

          <ProgressSection
            language={language}
            learnerProfile={learnerProfile}
            recentProgress={recentProgress}
          />
          <RecentActivity language={language} recentProgress={recentProgress} />
        </div>

        <div className="space-y-6">
          {realData.streakDays > 0 && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔥</div>
                <div>
                  <p className="text-2xl font-extrabold text-orange-700">
                    {realData.streakDays}
                  </p>
                  <p className="text-sm font-semibold text-orange-600">
                    {copy.consecutiveDays}
                  </p>
                </div>
              </div>
            </div>
          )}
          <QuickActions
            language={language}
            currentLevel={learnerProfile?.current_level ?? 0}
            readyJunior={learnerProfile?.ready_junior ?? false}
          />
          <BadgesSection language={language} badges={badges} />
        </div>
      </div>
    </DashboardShell>
  );
}

function getGreeting(language: Language): string {
  const copy = COPY[language].greetings;
  const hour = new Date().getHours();
  if (hour < 12) return copy.morning;
  if (hour < 18) return copy.afternoon;
  return copy.evening;
}
