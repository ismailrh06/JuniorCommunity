import Link from "next/link";
import { Clock, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  isCurrent?: boolean;
}

const TYPE_CONFIG = {
  lesson: {
    label: "Leçon",
    color: "bg-gray-100 text-gray-600",
    icon: BookOpen,
  },
  exercise: {
    label: "Exercice",
    color: "bg-learn-100 text-learn-700",
    icon: Zap,
  },
  project: { label: "Projet", color: "bg-brand-100 text-brand-700", icon: Zap },
} as const;

export function LessonCard({
  lesson,
  index,
  isCompleted,
  isLocked,
  isCurrent,
}: LessonCardProps) {
  const config = TYPE_CONFIG[lesson.type];
  const Icon = config.icon;

  return (
    <Link
      href={isLocked ? "#" : `/learn/module/${lesson.id}`}
      className={cn(
        "flex items-center gap-4 px-5 py-4 transition-all",
        isLocked
          ? "opacity-40 cursor-not-allowed pointer-events-none"
          : "hover:bg-gray-50 cursor-pointer",
        isCurrent && "bg-brand-50 border-l-2 border-brand-500",
      )}
      aria-disabled={isLocked}
    >
      {/* Step indicator */}
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all",
          isCompleted
            ? "bg-learn-500 text-white"
            : isCurrent
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-500",
        )}
      >
        {isCompleted ? "✓" : index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">
            {lesson.duration_minutes} min
          </span>
          {lesson.is_premium && (
            <span className="text-xs text-yellow-600 font-medium">
              ⭐ Premium
            </span>
          )}
        </div>
      </div>

      {/* Type badge */}
      <span
        className={cn(
          "text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 flex items-center gap-1",
          config.color,
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    </Link>
  );
}
