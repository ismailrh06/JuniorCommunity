import { BadgeGrid } from "@/components/shared/badge-card";
import type { Language } from "@/lib/i18n/translations";

interface BadgesSectionProps {
  language: Language;
  badges: Array<{ badge?: { slug: string } | null }>;
}

const TITLES: Record<Language, string> = {
  fr: "Mes badges",
  en: "My badges",
  es: "Mis badges",
};

export function BadgesSection({ language, badges }: BadgesSectionProps) {
  const earnedSlugs = badges
    .map((b) => b.badge?.slug)
    .filter(Boolean) as Array<
      "html-basics" | "git-ready" | "js-starter" | "project-builder" | "verified-junior"
    >;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-950">{TITLES[language]}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">{earnedSlugs.length} / 5</span>
      </div>
      <BadgeGrid language={language} earnedSlugs={earnedSlugs} showLocked />
    </div>
  );
}
