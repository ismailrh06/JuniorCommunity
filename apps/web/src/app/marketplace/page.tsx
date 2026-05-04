import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  Briefcase,
  Filter,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Trouve des projets réels pour juniors — startups & associations.",
};

import { getProjects } from "@/lib/data/projects";
import type {
  ProjectCategory,
  ProjectDifficulty,
  ProjectListItem,
} from "@/lib/data/projects";

// Keep category labels for display (multilingual)
const CATEGORY_LABELS_BY_LANGUAGE: Record<
  Language,
  Record<ProjectCategory | "other", string>
> = {
  fr: {
    web: "Développement Web",
    design: "Design",
    data: "Data",
    mobile: "Mobile",
    other: "Autre",
  },
  en: {
    web: "Web Development",
    design: "Design",
    data: "Data",
    mobile: "Mobile",
    other: "Other",
  },
  es: {
    web: "Desarrollo Web",
    design: "Diseño",
    data: "Data",
    mobile: "Mobile",
    other: "Otro",
  },
};

const COPY: Record<
  Language,
  {
    badge: string;
    title: string;
    subtitle: (count: number) => string;
    searchPlaceholder: string;
    apply: string;
    reset: string;
    filters: string;
    activeFilters: (count: number) => string;
    category: string;
    level: string;
    accessType: string;
    all: string;
    juniorOnly: string;
    noProjects: string;
    byClient: string;
    applyButton: string;
    requiredBadgeLabel: string;
    noBadgeNeeded: string;
  }
> = {
  fr: {
    badge: "JuniorCode Marketplace",
    title: "Missions réelles pour juniors",
    subtitle: (count) =>
      `${count} projet(s) trouvé(s) — startups & associations qui cherchent des profils opérationnels.`,
    searchPlaceholder: "Rechercher un projet, client, techno...",
    apply: "Appliquer",
    reset: "Reset",
    filters: "Filtres",
    activeFilters: (count) => `Filtres actifs : ${count}`,
    category: "Catégorie",
    level: "Niveau",
    accessType: "Type d'accès",
    all: "Tous",
    juniorOnly: "Junior only",
    noProjects:
      "Aucun projet ne correspond à tes filtres. Essaie une recherche plus large.",
    byClient: "par",
    applyButton: "Postuler",
    requiredBadgeLabel: "Badge requis",
    noBadgeNeeded: "Ouvert à tous",
  },
  en: {
    badge: "JuniorCode Marketplace",
    title: "Real missions for juniors",
    subtitle: (count) =>
      `${count} project(s) found — startups & nonprofits looking for operational profiles.`,
    searchPlaceholder: "Search by project, client, stack...",
    apply: "Apply",
    reset: "Reset",
    filters: "Filters",
    activeFilters: (count) => `Active filters: ${count}`,
    category: "Category",
    level: "Level",
    accessType: "Access type",
    all: "All",
    juniorOnly: "Junior only",
    noProjects: "No projects match your filters. Try a broader query.",
    byClient: "by",
    applyButton: "Apply",
    requiredBadgeLabel: "Required badge",
    noBadgeNeeded: "Open to all",
  },
  es: {
    badge: "JuniorCode Marketplace",
    title: "Misiones reales para juniors",
    subtitle: (count) =>
      `${count} proyecto(s) encontrado(s) — startups y asociaciones buscando perfiles operativos.`,
    searchPlaceholder: "Buscar por proyecto, cliente, tecnología...",
    apply: "Aplicar",
    reset: "Reiniciar",
    filters: "Filtros",
    activeFilters: (count) => `Filtros activos: ${count}`,
    category: "Categoría",
    level: "Nivel",
    accessType: "Tipo de acceso",
    all: "Todos",
    juniorOnly: "Solo junior",
    noProjects:
      "Ningún proyecto coincide con tus filtros. Prueba una búsqueda más amplia.",
    byClient: "por",
    applyButton: "Postular",
    requiredBadgeLabel: "Badge requerido",
    noBadgeNeeded: "Abierto a todos",
  },
};

type MarketplacePageProps = {
  searchParams?: {
    category?: ProjectCategory | "all";
    difficulty?: ProjectDifficulty | "all";
    junior?: "all" | "true";
    q?: string;
  };
};

export default async function MarketplacePage({
  searchParams,
}: Readonly<MarketplacePageProps>) {
  const languageCookie = cookies()
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = COPY[language];
  const categoryLabels = CATEGORY_LABELS_BY_LANGUAGE[language];

  const category = searchParams?.category ?? "all";
  const difficulty = searchParams?.difficulty ?? "all";
  const junior = searchParams?.junior ?? "all";
  const q = (searchParams?.q ?? "").trim().toLowerCase();

  const filteredProjects: ProjectListItem[] = await getProjects({
    category,
    difficulty,
    juniorOnly: junior === "true",
    q: q.length > 0 ? q : undefined,
    language,
  });

  const activeFiltersCount = [
    category !== "all",
    difficulty !== "all",
    junior !== "all",
    q.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 px-4 py-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-market-500/20 blur-[110px]" />
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-market-300/30 bg-market-500/10 px-3 py-1 text-xs text-market-200">
            <Briefcase className="h-3.5 w-3.5" />
            {copy.badge}
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{copy.title}</h1>
          <p className="mt-2 text-white/70">
            {copy.subtitle(filteredProjects.length)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/profile/alex-martin"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65 transition hover:bg-white/10"
            >
              👤 Voir un exemple de profil junior certifié →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form
          method="get"
          className="mb-6 rounded-2xl border border-white/15 bg-white/[0.04] p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                name="q"
                defaultValue={searchParams?.q ?? ""}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-xl border border-white/15 bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-brand-400"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-brand-500"
            >
              <Filter className="h-4 w-4" />
              {copy.apply}
            </button>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {copy.reset}
            </Link>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-6 rounded-2xl border border-white/15 bg-white/[0.04] p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Star className="h-4 w-4 text-brand-300" />
                {copy.filters}
              </h3>
              <p className="mb-4 text-xs text-white/50">
                {copy.activeFilters(activeFiltersCount)}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 block text-sm font-medium text-white/85">
                    {copy.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "web", "design", "data", "mobile"] as const).map(
                      (cat) => {
                        const href = buildFilterUrl({
                          category: cat,
                          difficulty,
                          junior,
                          q: searchParams?.q,
                        });
                        const isActive = category === cat;
                        return (
                          <Link
                            key={cat}
                            href={href}
                            className={`rounded-lg px-2.5 py-1.5 text-xs transition ${
                              isActive
                                ? "bg-brand-600 text-white"
                                : "border border-white/15 text-white/70 hover:bg-white/10"
                            }`}
                          >
                            {cat === "all" ? copy.all : categoryLabels[cat]}
                          </Link>
                        );
                      },
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="mb-2 block text-sm font-medium text-white/85">
                    {copy.level}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "junior", "intermediate"] as const).map(
                      (level) => {
                        const href = buildFilterUrl({
                          category,
                          difficulty: level,
                          junior,
                          q: searchParams?.q,
                        });
                        const isActive = difficulty === level;
                        return (
                          <Link
                            key={level}
                            href={href}
                            className={`rounded-lg px-2.5 py-1.5 text-xs transition ${
                              isActive
                                ? "bg-learn-600 text-white"
                                : "border border-white/15 text-white/70 hover:bg-white/10"
                            }`}
                          >
                            {getDifficultyLabel(level, language)}
                          </Link>
                        );
                      },
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="mb-2 block text-sm font-medium text-white/85">
                    {copy.accessType}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "true"] as const).map((value) => {
                      const href = buildFilterUrl({
                        category,
                        difficulty,
                        junior: value,
                        q: searchParams?.q,
                      });
                      const isActive = junior === value;
                      return (
                        <Link
                          key={value}
                          href={href}
                          className={`rounded-lg px-2.5 py-1.5 text-xs transition ${
                            isActive
                              ? "bg-market-600 text-white"
                              : "border border-white/15 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {value === "all" ? copy.all : copy.juniorOnly}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Projects grid */}
          <main className="flex-1">
            {filteredProjects.length === 0 && (
              <div className="mb-4 rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center text-white/70">
                {copy.noProjects}
              </div>
            )}

            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block cursor-pointer rounded-2xl border border-white/15 bg-white/[0.04] p-6 transition-all hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-white/[0.08]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {project.juniorOnly && (
                          <span className="rounded-full bg-learn-500/25 px-2 py-0.5 text-xs font-medium text-learn-200">
                            🟢 Junior Only
                          </span>
                        )}
                        <span className="text-xs text-white/45">
                          {categoryLabels[project.category] ?? project.category}
                        </span>
                      </div>
                      <h3 className="mb-1 text-lg font-semibold">
                        {project.title}
                      </h3>
                      <p className="mb-3 text-sm text-white/60">
                        {copy.byClient} {project.client}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/65"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-end sm:flex-shrink-0">
                      <div className="flex flex-col gap-1 sm:items-end">
                        <span className="font-bold">{project.budget}</span>
                        <span className="text-sm text-white/50">
                          {project.durationLabel}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {project.requiredBadge ? (
                          <span className="flex items-center gap-1 rounded-full border border-brand-400/40 bg-brand-500/15 px-2.5 py-1 text-xs font-medium text-brand-200">
                            <span>🏅</span>
                            <span className="hidden sm:inline">
                              {copy.requiredBadgeLabel} :{" "}
                            </span>
                            {project.requiredBadge}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs text-white/45">
                            {copy.noBadgeNeeded}
                          </span>
                        )}
                        <span className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">
                          {copy.applyButton}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function buildFilterUrl(params: {
  category: ProjectCategory | "all";
  difficulty: ProjectDifficulty | "all";
  junior: "all" | "true";
  q?: string;
}) {
  const query = new URLSearchParams();

  if (params.category !== "all") query.set("category", params.category);
  if (params.difficulty !== "all") query.set("difficulty", params.difficulty);
  if (params.junior !== "all") query.set("junior", params.junior);
  if (params.q?.trim()) query.set("q", params.q.trim());

  const serialized = query.toString();
  return serialized ? `/marketplace?${serialized}` : "/marketplace";
}

function getDifficultyLabel(
  level: "all" | "junior" | "intermediate",
  language: Language,
) {
  if (language === "en") {
    if (level === "all") return "All";
    if (level === "junior") return "Junior";
    return "Intermediate";
  }

  if (language === "es") {
    if (level === "all") return "Todos";
    if (level === "junior") return "Junior";
    return "Intermedio";
  }

  if (level === "all") return "Tous";
  if (level === "junior") return "Junior";
  return "Intermédiaire";
}
