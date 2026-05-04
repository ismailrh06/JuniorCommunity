import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Clock3, PlayCircle, Rocket, Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";
import {
  MissionCard,
  LearningProgressSync,
  ProgressRadar,
  QuestTimeline,
  StreakCounter,
  XPBar,
  type MissionCardData,
} from "@/components/learn/gamified-learning";

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
        {
          id: "html-basics",
          title: "HTML — Structure & sémantique",
          duration: "45 min",
          type: "lesson",
          free: true,
        },
        {
          id: "css-basics",
          title: "CSS — Styles & mise en page",
          duration: "60 min",
          type: "lesson",
          free: true,
        },
        {
          id: "first-landing",
          title: "🔨 Projet : Ta première landing page",
          duration: "90 min",
          type: "project",
          free: true,
        },
        {
          id: "git-basics",
          title: "Git & GitHub — Les bases",
          duration: "45 min",
          type: "lesson",
          free: true,
        },
        {
          id: "github-publish",
          title: "🔨 Publier sur GitHub Pages",
          duration: "30 min",
          type: "exercise",
          free: true,
        },
        {
          id: "js-basics",
          title: "JavaScript — Variables, fonctions, DOM",
          duration: "90 min",
          type: "lesson",
          free: false,
        },
      ],
    },
    {
      level: 2,
      title: "Premiers Projets Guidés",
      modules: [
        {
          id: "js-dom",
          title: "JavaScript avancé — Événements & fetch",
          duration: "75 min",
          type: "lesson",
          free: false,
        },
        {
          id: "todo-app",
          title: "🔨 To-do app complète",
          duration: "3h",
          type: "project",
          free: false,
        },
        {
          id: "react-intro",
          title: "Introduction à React",
          duration: "60 min",
          type: "lesson",
          free: false,
        },
        {
          id: "portfolio",
          title: "🔨 Portfolio personnel avec React",
          duration: "4h",
          type: "project",
          free: false,
        },
      ],
    },
    {
      level: 3,
      title: "Préparation Marché",
      modules: [
        {
          id: "read-offer",
          title: "Comment lire une offre de mission",
          duration: "20 min",
          type: "lesson",
          free: false,
        },
        {
          id: "apply",
          title: "Postuler et parler à un client",
          duration: "30 min",
          type: "lesson",
          free: false,
        },
        {
          id: "quote",
          title: "Faire un devis simple",
          duration: "25 min",
          type: "exercise",
          free: false,
        },
      ],
    },
    {
      level: 4,
      title: "Projet Réel — Marketplace",
      modules: [
        {
          id: "marketplace-intro",
          title: "Accès aux projets Junior-Only",
          duration: "∞",
          type: "project",
          free: false,
        },
      ],
    },
  ],

  "ui-designer": [
    {
      level: 1,
      title: "Fondations Design",
      modules: [
        {
          id: "design-thinking",
          title: "Design Thinking — Principes fondamentaux",
          duration: "40 min",
          type: "lesson",
          free: true,
        },
        {
          id: "color-theory",
          title: "Théorie des couleurs & typographie",
          duration: "50 min",
          type: "lesson",
          free: true,
        },
        {
          id: "figma-intro",
          title: "Figma — Prise en main complète",
          duration: "60 min",
          type: "lesson",
          free: true,
        },
        {
          id: "first-wireframe",
          title: "🔨 Premier wireframe d'une app mobile",
          duration: "90 min",
          type: "project",
          free: true,
        },
      ],
    },
    {
      level: 2,
      title: "UI & Composants",
      modules: [
        {
          id: "ui-components",
          title: "Créer un système de composants Figma",
          duration: "75 min",
          type: "lesson",
          free: false,
        },
        {
          id: "spacing-grid",
          title: "Grilles, espacement & alignement",
          duration: "45 min",
          type: "lesson",
          free: false,
        },
        {
          id: "ui-kit",
          title: "🔨 Design Kit complet (boutons, cards…)",
          duration: "3h",
          type: "project",
          free: false,
        },
        {
          id: "dark-mode",
          title: "🔨 Passer ton UI en dark mode",
          duration: "2h",
          type: "exercise",
          free: false,
        },
      ],
    },
    {
      level: 3,
      title: "Portfolio Design",
      modules: [
        {
          id: "case-study",
          title: "Rédiger un case study convaincant",
          duration: "45 min",
          type: "lesson",
          free: false,
        },
        {
          id: "portfolio-design",
          title: "🔨 Portfolio Behance / Figma Community",
          duration: "4h",
          type: "project",
          free: false,
        },
        {
          id: "client-pitch",
          title: "Présenter son design à un client",
          duration: "30 min",
          type: "lesson",
          free: false,
        },
      ],
    },
  ],

  "data-analyst": [
    {
      level: 1,
      title: "Python & Data Basics",
      modules: [
        {
          id: "python-intro",
          title: "Python — Variables, listes, fonctions",
          duration: "60 min",
          type: "lesson",
          free: true,
        },
        {
          id: "pandas-intro",
          title: "Pandas — Charger et explorer des données",
          duration: "75 min",
          type: "lesson",
          free: true,
        },
        {
          id: "first-analysis",
          title: "🔨 Analyser un dataset CSV réel",
          duration: "2h",
          type: "project",
          free: true,
        },
        {
          id: "data-cleaning",
          title: "Nettoyage de données — techniques clés",
          duration: "45 min",
          type: "lesson",
          free: true,
        },
      ],
    },
    {
      level: 2,
      title: "Visualisation",
      modules: [
        {
          id: "matplotlib",
          title: "Matplotlib & Seaborn — Graphiques",
          duration: "60 min",
          type: "lesson",
          free: false,
        },
        {
          id: "plotly",
          title: "Plotly — Graphiques interactifs",
          duration: "45 min",
          type: "lesson",
          free: false,
        },
        {
          id: "dashboard",
          title: "🔨 Dashboard interactif avec Plotly Dash",
          duration: "3h",
          type: "project",
          free: false,
        },
      ],
    },
    {
      level: 3,
      title: "SQL & Reporting",
      modules: [
        {
          id: "sql-basics",
          title: "SQL — SELECT, JOIN, GROUP BY",
          duration: "60 min",
          type: "lesson",
          free: false,
        },
        {
          id: "sql-advanced",
          title: "SQL avancé — Sous-requêtes & fenêtres",
          duration: "50 min",
          type: "lesson",
          free: false,
        },
        {
          id: "report",
          title: "🔨 Rapport d'analyse complet",
          duration: "4h",
          type: "project",
          free: false,
        },
        {
          id: "data-marketplace",
          title: "Accès aux missions Data",
          duration: "∞",
          type: "project",
          free: false,
        },
      ],
    },
  ],

  "programming-languages": [
    {
      level: 1,
      title: "Choisir et comprendre les langages",
      modules: [
        {
          id: "language-choice",
          title: "Choisir le bon langage pour ton objectif",
          duration: "35 min",
          type: "lesson",
          free: true,
        },
        {
          id: "python-programming",
          title: "Python — Automatisation, scripts & logique",
          duration: "75 min",
          type: "lesson",
          free: true,
        },
        {
          id: "typescript-programming",
          title: "TypeScript — JavaScript robuste",
          duration: "75 min",
          type: "lesson",
          free: true,
        },
      ],
    },
    {
      level: 2,
      title: "Langages orientés métier",
      modules: [
        {
          id: "java-programming",
          title: "Java — POO, backend & applications",
          duration: "80 min",
          type: "lesson",
          free: false,
        },
        {
          id: "csharp-programming",
          title: "C# — Apps, APIs & écosystème .NET",
          duration: "75 min",
          type: "lesson",
          free: false,
        },
      ],
    },
    {
      level: 3,
      title: "Langages proches de la machine",
      modules: [
        {
          id: "c-programming",
          title: "C — Mémoire, pointeurs & bases système",
          duration: "90 min",
          type: "lesson",
          free: false,
        },
        {
          id: "cpp-programming",
          title: "C++ — Performance, objets & STL",
          duration: "90 min",
          type: "lesson",
          free: false,
        },
      ],
    },
  ],

  algorithms: [
    {
      level: 1,
      title: "Bases de raisonnement",
      modules: [
        {
          id: "algorithmic-thinking",
          title: "Pensée algorithmique — Résoudre avant de coder",
          duration: "45 min",
          type: "lesson",
          free: true,
        },
        {
          id: "complexity-big-o",
          title: "Complexité Big O — Temps & mémoire",
          duration: "60 min",
          type: "lesson",
          free: true,
        },
        {
          id: "arrays-strings",
          title: "Tableaux & chaînes — Parcourir, chercher, transformer",
          duration: "70 min",
          type: "lesson",
          free: true,
        },
      ],
    },
    {
      level: 2,
      title: "Structures et patterns classiques",
      modules: [
        {
          id: "hashmaps-sets",
          title: "Hash maps & sets — Retrouver vite",
          duration: "60 min",
          type: "lesson",
          free: false,
        },
        {
          id: "stacks-queues",
          title: "Stacks & queues — Ordre, historique, files",
          duration: "55 min",
          type: "lesson",
          free: false,
        },
        {
          id: "recursion",
          title: "Récursion — Décomposer un problème",
          duration: "65 min",
          type: "lesson",
          free: false,
        },
        {
          id: "sorting-searching",
          title: "Tri & recherche — Les classiques utiles",
          duration: "75 min",
          type: "lesson",
          free: false,
        },
      ],
    },
    {
      level: 3,
      title: "Problèmes avancés guidés",
      modules: [
        {
          id: "trees-graphs",
          title: "Arbres & graphes — Explorer des relations",
          duration: "80 min",
          type: "lesson",
          free: false,
        },
        {
          id: "dynamic-programming-intro",
          title: "Programmation dynamique — Mémoïsation simple",
          duration: "80 min",
          type: "lesson",
          free: false,
        },
        {
          id: "algorithm-challenges",
          title: "🔨 Sprint d'exercices algorithmiques",
          duration: "3h",
          type: "project",
          free: false,
        },
      ],
    },
  ],
};

// ─── Path metadata ───────────────────────────────────────────────────────────
const PATH_META: Record<
  string,
  { title: string; icon: string; tagline: string }
> = {
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
  "programming-languages": {
    title: "Langages de programmation",
    icon: "⌨️",
    tagline:
      "Python, Java, C, C++, C# et TypeScript pour choisir l'outil adapté.",
  },
  algorithms: {
    title: "Algorithmes fondamentaux",
    icon: "🧠",
    tagline: "La logique et les structures qui rendent ton code plus solide.",
  },
};

const PATH_COPY: Record<
  Language,
  {
    fallbackTitle: string;
    fallbackDescription: (path: string) => string;
    backToPaths: string;
    levels: string;
    modules: string;
    projects: string;
    freePlural: string;
    level: string;
    free: string;
    open: string;
    pathGoal: string;
    pathGoalDescription: string;
    viewMissions: string;
    lesson: string;
    exercise: string;
    project: string;
  }
> = {
  fr: {
    fallbackTitle: "Parcours",
    fallbackDescription: (path) =>
      `Parcours d'apprentissage ${path} sur JuniorCode.`,
    backToPaths: "Retour aux parcours",
    levels: "Niveaux",
    modules: "Modules",
    projects: "Projets",
    freePlural: "Gratuits",
    level: "Niveau",
    free: "Gratuit",
    open: "Ouvrir",
    pathGoal: "Objectif du parcours",
    pathGoalDescription:
      "Termine tous les modules, valide les projets et débloque l'accès aux missions réelles sur la marketplace.",
    viewMissions: "Voir les missions disponibles",
    lesson: "Leçon",
    exercise: "Exercice",
    project: "Projet",
  },
  en: {
    fallbackTitle: "Path",
    fallbackDescription: (path) => `JuniorCode learning path: ${path}.`,
    backToPaths: "Back to paths",
    levels: "Levels",
    modules: "Modules",
    projects: "Projects",
    freePlural: "Free",
    level: "Level",
    free: "Free",
    open: "Open",
    pathGoal: "Path goal",
    pathGoalDescription:
      "Complete every module, validate the projects, and unlock access to real marketplace missions.",
    viewMissions: "View available missions",
    lesson: "Lesson",
    exercise: "Exercise",
    project: "Project",
  },
  es: {
    fallbackTitle: "Ruta",
    fallbackDescription: (path) => `Ruta de aprendizaje ${path} en JuniorCode.`,
    backToPaths: "Volver a las rutas",
    levels: "Niveles",
    modules: "Módulos",
    projects: "Proyectos",
    freePlural: "Gratis",
    level: "Nivel",
    free: "Gratis",
    open: "Abrir",
    pathGoal: "Objetivo de la ruta",
    pathGoalDescription:
      "Termina todos los módulos, valida los proyectos y desbloquea el acceso a misiones reales en el marketplace.",
    viewMissions: "Ver misiones disponibles",
    lesson: "Lección",
    exercise: "Ejercicio",
    project: "Proyecto",
  },
};

const PATH_META_TRANSLATIONS: Record<
  string,
  Record<Language, { title: string; tagline: string }>
> = {
  "web-developer": {
    fr: {
      title: "Développeur Web",
      tagline: "De zéro à ton premier projet web live.",
    },
    en: {
      title: "Web Developer",
      tagline: "From zero to your first live web project.",
    },
    es: {
      title: "Desarrollador Web",
      tagline: "De cero a tu primer proyecto web publicado.",
    },
  },
  "ui-designer": {
    fr: {
      title: "Designer UI",
      tagline: "De Figma débutant à designer portfolio.",
    },
    en: {
      title: "UI Designer",
      tagline: "From Figma beginner to portfolio-ready designer.",
    },
    es: {
      title: "Diseñador UI",
      tagline: "De principiante en Figma a diseñador con portfolio.",
    },
  },
  "data-analyst": {
    fr: {
      title: "Data Analyst Junior",
      tagline: "Python, pandas, SQL — tout pour décrocher ta première mission.",
    },
    en: {
      title: "Junior Data Analyst",
      tagline: "Python, pandas, SQL: everything to land your first mission.",
    },
    es: {
      title: "Data Analyst Junior",
      tagline: "Python, pandas y SQL para conseguir tu primera misión.",
    },
  },
  "programming-languages": {
    fr: {
      title: "Langages de programmation",
      tagline:
        "Python, Java, C, C++, C# et TypeScript pour choisir l'outil adapté.",
    },
    en: {
      title: "Programming Languages",
      tagline:
        "Python, Java, C, C++, C#, and TypeScript so you can pick the right tool.",
    },
    es: {
      title: "Lenguajes de programación",
      tagline:
        "Python, Java, C, C++, C# y TypeScript para elegir la herramienta adecuada.",
    },
  },
  algorithms: {
    fr: {
      title: "Algorithmes fondamentaux",
      tagline: "La logique et les structures qui rendent ton code plus solide.",
    },
    en: {
      title: "Fundamental Algorithms",
      tagline: "The logic and structures that make your code stronger.",
    },
    es: {
      title: "Algoritmos fundamentales",
      tagline: "La lógica y las estructuras que hacen tu código más sólido.",
    },
  },
};

const LEVEL_TITLE_TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {},
  en: {
    "web-developer:1": "Web Foundations",
    "web-developer:2": "First Guided Projects",
    "web-developer:3": "Market Preparation",
    "web-developer:4": "Real Project — Marketplace",
    "ui-designer:1": "Design Foundations",
    "ui-designer:2": "UI & Components",
    "ui-designer:3": "Design Portfolio",
    "data-analyst:1": "Python & Data Basics",
    "data-analyst:2": "Visualization",
    "data-analyst:3": "SQL & Reporting",
    "programming-languages:1": "Choose and understand languages",
    "programming-languages:2": "Business-oriented languages",
    "programming-languages:3": "Close-to-the-machine languages",
    "algorithms:1": "Reasoning basics",
    "algorithms:2": "Classic structures and patterns",
    "algorithms:3": "Guided advanced problems",
  },
  es: {
    "web-developer:1": "Fundamentos Web",
    "web-developer:2": "Primeros proyectos guiados",
    "web-developer:3": "Preparación para el mercado",
    "web-developer:4": "Proyecto real — Marketplace",
    "ui-designer:1": "Fundamentos de diseño",
    "ui-designer:2": "UI y componentes",
    "ui-designer:3": "Portfolio de diseño",
    "data-analyst:1": "Python y bases de datos",
    "data-analyst:2": "Visualización",
    "data-analyst:3": "SQL y reporting",
    "programming-languages:1": "Elegir y entender lenguajes",
    "programming-languages:2": "Lenguajes orientados al negocio",
    "programming-languages:3": "Lenguajes cercanos a la máquina",
    "algorithms:1": "Bases de razonamiento",
    "algorithms:2": "Estructuras y patrones clásicos",
    "algorithms:3": "Problemas avanzados guiados",
  },
};

const MODULE_TITLE_TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {},
  en: {
    "html-basics": "HTML — Structure & semantics",
    "css-basics": "CSS — Styles & layout",
    "first-landing": "🔨 Project: Your first landing page",
    "git-basics": "Git & GitHub — The basics",
    "github-publish": "🔨 Publish on GitHub Pages",
    "js-basics": "JavaScript — Variables, functions, DOM",
    "js-dom": "Advanced JavaScript — Events & fetch",
    "todo-app": "🔨 Complete to-do app",
    "react-intro": "Introduction to React",
    portfolio: "🔨 Personal portfolio with React",
    "read-offer": "How to read a mission brief",
    apply: "Apply and talk to a client",
    quote: "Create a simple quote",
    "marketplace-intro": "Access Junior-Only projects",
    "design-thinking": "Design Thinking — Core principles",
    "color-theory": "Color theory & typography",
    "figma-intro": "Figma — Complete beginner guide",
    "first-wireframe": "🔨 First wireframe for a mobile app",
    "ui-components": "Create a Figma component system",
    "spacing-grid": "Grids, spacing & alignment",
    "ui-kit": "🔨 Complete design kit (buttons, cards...)",
    "dark-mode": "🔨 Turn your UI into dark mode",
    "case-study": "Write a convincing case study",
    "portfolio-design": "🔨 Behance / Figma Community portfolio",
    "client-pitch": "Present your design to a client",
    "python-intro": "Python — Variables, lists, functions",
    "pandas-intro": "Pandas — Load and explore data",
    "first-analysis": "🔨 Analyze a real CSV dataset",
    "data-cleaning": "Data cleaning — Key techniques",
    matplotlib: "Matplotlib & Seaborn — Charts",
    plotly: "Plotly — Interactive charts",
    dashboard: "🔨 Interactive dashboard with Plotly Dash",
    "sql-basics": "SQL — SELECT, JOIN, GROUP BY",
    "sql-advanced": "Advanced SQL — Subqueries & windows",
    report: "🔨 Complete analysis report",
    "data-marketplace": "Access data missions",
    "language-choice": "Choose the right language for your goal",
    "python-programming": "Python — Automation, scripts & logic",
    "typescript-programming": "TypeScript — Robust JavaScript",
    "java-programming": "Java — OOP, backend & applications",
    "csharp-programming": "C# — Apps, APIs & the .NET ecosystem",
    "c-programming": "C — Memory, pointers & system basics",
    "cpp-programming": "C++ — Performance, objects & STL",
    "algorithmic-thinking": "Algorithmic thinking — Solve before coding",
    "complexity-big-o": "Big O complexity — Time & memory",
    "arrays-strings": "Arrays & strings — Traverse, search, transform",
    "hashmaps-sets": "Hash maps & sets — Find things fast",
    "stacks-queues": "Stacks & queues — Order, history, lines",
    recursion: "Recursion — Break a problem down",
    "sorting-searching": "Sorting & searching — Useful classics",
    "trees-graphs": "Trees & graphs — Explore relationships",
    "dynamic-programming-intro": "Dynamic programming — Simple memoization",
    "algorithm-challenges": "🔨 Algorithm practice sprint",
  },
  es: {
    "html-basics": "HTML — Estructura y semántica",
    "css-basics": "CSS — Estilos y maquetación",
    "first-landing": "🔨 Proyecto: tu primera landing page",
    "git-basics": "Git y GitHub — Las bases",
    "github-publish": "🔨 Publicar en GitHub Pages",
    "js-basics": "JavaScript — Variables, funciones, DOM",
    "js-dom": "JavaScript avanzado — Eventos y fetch",
    "todo-app": "🔨 To-do app completa",
    "react-intro": "Introducción a React",
    portfolio: "🔨 Portfolio personal con React",
    "read-offer": "Cómo leer una oferta de misión",
    apply: "Postular y hablar con un cliente",
    quote: "Crear un presupuesto simple",
    "marketplace-intro": "Acceso a proyectos Junior-Only",
    "design-thinking": "Design Thinking — Principios fundamentales",
    "color-theory": "Teoría del color y tipografía",
    "figma-intro": "Figma — Guía completa para empezar",
    "first-wireframe": "🔨 Primer wireframe de una app móvil",
    "ui-components": "Crear un sistema de componentes Figma",
    "spacing-grid": "Grillas, espaciado y alineación",
    "ui-kit": "🔨 Design kit completo (botones, cards...)",
    "dark-mode": "🔨 Convertir tu UI a dark mode",
    "case-study": "Redactar un case study convincente",
    "portfolio-design": "🔨 Portfolio Behance / Figma Community",
    "client-pitch": "Presentar tu diseño a un cliente",
    "python-intro": "Python — Variables, listas, funciones",
    "pandas-intro": "Pandas — Cargar y explorar datos",
    "first-analysis": "🔨 Analizar un dataset CSV real",
    "data-cleaning": "Limpieza de datos — Técnicas clave",
    matplotlib: "Matplotlib y Seaborn — Gráficos",
    plotly: "Plotly — Gráficos interactivos",
    dashboard: "🔨 Dashboard interactivo con Plotly Dash",
    "sql-basics": "SQL — SELECT, JOIN, GROUP BY",
    "sql-advanced": "SQL avanzado — Subconsultas y ventanas",
    report: "🔨 Reporte de análisis completo",
    "data-marketplace": "Acceso a misiones data",
    "language-choice": "Elegir el lenguaje correcto para tu objetivo",
    "python-programming": "Python — Automatización, scripts y lógica",
    "typescript-programming": "TypeScript — JavaScript robusto",
    "java-programming": "Java — POO, backend y aplicaciones",
    "csharp-programming": "C# — Apps, APIs y ecosistema .NET",
    "c-programming": "C — Memoria, punteros y bases de sistema",
    "cpp-programming": "C++ — Rendimiento, objetos y STL",
    "algorithmic-thinking":
      "Pensamiento algorítmico — Resolver antes de codificar",
    "complexity-big-o": "Complejidad Big O — Tiempo y memoria",
    "arrays-strings": "Arrays y strings — Recorrer, buscar, transformar",
    "hashmaps-sets": "Hash maps y sets — Encontrar rápido",
    "stacks-queues": "Stacks y queues — Orden, historial, colas",
    recursion: "Recursión — Descomponer un problema",
    "sorting-searching": "Ordenación y búsqueda — Clásicos útiles",
    "trees-graphs": "Árboles y grafos — Explorar relaciones",
    "dynamic-programming-intro": "Programación dinámica — Memoización simple",
    "algorithm-challenges": "🔨 Sprint de ejercicios algorítmicos",
  },
};

function getRequestLanguage(): Language {
  const languageCookie = cookies()
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
}

function getPathMeta(path: string, language: Language) {
  const base = PATH_META[path] ?? { title: path, icon: "📚", tagline: "" };
  const translated = PATH_META_TRANSLATIONS[path]?.[language];
  return {
    icon: base.icon,
    title: translated?.title ?? base.title,
    tagline: translated?.tagline ?? base.tagline,
  };
}

function getLevelTitle(path: string, level: LevelData, language: Language) {
  return (
    LEVEL_TITLE_TRANSLATIONS[language][`${path}:${level.level}`] ?? level.title
  );
}

function getModuleTitle(module: Module, language: Language) {
  return MODULE_TITLE_TRANSLATIONS[language][module.id] ?? module.title;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const language = getRequestLanguage();
  const copy = PATH_COPY[language];
  const { path } = await params;
  const meta = getPathMeta(path, language);
  return {
    title: meta ? `${copy.fallbackTitle} ${meta.title}` : copy.fallbackTitle,
    description: meta?.tagline ?? copy.fallbackDescription(path),
  };
}

export default async function LearningPathPage({
  params,
}: {
  readonly params: Promise<{ path: string }>;
}) {
  const language = getRequestLanguage();
  const copy = PATH_COPY[language];
  const { path } = await params;
  const curriculum = CURRICULUM[path];
  if (!curriculum) notFound();

  const meta = getPathMeta(path, language);
  const totalModules = curriculum.reduce((s, l) => s + l.modules.length, 0);
  const totalProjects = curriculum.reduce(
    (s, l) => s + l.modules.filter((m) => m.type === "project").length,
    0,
  );
  const freeModules = curriculum.reduce(
    (s, l) => s + l.modules.filter((m) => m.free).length,
    0,
  );
  const flatModules = curriculum.flatMap((level) =>
    level.modules.map((module) => ({ ...module, level: level.level })),
  );
  const missions: MissionCardData[] = flatModules.slice(0, 6).map((module, index) => ({
    href: `/learn/${path}/${module.id}`,
    title: `${module.type === "project" ? "Build session" : module.type === "exercise" ? "Challenge" : "Mission"} ${index + 1} - ${getModuleTitle(module, language).replace("🔨 ", "")}`,
    intro:
      module.type === "project"
        ? "Ship a portfolio-ready artifact with visible proof."
        : "Complete one focused action, run feedback, and unlock the next step.",
    duration: module.duration,
    xp: module.type === "project" ? 90 : module.type === "exercise" ? 45 : 30,
    status: index < 2 ? "active" : module.free ? "locked" : "locked",
    tags: [
      getModuleTypeLabel(module.type, language),
      `${copy.level} ${module.level}`,
      module.free ? copy.free : "Unlock",
    ],
    challenge:
      module.type === "project"
        ? "Build, validate, deploy, and add it to your profile."
        : "Read less than 60 seconds, change something, then check it.",
    reward: index === 0 ? "Continue" : "Start",
    tone: module.type === "project" ? "violet" : module.type === "exercise" ? "blue" : "green",
  }));

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <LearningProgressSync />
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/12 bg-white/[0.055] p-5 sm:p-8">
          <Link
            href="/learn"
            className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {copy.backToPaths}
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{meta.icon}</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                    Mission path
                  </p>
                  <h1 className="text-3xl font-black sm:text-5xl">
                    {meta.title}
                  </h1>
                </div>
              </div>
              <p className="max-w-2xl text-white/65">{meta.tagline}</p>
            </div>
            <XPBar current={420} max={900} level={4} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: copy.levels, value: curriculum.length },
              { label: copy.modules, value: totalModules },
              { label: copy.projects, value: totalProjects },
              { label: copy.freePlural, value: freeModules },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center"
              >
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/45">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <main>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">{copy.viewMissions}</h2>
              <StreakCounter days={3} compact />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {missions.map((mission) => (
                <MissionCard key={mission.title} mission={mission} />
              ))}
            </div>

            <div className="mt-8 space-y-5">
              {curriculum.map((level) => (
                <div
                  key={level.level}
                  className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]"
                >
                  <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/70 text-xs font-bold">
                        {level.level}
                      </div>
                      <h2 className="font-semibold">
                        {copy.level} {level.level} -{" "}
                        {getLevelTitle(path, level, language)}
                      </h2>
                    </div>
                  </div>

                  <div className="divide-y divide-white/10">
                    {level.modules.map((module, index) => (
                      <Link
                        key={module.id}
                        href={`/learn/${path}/${module.id}`}
                        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white/60">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium transition-colors group-hover:text-white">
                            {getModuleTitle(module, language).replace("🔨 ", "")}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/40">
                            <Clock3 className="h-3 w-3" />
                            {module.duration} · +{module.type === "project" ? 90 : 30} XP
                          </p>
                        </div>
                        <span
                          className={`hidden flex-shrink-0 rounded-full px-2 py-1 text-xs sm:inline-flex ${getModuleBadgeClass(module.type)}`}
                        >
                          {getModuleTypeLabel(module.type, language)}
                        </span>
                        {module.free ? (
                          <span className="hidden flex-shrink-0 rounded-full bg-learn-500/20 px-2 py-1 text-xs text-learn-300 sm:inline-flex">
                            {copy.free}
                          </span>
                        ) : null}
                        <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/75 transition group-hover:bg-white/10 group-hover:border-white/25">
                          <PlayCircle className="h-3.5 w-3.5" />
                          {copy.open}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <ProgressRadar
              values={[
                { label: "Foundations", value: 52 },
                { label: "Builds", value: 28 },
                { label: "Feedback", value: 64 },
                { label: "Portfolio", value: 16 },
              ]}
            />
            <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-200" />
                <h3 className="font-bold">{copy.pathGoal}</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/66">
                {copy.pathGoalDescription}
              </p>
              <QuestTimeline
                items={[
                  {
                    title: "Starter missions",
                    meta: `${freeModules} quick wins`,
                    status: "active",
                  },
                  {
                    title: "Portfolio build",
                    meta: "Deployable project",
                    status: "locked",
                  },
                  {
                    title: "Marketplace unlock",
                    meta: "Collaboration opportunities",
                    status: "locked",
                  },
                ]}
              />
              <Link
                href="/marketplace"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                <Rocket className="h-4 w-4" />
                {copy.viewMissions}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function getModuleTypeLabel(type: Module["type"], language: Language) {
  const copy = PATH_COPY[language];
  if (type === "project") return copy.project;
  if (type === "exercise") return copy.exercise;
  return copy.lesson;
}

function getModuleBadgeClass(type: Module["type"]) {
  if (type === "project") return "bg-brand-500/25 text-brand-300";
  if (type === "exercise") return "bg-learn-500/25 text-learn-300";
  return "bg-white/10 text-white/60";
}
