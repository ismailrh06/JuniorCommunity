import { formatRelativeTime } from "@/lib/utils";
import { BookOpen, Zap, FolderOpen } from "lucide-react";
import type { UserProgress } from "@/types";
import type { Language } from "@/lib/i18n/translations";

interface RecentActivityProps {
  language: Language;
  recentProgress: UserProgress[];
}

const TYPE_ICONS = {
  lesson:   { icon: BookOpen, color: "bg-gray-100 text-gray-500" },
  exercise: { icon: Zap,      color: "bg-learn-100 text-learn-600" },
  project:  { icon: FolderOpen, color: "bg-brand-100 text-brand-600" },
};

const COPY: Record<Language, {
  title: string;
  empty: string;
  completedModule: string;
  completed: string;
}> = {
  fr: {
    title: "Activité récente",
    empty: "Aucune activité pour l'instant. Commence un module ! 🚀",
    completedModule: "Module terminé",
    completed: "Terminé",
  },
  en: {
    title: "Recent activity",
    empty: "No activity yet. Start a module! 🚀",
    completedModule: "Completed module",
    completed: "Completed",
  },
  es: {
    title: "Actividad reciente",
    empty: "Aún no hay actividad. Empieza un módulo! 🚀",
    completedModule: "Módulo terminado",
    completed: "Terminado",
  },
};

export function RecentActivity({ language, recentProgress }: RecentActivityProps) {
  const copy = COPY[language];

  if (recentProgress.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">{copy.title}</h3>
        <p className="text-sm text-gray-400 text-center py-4">
          {copy.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{copy.title}</h3>
      <div className="space-y-3">
        {recentProgress.map((progress) => {
          const lesson = progress.lesson as { title: string; type: string; duration_minutes: number } | undefined;
          const type = (lesson?.type ?? "lesson") as keyof typeof TYPE_ICONS;
          const config = TYPE_ICONS[type] ?? TYPE_ICONS.lesson;
          const Icon = config.icon;

          return (
            <div key={progress.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {lesson?.title ?? copy.completedModule}
                </p>
                <p className="text-xs text-gray-400">
                  {progress.completed_at ? formatRelativeTime(progress.completed_at, language) : "—"}
                </p>
              </div>
              <span className="text-xs text-learn-600 font-medium bg-learn-50 px-2 py-0.5 rounded-full flex-shrink-0">
                ✓ {copy.completed}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
