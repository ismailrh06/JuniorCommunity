import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { calculateProgress } from "@/lib/utils";
import type { LearnerProfile, UserProgress } from "@/types";
import type { Language } from "@/lib/i18n/translations";

interface ProgressSectionProps {
  language: Language;
  learnerProfile: LearnerProfile | null;
  recentProgress: UserProgress[];
}

const TOTAL_MODULES_PER_LEVEL = [1, 6, 2, 3, 1]; // Niveau 0 → 4

const COPY: Record<Language, {
  myPath: string;
  noPath: string;
  choosePath: string;
  seeAll: string;
  level: string;
  completedModules: (completed: number, total: number) => string;
  continuePath: string;
  levels: Array<{ label: string; color: string }>;
}> = {
  fr: {
    myPath: "Mon parcours",
    noPath: "Tu n'as pas encore choisi de parcours.",
    choosePath: "Choisir mon parcours",
    seeAll: "Voir tout",
    level: "Niveau",
    completedModules: (completed, total) => `${completed} / ${total} modules terminés`,
    continuePath: "Continuer le parcours",
    levels: [
      { label: "Onboarding", color: "bg-gray-400" },
      { label: "Fondations", color: "bg-learn-500" },
      { label: "1er projet guidé", color: "bg-brand-500" },
      { label: "Préparation", color: "bg-market-500" },
      { label: "Projet réel", color: "bg-yellow-400" },
    ],
  },
  en: {
    myPath: "My path",
    noPath: "You have not chosen a learning path yet.",
    choosePath: "Choose my path",
    seeAll: "See all",
    level: "Level",
    completedModules: (completed, total) => `${completed} / ${total} modules completed`,
    continuePath: "Continue path",
    levels: [
      { label: "Onboarding", color: "bg-gray-400" },
      { label: "Foundations", color: "bg-learn-500" },
      { label: "First guided project", color: "bg-brand-500" },
      { label: "Preparation", color: "bg-market-500" },
      { label: "Real project", color: "bg-yellow-400" },
    ],
  },
  es: {
    myPath: "Mi ruta",
    noPath: "Aún no has elegido una ruta.",
    choosePath: "Elegir mi ruta",
    seeAll: "Ver todo",
    level: "Nivel",
    completedModules: (completed, total) => `${completed} / ${total} módulos terminados`,
    continuePath: "Continuar la ruta",
    levels: [
      { label: "Onboarding", color: "bg-gray-400" },
      { label: "Fundamentos", color: "bg-learn-500" },
      { label: "Primer proyecto guiado", color: "bg-brand-500" },
      { label: "Preparación", color: "bg-market-500" },
      { label: "Proyecto real", color: "bg-yellow-400" },
    ],
  },
};

export function ProgressSection({ language, learnerProfile, recentProgress }: ProgressSectionProps) {
  const copy = COPY[language];

  if (!learnerProfile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{copy.myPath}</h2>
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm mb-4">{copy.noPath}</p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            {copy.choosePath}
          </Link>
        </div>
      </div>
    );
  }

  const currentLevel = learnerProfile.current_level;
  const completedInLevel = recentProgress.length;
  const totalInLevel = TOTAL_MODULES_PER_LEVEL[currentLevel] ?? 1;
  const progressPercent = calculateProgress(completedInLevel, totalInLevel);

  const LEVELS = copy.levels;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-900">{copy.myPath}</h2>
        <Link
          href="/learn"
          className="text-sm text-brand-600 hover:underline flex items-center gap-1"
        >
          {copy.seeAll} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Level progress */}
      <div className="flex items-center gap-3 mb-5">
        {LEVELS.map((level, idx) => (
          <div key={level.label} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`h-2 w-full rounded-full transition-all ${
              idx < currentLevel
                ? level.color
                : idx === currentLevel
                ? "bg-gray-200"
                : "bg-gray-100"
            }`}>
              {idx === currentLevel && (
                <div
                  className={`h-full rounded-full transition-all ${level.color}`}
                  style={{ width: `${progressPercent}%` }}
                />
              )}
            </div>
            <span className="text-xs text-gray-400 hidden sm:block truncate w-full text-center">
              N{idx}
            </span>
          </div>
        ))}
      </div>

      {/* Current level info */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {copy.level} {currentLevel} — {LEVELS[currentLevel]?.label}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {copy.completedModules(completedInLevel, totalInLevel)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{progressPercent}%</span>
        </div>
      </div>

      {/* Continue CTA */}
      <Link
        href="/learn"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-brand-200 text-brand-600 rounded-xl text-sm font-medium hover:bg-brand-50 transition-colors"
      >
        {copy.continuePath}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
