import { Zap, BookOpen, Award, TrendingUp } from "lucide-react";
import type { Language } from "@/lib/i18n/translations";

interface DashboardStatsProps {
  language: Language;
  xpPoints: number;
  completedLessons: number;
  badgesEarned: number;
  currentLevel: number;
}

const LEVEL_LABELS: Record<Language, string[]> = {
  fr: ["Onboarding", "Fondations", "1er projet", "Préparation", "Projet réel"],
  en: ["Onboarding", "Foundations", "First project", "Preparation", "Real project"],
  es: ["Onboarding", "Fundamentos", "Primer proyecto", "Preparación", "Proyecto real"],
};
const COPY: Record<Language, {
  xpPoints: string;
  completedModules: string;
  earnedBadges: string;
  currentLevel: string;
  levelPrefix: string;
  completed: string;
  locale: string;
}> = {
  fr: {
    xpPoints: "Points XP",
    completedModules: "Modules terminés",
    earnedBadges: "Badges obtenus",
    currentLevel: "Niveau actuel",
    levelPrefix: "N",
    completed: "Terminé",
    locale: "fr-FR",
  },
  en: {
    xpPoints: "XP points",
    completedModules: "Completed modules",
    earnedBadges: "Earned badges",
    currentLevel: "Current level",
    levelPrefix: "L",
    completed: "Completed",
    locale: "en-US",
  },
  es: {
    xpPoints: "Puntos XP",
    completedModules: "Módulos terminados",
    earnedBadges: "Badges obtenidos",
    currentLevel: "Nivel actual",
    levelPrefix: "N",
    completed: "Terminado",
    locale: "es-ES",
  },
};
export function DashboardStats({ language, xpPoints, completedLessons, badgesEarned, currentLevel }: DashboardStatsProps) {
  const copy = COPY[language];
  const levelLabels = LEVEL_LABELS[language];
  const stats = [
    {
      label: copy.xpPoints,
      value: xpPoints.toLocaleString(copy.locale),
      icon: Zap,
      accent: "from-yellow-500 to-orange-500",
      iconColor: "text-yellow-600 bg-yellow-50",
    },
    {
      label: copy.completedModules,
      value: completedLessons,
      icon: BookOpen,
      accent: "from-emerald-500 to-teal-500",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      label: copy.earnedBadges,
      value: `${badgesEarned} / 5`,
      icon: Award,
      accent: "from-blue-500 to-indigo-500",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      label: copy.currentLevel,
      value: `${copy.levelPrefix}${currentLevel} — ${levelLabels[currentLevel] ?? copy.completed}`,
      icon: TrendingUp,
      accent: "from-fuchsia-500 to-purple-500",
      iconColor: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`} />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">{stat.label}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconColor}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <span className="mt-3 text-lg sm:text-2xl font-extrabold text-slate-950 truncate">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}
