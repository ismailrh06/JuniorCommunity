import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, PlayCircle, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Types
interface Module {
  id: string;
  title: string;
  duration: string;
  type: "lesson" | "exercise" | "project";
  free?: boolean;
}

interface LevelData {
  level: number;
  title: string;
  modules: Module[];
}

// ─── Curriculum data ─────────────────────────────────────────────────────────
const CURRICULUM: Record<string, LevelData[]> = {
  "web-developer": [
    {
      level: 1,
      title: "Fondations Web",
      modules: [
        { id: "html-basics",    title: "HTML — Structure & sémantique",         duration: "45 min", type: "lesson",   free: true  },
        { id: "css-basics",     title: "CSS — Styles & mise en page",           duration: "60 min", type: "lesson",   free: true  },
        { id: "first-landing",  title: "🔨 Projet : Ta première landing page",  duration: "90 min", type: "project",  free: true  },
        { id: "git-basics",     title: "Git & GitHub — Les bases",              duration: "45 min", type: "lesson",   free: true  },
        { id: "github-publish", title: "🔨 Publier sur GitHub Pages",           duration: "30 min", type: "exercise", free: true  },
        { id: "js-basics",      title: "JavaScript — Variables, fonctions, DOM",duration: "90 min", type: "lesson",   free: false },
      ],
    },
    {
      level: 2,
      title: "Premiers Projets Guidés",
      modules: [
        { id: "js-dom",    title: "JavaScript avancé — Événements & fetch", duration: "75 min", type: "lesson",  free: false },
        { id: "todo-app",  title: "🔨 To-do app complète",                  duration: "3h",     type: "project", free: false },
        { id: "react-intro", title: "Introduction à React",                 duration: "60 min", type: "lesson",  free: false },
        { id: "portfolio", title: "🔨 Portfolio personnel avec React",      duration: "4h",     type: "project", free: false },
      ],
    },
    {
      level: 3,
      title: "Préparation Marché",
      modules: [
        { id: "read-offer", title: "Comment lire une offre de mission",  duration: "20 min", type: "lesson",   free: false },
        { id: "apply",      title: "Postuler et parler à un client",     duration: "30 min", type: "lesson",   free: false },
        { id: "quote",      title: "Faire un devis simple",              duration: "25 min", type: "exercise", free: false },
      ],
    },
    {
      level: 4,
      title: "Projet Réel — Marketplace",
      modules: [
        { id: "marketplace-intro", title: "Accès aux projets Junior-Only", duration: "∞", type: "project", free: false },
      ],
    },
  ],

  "ui-designer": [
    {
      level: 1,
      title: "Fondations Design",
      modules: [
        { id: "design-thinking",  title: "Design Thinking — Principes fondamentaux",   duration: "40 min", type: "lesson",  free: true  },
        { id: "color-theory",     title: "Théorie des couleurs & typographie",          duration: "50 min", type: "lesson",  free: true  },
        { id: "figma-intro",      title: "Figma — Prise en main complète",              duration: "60 min", type: "lesson",  free: true  },
        { id: "first-wireframe",  title: "🔨 Premier wireframe d'une app mobile",       duration: "90 min", type: "project", free: true  },
      ],
    },
    {
      level: 2,
      title: "UI & Composants",
      modules: [
        { id: "ui-components",   title: "Créer un système de composants Figma",        duration: "75 min", type: "lesson",   free: false },
        { id: "spacing-grid",    title: "Grilles, espacement & alignement",            duration: "45 min", type: "lesson",   free: false },
        { id: "ui-kit",          title: "🔨 Design Kit complet (boutons, cards…)",     duration: "3h",     type: "project",  free: false },
        { id: "dark-mode",       title: "🔨 Passer ton UI en dark mode",               duration: "2h",     type: "exercise", free: false },
      ],
    },
    {
      level: 3,
      title: "Portfolio Design",
      modules: [
        { id: "case-study",       title: "Rédiger un case study convaincant",          duration: "45 min", type: "lesson",  free: false },
        { id: "portfolio-design", title: "🔨 Portfolio Behance / Figma Community",     duration: "4h",     type: "project", free: false },
        { id: "client-pitch",     title: "Présenter son design à un client",           duration: "30 min", type: "lesson",  free: false },
      ],
    },
  ],

  "data-analyst": [
    {
      level: 1,
      title: "Python & Data Basics",
      modules: [
        { id: "python-intro",   title: "Python — Variables, listes, fonctions",     duration: "60 min", type: "lesson",  free: true  },
        { id: "pandas-intro",   title: "Pandas — Charger et explorer des données",  duration: "75 min", type: "lesson",  free: true  },
        { id: "first-analysis", title: "🔨 Analyser un dataset CSV réel",            duration: "2h",     type: "project", free: true  },
        { id: "data-cleaning",  title: "Nettoyage de données — techniques clés",    duration: "45 min", type: "lesson",  free: true  },
      ],
    },
    {
      level: 2,
      title: "Visualisation",
      modules: [
        { id: "matplotlib",  title: "Matplotlib & Seaborn — Graphiques",        duration: "60 min", type: "lesson",  free: false },
        { id: "plotly",      title: "Plotly — Graphiques interactifs",           duration: "45 min", type: "lesson",  free: false },
        { id: "dashboard",   title: "🔨 Dashboard interactif avec Plotly Dash", duration: "3h",     type: "project", free: false },
      ],
    },
    {
      level: 3,
      title: "SQL & Reporting",
      modules: [
        { id: "sql-basics",    title: "SQL — SELECT, JOIN, GROUP BY",           duration: "60 min", type: "lesson",  free: false },
        { id: "sql-advanced",  title: "SQL avancé — Sous-requêtes & fenêtres", duration: "50 min", type: "lesson",  free: false },
        { id: "report",        title: "🔨 Rapport d'analyse complet",           duration: "4h",     type: "project", free: false },
        { id: "data-marketplace", title: "Accès aux missions Data",             duration: "∞",      type: "project", free: false },
      ],
    },
  ],
};

// ─── Path metadata ───────────────────────────────────────────────────────────
const PATH_META: Record<string, { title: string; icon: string; tagline: string }> = {
  "web-developer": {
    title: "Développeur Web",
    icon: "💻",
    tagline: "De zéro à ton premier projet web live.",
  },
  "ui-designer": {
    title: "Designer UI",
    icon: "🎨",
    tagline: "De Figma débutant à designer portfolio.",
  },
  "data-analyst": {
    title: "Data Analyst Junior",
    icon: "📊",
    tagline: "Python, pandas, SQL — tout pour décrocher ta première mission.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;
  const meta = PATH_META[path];
  return {
    title: meta ? `Parcours ${meta.title}` : "Parcours",
    description: meta?.tagline ?? `Parcours d'apprentissage ${path} sur JuniorCode.`,
  };
}

export default async function LearningPathPage({
  params,
}: {
  readonly params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const curriculum = CURRICULUM[path];
  if (!curriculum) notFound();

  const meta = PATH_META[path] ?? { title: path, icon: "📚", tagline: "" };
  const totalModules  = curriculum.reduce((s, l) => s + l.modules.length, 0);
  const totalProjects = curriculum.reduce((s, l) => s + l.modules.filter((m) => m.type === "project").length, 0);
  const freeModules   = curriculum.reduce((s, l) => s + l.modules.filter((m) => m.free).length, 0);

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">

        {/* Header card */}
        <div className="mb-10 rounded-3xl border border-white/15 bg-white/[0.05] p-6 sm:p-8">
          <Link
            href="/learn"
            className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux parcours
          </Link>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{meta.icon}</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">JuniorCode Learn</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{meta.title}</h1>
            </div>
          </div>
          <p className="text-white/65 mb-6">{meta.tagline}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Niveaux",  value: curriculum.length },
              { label: "Modules",  value: totalModules },
              { label: "Projets",  value: totalProjects },
              { label: "Gratuits", value: freeModules },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="space-y-6">
          {curriculum.map((level) => (
            <div key={level.level} className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03]">
              <div className="border-b border-white/10 px-6 py-4 bg-white/[0.04] flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600/70 text-xs font-bold">
                  {level.level}
                </div>
                <h2 className="font-semibold">Niveau {level.level} — {level.title}</h2>
              </div>

              <div className="divide-y divide-white/10">
                {level.modules.map((module, index) => (
                  <Link
                    key={module.id}
                    href={`/learn/${path}/${module.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.06] group"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white/60">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-white transition-colors">{module.title}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/40">
                        <Clock3 className="h-3 w-3" />
                        {module.duration}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 py-1 text-xs ${getModuleBadgeClass(module.type)}`}>
                      {getModuleTypeLabel(module.type)}
                    </span>
                    {module.free ? (
                      <span className="flex-shrink-0 rounded-full bg-learn-500/20 px-2 py-1 text-xs text-learn-300">
                        Gratuit
                      </span>
                    ) : null}
                    <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/75 transition group-hover:bg-white/10 group-hover:border-white/25">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Ouvrir
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-white/15 bg-gradient-to-r from-learn-500/15 to-brand-500/15 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-brand-300 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Objectif du parcours</h3>
              <p className="mt-1 text-sm text-white/70">
                Termine tous les modules, valide les projets et débloque l'accès aux missions réelles sur la marketplace.
              </p>
              <Link
                href="/marketplace"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                Voir les missions disponibles
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function getModuleTypeLabel(type: Module["type"]) {
  if (type === "project")  return "Projet";
  if (type === "exercise") return "Exercice";
  return "Leçon";
}

function getModuleBadgeClass(type: Module["type"]) {
  if (type === "project")  return "bg-brand-500/25 text-brand-300";
  if (type === "exercise") return "bg-learn-500/25 text-learn-300";
  return "bg-white/10 text-white/60";
}
