import Link from "next/link";
import { BookOpen, Briefcase, ArrowRight, Lock, Settings } from "lucide-react";
import type { Language } from "@/lib/i18n/translations";

interface QuickActionsProps {
  language: Language;
  currentLevel: number;
  readyJunior: boolean;
}

const COPY: Record<
  Language,
  {
    title: string;
    continueLearning: string;
    continueDescription: string;
    seeProjects: string;
    applyProjects: string;
    settings: string;
    settingsDescription: string;
    unlockAtLevel: (currentLevel: number) => string;
  }
> = {
  fr: {
    title: "Actions rapides",
    continueLearning: "Continuer d'apprendre",
    continueDescription: "Reprendre là où tu t'es arrêté",
    seeProjects: "Voir les projets",
    applyProjects: "Postule à des projets réels",
    settings: "Compléter mon profil",
    settingsDescription: "Ajoute portfolio, bio et liens utiles",
    unlockAtLevel: (currentLevel) =>
      `Débloque au niveau 4 (niveau actuel : ${currentLevel})`,
  },
  en: {
    title: "Quick actions",
    continueLearning: "Keep learning",
    continueDescription: "Pick up where you left off",
    seeProjects: "See projects",
    applyProjects: "Apply to real projects",
    settings: "Complete profile",
    settingsDescription: "Add portfolio, bio and useful links",
    unlockAtLevel: (currentLevel) =>
      `Unlocks at level 4 (current level: ${currentLevel})`,
  },
  es: {
    title: "Acciones rápidas",
    continueLearning: "Seguir aprendiendo",
    continueDescription: "Retoma donde lo dejaste",
    seeProjects: "Ver proyectos",
    applyProjects: "Postúlate a proyectos reales",
    settings: "Completar perfil",
    settingsDescription: "Añade portfolio, bio y enlaces útiles",
    unlockAtLevel: (currentLevel) =>
      `Se desbloquea en el nivel 4 (nivel actual: ${currentLevel})`,
  },
};

export function QuickActions({
  language,
  currentLevel,
  readyJunior,
}: QuickActionsProps) {
  const copy = COPY[language];
  const actions = [
    {
      href: "/learn",
      label: copy.continueLearning,
      description: copy.continueDescription,
      icon: BookOpen,
      color: "border-learn-200 hover:border-learn-400 hover:bg-learn-50",
      iconColor: "bg-learn-100 text-learn-600",
      locked: false,
    },
    {
      href: "/settings",
      label: copy.settings,
      description: copy.settingsDescription,
      icon: Settings,
      color: "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
      iconColor: "bg-slate-100 text-slate-600",
      locked: false,
    },
    {
      href: readyJunior ? "/marketplace" : "#",
      label: copy.seeProjects,
      description: readyJunior
        ? copy.applyProjects
        : copy.unlockAtLevel(currentLevel),
      icon: Briefcase,
      color: readyJunior
        ? "border-market-200 hover:border-market-400 hover:bg-market-50"
        : "border-gray-200 opacity-50 cursor-not-allowed",
      iconColor: readyJunior
        ? "bg-market-100 text-market-600"
        : "bg-gray-100 text-gray-400",
      locked: !readyJunior,
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-950 mb-4">{copy.title}</h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              aria-disabled={action.locked}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all group ${action.color}`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${action.iconColor}`}
              >
                {action.locked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-950 truncate">
                  {action.label}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {action.description}
                </p>
              </div>
              {!action.locked && (
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
