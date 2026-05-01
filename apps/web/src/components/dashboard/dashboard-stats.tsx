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
const LEVEL_COLORS = [
  "text-gray-600 bg-gray-100",
  "text-learn-700 bg-learn-100",
  "text-brand-700 bg-brand-100",
  "text-market-700 bg-market-100",
  "text-yellow-700 bg-yellow-100",
];

export function DashboardStats({ language, xpPoints, completedLessons, badgesEarned, currentLevel }: DashboardStatsProps) {
  const copy = COPY[language];
  const levelLabels = LEVEL_LABELS[language];
  const stats = [
    {
      label: copy.xpPoints,
      value: xpPoints.toLocaleString(copy.locale),
      icon: Zap,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-500",
    },
    {
      label: copy.completedModules,
      value: completedLessons,
      icon: BookOpen,
      color: "text-learn-700 bg-learn-50 border-learn-200",
      iconColor: "text-learn-500",
    },
    {
      label: copy.earnedBadges,
      value: `${badgesEarned} / 5`,
      icon: Award,
      color: "text-brand-700 bg-brand-50 border-brand-200",
      iconColor: "text-brand-500",
    },
    {
      label: copy.currentLevel,
      value: `${copy.levelPrefix}${currentLevel} — ${levelLabels[currentLevel] ?? copy.completed}`,
      icon: TrendingUp,
      color: LEVEL_COLORS[currentLevel] ?? "text-gray-600 bg-gray-100",
      iconColor: "opacity-70",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-2xl border p-4 flex flex-col gap-2 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium opacity-70">{stat.label}</span>
              <Icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <span className="text-xl font-bold">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}
