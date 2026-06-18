import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Shield,
  Tag,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
  return {
    title: "Projet — JuniorCode Marketplace",
    description: "Détail d'un projet réel pour junior sur JuniorCode.",
  };
}

// ─── Copy ─────────────────────────────────────────────────────────────────────
const COPY: Record<
  Language,
  {
    back: string;
    apply: string;
    loginToApply: string;
    juniorOnly: string;
    requiredBadge: string;
    client: string;
    budget: string;
    duration: string;
    category: string;
    tags: string;
    description: string;
    requirements: string;
    deliverables: string;
    notFound: string;
    notFoundDesc: string;
    badgeRequired: string;
    posted: string;
  }
> = {
  fr: {
    back: "← Retour au Marketplace",
    apply: "Postuler à ce projet",
    loginToApply: "Connectez-vous pour postuler",
    juniorOnly: "Projet Junior-Only",
    requiredBadge: "Badge requis",
    client: "Client",
    budget: "Budget",
    duration: "Durée estimée",
    category: "Catégorie",
    tags: "Technologies",
    description: "Description du projet",
    requirements: "Prérequis",
    deliverables: "Livrables attendus",
    notFound: "Projet introuvable",
    notFoundDesc: "Ce projet n'existe pas ou a été clôturé.",
    badgeRequired: "Vous devez avoir ce badge pour postuler.",
    posted: "Publié récemment",
  },
  en: {
    back: "← Back to Marketplace",
    apply: "Apply to this project",
    loginToApply: "Log in to apply",
    juniorOnly: "Junior-Only Project",
    requiredBadge: "Required badge",
    client: "Client",
    budget: "Budget",
    duration: "Estimated duration",
    category: "Category",
    tags: "Technologies",
    description: "Project description",
    requirements: "Requirements",
    deliverables: "Expected deliverables",
    notFound: "Project not found",
    notFoundDesc: "This project doesn't exist or has been closed.",
    badgeRequired: "You need this badge to apply.",
    posted: "Recently posted",
  },
  es: {
    back: "← Volver al Marketplace",
    apply: "Postularse a este proyecto",
    loginToApply: "Inicia sesión para postularte",
    juniorOnly: "Proyecto Junior-Only",
    requiredBadge: "Insignia requerida",
    client: "Cliente",
    budget: "Presupuesto",
    duration: "Duración estimada",
    category: "Categoría",
    tags: "Tecnologías",
    description: "Descripción del proyecto",
    requirements: "Requisitos",
    deliverables: "Entregables esperados",
    notFound: "Proyecto no encontrado",
    notFoundDesc: "Este proyecto no existe o ha sido cerrado.",
    badgeRequired: "Necesitas esta insignia para postularte.",
    posted: "Publicado recientemente",
  },
};

type Language2 = Language;

interface Project {
  id: string;
  title: Record<Language2, string>;
  client: string;
  clientLogo: string;
  budget: string;
  duration: Record<Language2, string>;
  category: string;
  tags: string[];
  juniorOnly: boolean;
  requiredBadge?: string;
  description: Record<Language2, string>;
  requirements: Record<Language2, string[]>;
  deliverables: Record<Language2, string[]>;
  postedAt: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: {
      fr: "Landing page pour notre startup FinTech",
      en: "Landing page for our FinTech startup",
      es: "Landing page para nuestra startup FinTech",
    },
    client: "PayEasy",
    clientLogo: "PE",
    budget: "300–500€",
    duration: { fr: "2 semaines", en: "2 weeks", es: "2 semanas" },
    category: "Web",
    tags: ["Next.js", "Tailwind", "Figma"],
    juniorOnly: true,
    requiredBadge: "Web Developer L1",
    description: {
      fr: "Nous cherchons un développeur web junior pour créer la landing page marketing de notre application de paiement entre particuliers. Le design Figma est déjà prêt, il faut l'intégrer en Next.js avec des animations légères et un formulaire d'inscription en liste d'attente.",
      en: "We're looking for a junior web developer to create the marketing landing page for our peer-to-peer payment app. The Figma design is ready — you'll integrate it in Next.js with light animations and a waitlist signup form.",
      es: "Buscamos un desarrollador web junior para crear la landing page de marketing de nuestra app de pagos entre particulares. El diseño Figma ya está listo, hay que integrarlo en Next.js con animaciones ligeras y un formulario de lista de espera.",
    },
    requirements: {
      fr: [
        "Maîtriser HTML/CSS/JS",
        "Connaître Next.js et Tailwind",
        "Lire un design Figma",
      ],
      en: [
        "Master HTML/CSS/JS",
        "Know Next.js and Tailwind",
        "Read a Figma design",
      ],
      es: [
        "Dominar HTML/CSS/JS",
        "Conocer Next.js y Tailwind",
        "Leer un diseño Figma",
      ],
    },
    deliverables: {
      fr: [
        "Code source sur GitHub",
        "Site déployé sur Vercel",
        "Rapport de livraison",
      ],
      en: [
        "Source code on GitHub",
        "Site deployed on Vercel",
        "Delivery report",
      ],
      es: [
        "Código fuente en GitHub",
        "Sitio desplegado en Vercel",
        "Informe de entrega",
      ],
    },
    postedAt: "2026-06-01",
  },
  {
    id: "2",
    title: {
      fr: "Refonte UI de notre application mobile",
      en: "UI redesign for our mobile app",
      es: "Rediseño UI de nuestra app móvil",
    },
    client: "FoodTrack",
    clientLogo: "FT",
    budget: "400–700€",
    duration: { fr: "3 semaines", en: "3 weeks", es: "3 semanas" },
    category: "Design",
    tags: ["Figma", "UX", "Design System"],
    juniorOnly: false,
    requiredBadge: "UI Designer L1",
    description: {
      fr: "Notre app mobile de suivi alimentaire a besoin d'une refonte complète de son interface. Nous cherchons un designer junior capable de proposer un nouveau design system, des maquettes Figma pour les 10 écrans principaux, et un prototype cliquable.",
      en: "Our food tracking mobile app needs a complete UI overhaul. We're looking for a junior designer to propose a new design system, Figma mockups for the 10 main screens, and a clickable prototype.",
      es: "Nuestra app móvil de seguimiento alimentario necesita una renovación completa de su interfaz. Buscamos un diseñador junior que proponga un nuevo sistema de diseño, maquetas Figma para las 10 pantallas principales y un prototipo clickable.",
    },
    requirements: {
      fr: [
        "Maîtriser Figma",
        "Notions d'UX Design",
        "Portfolio avec au moins 1 projet UI",
      ],
      en: [
        "Master Figma",
        "Basic UX Design knowledge",
        "Portfolio with at least 1 UI project",
      ],
      es: [
        "Dominar Figma",
        "Conocimientos básicos de UX Design",
        "Portfolio con al menos 1 proyecto UI",
      ],
    },
    deliverables: {
      fr: [
        "Fichier Figma complet",
        "Prototype interactif",
        "Design system documenté",
      ],
      en: [
        "Complete Figma file",
        "Interactive prototype",
        "Documented design system",
      ],
      es: [
        "Archivo Figma completo",
        "Prototipo interactivo",
        "Sistema de diseño documentado",
      ],
    },
    postedAt: "2026-06-03",
  },
  {
    id: "3",
    title: {
      fr: "Dashboard analytics pour une asso culturelle",
      en: "Analytics dashboard for a cultural nonprofit",
      es: "Dashboard analytics para una asociación cultural",
    },
    client: "CultureParis",
    clientLogo: "CP",
    budget: "200–400€",
    duration: { fr: "10 jours", en: "10 days", es: "10 días" },
    category: "Data",
    tags: ["Python", "Pandas", "Streamlit"],
    juniorOnly: true,
    requiredBadge: "Data Analyst L1",
    description: {
      fr: "Nous sommes une association culturelle parisienne et nous avons besoin d'un tableau de bord simple pour visualiser nos données de fréquentation (fichiers CSV). Streamlit ou équivalent, déployé sur Streamlit Cloud.",
      en: "We're a Paris cultural nonprofit needing a simple dashboard to visualize our attendance data (CSV files). Streamlit or equivalent, deployed on Streamlit Cloud.",
      es: "Somos una asociación cultural parisina y necesitamos un tablero simple para visualizar nuestros datos de asistencia (archivos CSV). Streamlit o equivalente, desplegado en Streamlit Cloud.",
    },
    requirements: {
      fr: [
        "Python & Pandas",
        "Visualisation de données",
        "Streamlit ou Plotly",
      ],
      en: ["Python & Pandas", "Data visualization", "Streamlit or Plotly"],
      es: ["Python & Pandas", "Visualización de datos", "Streamlit o Plotly"],
    },
    deliverables: {
      fr: [
        "Code source GitHub",
        "Dashboard déployé en ligne",
        "Guide d'utilisation",
      ],
      en: ["GitHub source code", "Live deployed dashboard", "User guide"],
      es: [
        "Código fuente GitHub",
        "Dashboard desplegado en línea",
        "Guía de uso",
      ],
    },
    postedAt: "2026-06-05",
  },
];

export default async function ProjectDetailPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const cookieStore = await cookies();
  const langRaw = cookieStore
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  const language: Language = SUPPORTED_LANGUAGES.includes(langRaw as Language)
    ? (langRaw as Language)
    : "fr";
  const copy = COPY[language];
  const project = MOCK_PROJECTS.find((p) => p.id === id) ?? null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>

          {project ? (
            <div className="space-y-6">
              {/* ── Header card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                    {project.clientLogo}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">
                      {project.title[language]}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {copy.client}:{" "}
                      <span className="font-medium text-gray-700">
                        {project.client}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {copy.posted} ·{" "}
                      {new Date(project.postedAt).toLocaleDateString(
                        language === "fr" ? "fr-FR" : "en-GB",
                      )}
                    </div>
                  </div>
                </div>

                {/* Pills */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {project.budget}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {project.duration[language]}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                    <Tag className="h-4 w-4 text-purple-500" />
                    {project.category}
                  </span>
                  {project.juniorOnly && (
                    <span className="flex items-center gap-1.5 text-sm font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl">
                      <Users className="h-4 w-4" />
                      {copy.juniorOnly}
                    </span>
                  )}
                </div>

                {project.requiredBadge && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <Shield className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="text-sm text-amber-800">
                      <span className="font-semibold">
                        {copy.requiredBadge}:
                      </span>{" "}
                      {project.requiredBadge} — {copy.badgeRequired}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Description ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  {copy.description}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.description[language]}
                </p>
              </div>

              {/* ── Tags ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  {copy.tags}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Requirements & Deliverables ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-3">
                    {copy.requirements}
                  </h2>
                  <ul className="space-y-2">
                    {project.requirements[language].map((req) => (
                      <li
                        key={req}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-green-500 mt-0.5 shrink-0">
                          ✓
                        </span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-3">
                    {copy.deliverables}
                  </h2>
                  <ul className="space-y-2">
                    {project.deliverables[language].map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-brand-500 mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── CTA ── */}
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-brand-900">
                    {project.title[language]}
                  </p>
                  <p className="text-sm text-brand-700">
                    {project.budget} · {project.duration[language]}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Briefcase className="h-4 w-4" />
                    {copy.apply}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">📭</p>
              <h1 className="text-xl font-bold text-gray-800">
                {copy.notFound}
              </h1>
              <p className="text-gray-500 mt-2">{copy.notFoundDesc}</p>
              <Link
                href="/marketplace"
                className="inline-block mt-6 text-brand-600 hover:underline text-sm font-medium"
              >
                {copy.back}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
