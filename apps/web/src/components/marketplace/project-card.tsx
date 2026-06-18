import Link from "next/link";
import { Clock, Tag, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<Project["category"], string> = {
  web: "Développement Web",
  design: "Design",
  data: "Data",
  mobile: "Mobile",
  other: "Autre",
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const budgetLabel =
    project.budget_min === project.budget_max
      ? `${project.budget_min}€`
      : `${project.budget_min}–${project.budget_max}€`;

  return (
    <Link
      href={`/marketplace/${project.id}`}
      className={cn(
        "group block bg-white rounded-2xl border border-gray-200 transition-all hover:shadow-md hover:border-brand-300",
        compact ? "p-4" : "p-6",
      )}
    >
      {/* Header badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {project.junior_only && (
          <span className="text-xs bg-learn-100 text-learn-700 px-2 py-0.5 rounded-full font-medium">
             Junior Only
          </span>
        )}
        {project.is_sponsored && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            ⭐ Sponsorisé
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold text-gray-900 group-hover:text-brand-600 transition-colors mb-1",
          compact ? "text-sm" : "text-base",
        )}
      >
        {project.title}
      </h3>

      {/* Client */}
      {!compact && (
        <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {/* client name loaded via join in production */}
          Client vérifié
        </p>
      )}

      {/* Description */}
      {!compact && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {project.description}
        </p>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {project.duration_days} jours
        </div>
        <span className="font-bold text-gray-900">{budgetLabel}</span>
      </div>
    </Link>
  );
}
