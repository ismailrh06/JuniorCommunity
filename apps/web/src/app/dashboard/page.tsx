import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@juniorcode/db/server";
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
}> = {
  fr: {
    greetings: {
      morning: "Bonjour",
      afternoon: "Bon après-midi",
      evening: "Bonsoir",
    },
    level: "Niveau",
    consecutiveDays: "jours de suite",
  },
  en: {
    greetings: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    level: "Level",
    consecutiveDays: "day streak",
  },
  es: {
    greetings: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
    },
    level: "Nivel",
    consecutiveDays: "días seguidos",
  },
};

export default async function DashboardPage() {
  const languageCookie = cookies().get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = COPY[language];
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
