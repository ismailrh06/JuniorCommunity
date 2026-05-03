import Link from "next/link";
import { cookies } from "next/headers";
import { BookOpen, ChevronRight, Star, Trophy, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

type LearningPath = {
  slug: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  modulesCount: number;
  duration: Record<Language, string>;
  level: Record<Language, string>;
};

const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "web-developer",
    title: { fr: "Développeur Web", en: "Web Developer", es: "Desarrollador Web" },
    description: {
      fr: "HTML, CSS, JavaScript, React. De zéro à ton premier projet live.",
      en: "HTML, CSS, JavaScript, React. From zero to your first live project.",
      es: "HTML, CSS, JavaScript, React. De cero a tu primer proyecto en vivo.",
    },
    icon: "💻",
    modulesCount: 12,
    duration: { fr: "6-8 semaines", en: "6-8 weeks", es: "6-8 semanas" },
    level: { fr: "Débutant", en: "Beginner", es: "Principiante" },
  },
  {
    slug: "ui-designer",
    title: { fr: "Designer UI", en: "UI Designer", es: "Diseñador UI" },
    description: {
      fr: "Figma, principes design, création de maquettes et design systems.",
      en: "Figma, design principles, wireframes and design systems.",
      es: "Figma, principios de diseño, wireframes y design systems.",
    },
    icon: "🎨",
    modulesCount: 8,
    duration: { fr: "4-5 semaines", en: "4-5 weeks", es: "4-5 semanas" },
    level: { fr: "Débutant", en: "Beginner", es: "Principiante" },
  },
  {
    slug: "data-analyst",
    title: { fr: "Data Analyst Junior", en: "Junior Data Analyst", es: "Data Analyst Junior" },
    description: {
      fr: "Python, pandas, visualisation de données, premiers dashboards.",
      en: "Python, pandas, data visualization, first dashboards.",
      es: "Python, pandas, visualización de datos, primeros dashboards.",
    },
    icon: "📊",
    modulesCount: 10,
    duration: { fr: "5-6 semaines", en: "5-6 weeks", es: "5-6 semanas" },
    level: { fr: "Débutant", en: "Beginner", es: "Principiante" },
  },
  {
    slug: "programming-languages",
    title: { fr: "Langages de programmation", en: "Programming Languages", es: "Lenguajes de programación" },
    description: {
      fr: "Python, Java, C, C++, C#, TypeScript. Choisis le langage adapté à ton objectif.",
      en: "Python, Java, C, C++, C#, TypeScript. Pick the language that fits your goal.",
      es: "Python, Java, C, C++, C#, TypeScript. Elige el lenguaje adecuado para tu objetivo.",
    },
    icon: "⌨️",
    modulesCount: 7,
    duration: { fr: "6-7 semaines", en: "6-7 weeks", es: "6-7 semanas" },
    level: { fr: "Débutant+", en: "Beginner+", es: "Principiante+" },
  },
  {
    slug: "algorithms",
    title: { fr: "Algorithmes fondamentaux", en: "Fundamental Algorithms", es: "Algoritmos fundamentales" },
    description: {
      fr: "Logique, Big O, tableaux, récursion, tri, recherche, graphes et entraînement.",
      en: "Logic, Big O, arrays, recursion, sorting, search, graphs, and practice.",
      es: "Lógica, Big O, arrays, recursión, ordenación, búsqueda, grafos y práctica.",
    },
    icon: "🧠",
    modulesCount: 10,
    duration: { fr: "7-8 semaines", en: "7-8 weeks", es: "7-8 semanas" },
    level: { fr: "Fondamental", en: "Foundational", es: "Fundamental" },
  },
];

const COPY: Record<Language, {
  headerBadge: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  modules: string;
  start: string;
  badgesTitle: string;
  badgesSubtitle: string;
  benefits: Array<{ title: string; desc: string }>;
}> = {
  fr: {
    headerBadge: "JuniorCode Learn",
    title: "Apprends en construisant",
    subtitle: "Choisis ton parcours. Chaque module = un projet concret. Obtiens ton badge Ready Junior et accède à la marketplace.",
    sectionTitle: "Choisir ton parcours",
    modules: "modules",
    start: "Commencer",
    badgesTitle: "Système de badges",
    badgesSubtitle: "Chaque compétence validée = un badge sur ton profil public.",
    benefits: [
      { title: "Guidé pas à pas", desc: "Des modules progressifs avec objectifs clairs et feedback rapide." },
      { title: "100% pratique", desc: "Chaque étape te pousse à livrer un résultat concret, pas juste regarder une vidéo." },
      { title: "Accès marché", desc: "Atteins Verified Junior et débloque la marketplace de missions réelles." },
    ],
  },
  en: {
    headerBadge: "JuniorCode Learn",
    title: "Learn by building",
    subtitle: "Choose your path. Every module = one concrete project. Earn your Ready Junior badge and unlock the marketplace.",
    sectionTitle: "Choose your learning path",
    modules: "modules",
    start: "Start",
    badgesTitle: "Badge system",
    badgesSubtitle: "Every validated skill = one badge on your public profile.",
    benefits: [
      { title: "Step-by-step guidance", desc: "Progressive modules with clear goals and fast feedback." },
      { title: "100% practical", desc: "Every step pushes you to ship real outcomes, not just watch videos." },
      { title: "Marketplace access", desc: "Reach Verified Junior and unlock real mission opportunities." },
    ],
  },
  es: {
    headerBadge: "JuniorCode Learn",
    title: "Aprende construyendo",
    subtitle: "Elige tu ruta. Cada módulo = un proyecto concreto. Consigue tu badge Ready Junior y desbloquea el marketplace.",
    sectionTitle: "Elige tu ruta",
    modules: "módulos",
    start: "Empezar",
    badgesTitle: "Sistema de badges",
    badgesSubtitle: "Cada habilidad validada = un badge en tu perfil público.",
    benefits: [
      { title: "Guía paso a paso", desc: "Módulos progresivos con objetivos claros y feedback rápido." },
      { title: "100% práctico", desc: "Cada etapa te impulsa a entregar algo real, no solo ver videos." },
      { title: "Acceso al mercado", desc: "Alcanza Verified Junior y desbloquea misiones reales." },
    ],
  },
};

const BADGES: Array<{ icon: string; name: string; desc: Record<Language, string> }> = [
  { icon: "🟢", name: "HTML Basics", desc: { fr: "Structure & sémantique", en: "Structure & semantics", es: "Estructura y semántica" } },
  { icon: "🔵", name: "Git Ready", desc: { fr: "Versionning & GitHub", en: "Versioning & GitHub", es: "Versionado y GitHub" } },
  { icon: "🟣", name: "JS Starter", desc: { fr: "JavaScript fondamentaux", en: "JavaScript fundamentals", es: "Fundamentos de JavaScript" } },
  { icon: "🟠", name: "Project Builder", desc: { fr: "Premier projet live", en: "First live project", es: "Primer proyecto en vivo" } },
  { icon: "🟡", name: "Verified Junior", desc: { fr: "Prêt pour la marketplace", en: "Ready for marketplace", es: "Listo para el marketplace" } },
];

export default async function LearnPage() {
  const languageCookie = cookies().get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <Navbar />

      <div className="relative overflow-hidden border-b border-white/10 px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-learn-500/20 blur-[110px]" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-learn-300/35 bg-learn-500/15 px-4 py-1.5 text-sm font-medium text-learn-200 mb-6">
            <BookOpen className="h-4 w-4" />
            {copy.headerBadge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{copy.title}</h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">{copy.subtitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">{copy.sectionTitle}</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {LEARNING_PATHS.map((path) => (
            <Link
              key={path.slug}
              href={`/learn/${path.slug}`}
              className="group rounded-2xl border border-white/15 bg-white/[0.05] p-6 transition-all hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <span className="text-4xl mb-4 block">{path.icon}</span>
              <span className="mb-3 inline-block rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/90">
                {path.level[language]}
              </span>
              <h3 className="text-xl font-bold mb-2">{path.title[language]}</h3>
              <p className="text-white/65 text-sm mb-4">{path.description[language]}</p>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>{path.modulesCount} {copy.modules}</span>
                <span>{path.duration[language]}</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-300 group-hover:gap-2 transition-all">
                {copy.start} <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-y border-white/10 bg-white/[0.03] px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">{copy.badgesTitle}</h2>
          <p className="text-white/65 text-center mb-10">{copy.badgesSubtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {BADGES.map((badge) => (
              <div key={badge.name} className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-center transition-all hover:border-white/30 hover:bg-white/[0.08]">
                <span className="text-3xl mb-2 block">{badge.icon}</span>
                <p className="font-semibold text-sm">{badge.name}</p>
                <p className="text-xs text-white/55 mt-1">{badge.desc[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {copy.benefits.map(({ title, desc }, idx) => {
            const icons = [Star, Zap, Trophy] as const;
            const Icon = icons[idx] ?? Star;

            return (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 transition hover:bg-white/[0.08]">
                <Icon className="mb-3 h-5 w-5 text-brand-300" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/65">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
