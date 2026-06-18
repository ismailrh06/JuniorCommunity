import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n/translations";

const BADGE_CONFIG = {
  "html-basics": {
    icon: "",
    label: "HTML Basics",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  "git-ready": {
    icon: "",
    label: "Git Ready",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  "js-starter": {
    icon: "",
    label: "JS Starter",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  "project-builder": {
    icon: "🟠",
    label: "Project Builder",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  "verified-junior": {
    icon: "🟡",
    label: "Verified Junior",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
} as const;

type BadgeSlug = keyof typeof BADGE_CONFIG;

interface BadgeCardProps {
  language: Language;
  slug: BadgeSlug;
  earnedAt?: string;
  locked?: boolean;
  size?: "sm" | "md" | "lg";
}

const COPY: Record<
  Language,
  {
    lockedTitle: string;
    earnedTitle: (earnedAt?: string) => string;
    locked: string;
    locale: string;
  }
> = {
  fr: {
    lockedTitle: "Badge verrouillé",
    earnedTitle: (earnedAt) => `Obtenu le ${earnedAt ?? ""}`,
    locked: "Verrouillé",
    locale: "fr-FR",
  },
  en: {
    lockedTitle: "Locked badge",
    earnedTitle: (earnedAt) => `Earned on ${earnedAt ?? ""}`,
    locked: "Locked",
    locale: "en-US",
  },
  es: {
    lockedTitle: "Badge bloqueado",
    earnedTitle: (earnedAt) => `Obtenido el ${earnedAt ?? ""}`,
    locked: "Bloqueado",
    locale: "es-ES",
  },
};

export function BadgeCard({
  language,
  slug,
  earnedAt,
  locked = false,
  size = "md",
}: BadgeCardProps) {
  const config = BADGE_CONFIG[slug];
  const copy = COPY[language];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
        locked
          ? "bg-gray-50 border-gray-200 opacity-40 grayscale"
          : `${config.color} border`,
        size === "sm" && "p-3",
        size === "lg" && "p-6",
      )}
      title={locked ? copy.lockedTitle : copy.earnedTitle(earnedAt)}
    >
      <span
        className={cn(
          "block",
          size === "sm" ? "text-2xl" : size === "lg" ? "text-5xl" : "text-3xl",
        )}
      >
        {config.icon}
      </span>
      <span
        className={cn(
          "font-semibold text-center leading-tight",
          size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm",
        )}
      >
        {config.label}
      </span>
      {earnedAt && !locked && (
        <span className="text-xs opacity-60">
          {new Date(earnedAt).toLocaleDateString(copy.locale, {
            month: "short",
            year: "numeric",
          })}
        </span>
      )}
      {locked && <span className="text-xs text-gray-400">{copy.locked}</span>}
    </div>
  );
}

// Grille de tous les badges (profil public)
interface BadgeGridProps {
  language: Language;
  earnedSlugs: BadgeSlug[];
  showLocked?: boolean;
}

export function BadgeGrid({
  language,
  earnedSlugs,
  showLocked = true,
}: BadgeGridProps) {
  const allSlugs = Object.keys(BADGE_CONFIG) as BadgeSlug[];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {allSlugs.map((slug) => {
        const isEarned = earnedSlugs.includes(slug);
        if (!isEarned && !showLocked) return null;
        return (
          <BadgeCard
            language={language}
            key={slug}
            slug={slug}
            locked={!isEarned}
            size="sm"
          />
        );
      })}
    </div>
  );
}
