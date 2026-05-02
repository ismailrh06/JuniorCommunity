import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Profil Junior — JuniorCode",
  description: "Profil public d'un junior certifié JuniorCode.",
};

// ─── Copy ────────────────────────────────────────────────────────────────────
const COPY: Record<
  Language,
  {
    back: string;
    available: string;
    busy: string;
    level: string;
    badges: string;
    badgeProof: string;
    portfolio: string;
    skills: string;
    hireMe: string;
    viewProject: string;
    obtainedOn: string;
    certifiedBy: string;
    openToMissions: string;
  }
> = {
  fr: {
    back: "Retour à la marketplace",
    available: "Disponible pour une mission",
    busy: "Actuellement occupé",
    level: "Niveau",
    badges: "Badges certifiés",
    badgeProof: "Preuve",
    portfolio: "Portfolio",
    skills: "Compétences",
    hireMe: "Me contacter pour une mission",
    viewProject: "Voir le projet",
    obtainedOn: "Obtenu le",
    certifiedBy: "Certifié par JuniorCode",
    openToMissions: "Ouvert aux missions Junior-Only",
  },
  en: {
    back: "Back to marketplace",
    available: "Available for a mission",
    busy: "Currently busy",
    level: "Level",
    badges: "Certified badges",
    badgeProof: "Proof",
    portfolio: "Portfolio",
    skills: "Skills",
    hireMe: "Contact me for a mission",
    viewProject: "View project",
    obtainedOn: "Obtained on",
    certifiedBy: "Certified by JuniorCode",
    openToMissions: "Open to Junior-Only missions",
  },
  es: {
    back: "Volver al marketplace",
    available: "Disponible para una misión",
    busy: "Actualmente ocupado",
    level: "Nivel",
    badges: "Badges certificados",
    badgeProof: "Prueba",
    portfolio: "Portfolio",
    skills: "Habilidades",
    hireMe: "Contactarme para una misión",
    viewProject: "Ver proyecto",
    obtainedOn: "Obtenido el",
    certifiedBy: "Certificado por JuniorCode",
    openToMissions: "Abierto a misiones Junior-Only",
  },
};

// ─── Mock profile data ────────────────────────────────────────────────────────
const MOCK_PROFILE = {
  id: "alex-martin",
  name: "Alex Martin",
  title: { fr: "Développeur Web Junior", en: "Junior Web Developer", es: "Desarrollador Web Junior" },
  bio: {
    fr: "Passionné par le web, j'ai terminé le parcours Développeur Web JuniorCode en 8 semaines. Je cherche ma première vraie mission pour mettre en pratique mes compétences.",
    en: "Passionate about the web, I completed JuniorCode's Web Developer path in 8 weeks. I'm looking for my first real mission to put my skills to use.",
    es: "Apasionado por la web, completé la ruta Desarrollador Web de JuniorCode en 8 semanas. Busco mi primera misión real para poner en práctica mis habilidades.",
  },
  location: "Paris, France",
  available: true,
  level: 3,
  joinedDate: "Janvier 2026",
  github: "https://github.com",
  website: "https://alex-martin.dev",
  skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "Git", "Figma"],
  badges: [
    {
      emoji: "🌐",
      title: "Web Developer L1",
      proof: {
        fr: "A livré une landing page responsive et déployée sur GitHub Pages.",
        en: "Delivered a responsive landing page deployed on GitHub Pages.",
        es: "Entregó una landing page responsive desplegada en GitHub Pages.",
      },
      date: "15 Feb 2026",
    },
    {
      emoji: "⚙️",
      title: "Git & GitHub",
      proof: {
        fr: "Maîtrise du versionning, branches, pull requests et déploiement.",
        en: "Mastery of versioning, branches, pull requests and deployment.",
        es: "Dominio del versionado, ramas, pull requests y despliegue.",
      },
      date: "20 Feb 2026",
    },
    {
      emoji: "⚛️",
      title: "React Developer",
      proof: {
        fr: "A construit une SPA complète avec routing, état et API.",
        en: "Built a complete SPA with routing, state management and API calls.",
        es: "Construyó una SPA completa con routing, estado y llamadas a API.",
      },
      date: "10 Mar 2026",
    },
  ],
  projects: [
    {
      id: "1",
      title: "Portfolio Personnel",
      description: {
        fr: "Portfolio responsive construit avec Next.js et Tailwind CSS. Inclut une section blog et des animations au scroll.",
        en: "Responsive portfolio built with Next.js and Tailwind CSS. Includes a blog section and scroll animations.",
        es: "Portfolio responsive construido con Next.js y Tailwind CSS. Incluye sección blog y animaciones al scroll.",
      },
      tags: ["Next.js", "Tailwind", "Framer Motion"],
      badge: "🌐 Web Developer L1",
      liveUrl: "https://alex-martin.dev",
      color: "from-learn-500/10 to-brand-500/5",
      border: "border-learn-400/20",
    },
    {
      id: "2",
      title: "To-Do App",
      description: {
        fr: "Application de gestion de tâches avec filtrage, persistance localStorage et interface accessible.",
        en: "Task management app with filtering, localStorage persistence and accessible UI.",
        es: "App de gestión de tareas con filtrado, persistencia localStorage e interfaz accesible.",
      },
      tags: ["React", "CSS", "localStorage"],
      badge: "⚛️ React Developer",
      liveUrl: "https://github.com",
      color: "from-brand-500/10 to-market-500/5",
      border: "border-brand-400/20",
    },
    {
      id: "3",
      title: "Landing Page FinTech",
      description: {
        fr: "Landing page client réalisée dans le cadre d'une mission Junior-Only. Optimisée SEO et performances.",
        en: "Client landing page delivered as a Junior-Only mission. SEO optimized and high performance.",
        es: "Landing page de cliente entregada como misión Junior-Only. Optimizada para SEO y rendimiento.",
      },
      tags: ["Next.js", "Figma", "SEO"],
      badge: "🌐 Web Developer L1",
      liveUrl: "https://github.com",
      color: "from-market-500/10 to-brand-500/5",
      border: "border-market-400/20",
      missionBadge: true,
    },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProfilePage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  await params; // id available for future DB lookup

  const languageCookie = cookies().get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";

  const copy = COPY[language];
  const profile = MOCK_PROFILE;

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <Navbar />

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Profile Header ── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-[80px]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-learn-500 text-3xl font-black text-white">
              {profile.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {profile.available ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-400/40 bg-green-500/15 px-3 py-1 text-xs font-medium text-green-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    {copy.available}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                    {copy.busy}
                  </span>
                )}
              </div>

              <p className="text-white/70 mb-1">{profile.title[language]}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/45 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Membre depuis {profile.joinedDate}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-brand-400/30 bg-brand-500/10 px-2 py-0.5 text-brand-300">
                  {copy.level} {profile.level}
                </span>
              </div>

              <p className="text-sm text-white/70 max-w-xl mb-4">{profile.bio[language]}</p>

              <div className="flex flex-wrap gap-2">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
                  >
                    {"GitHub"}
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {profile.website.replace("https://", "")}
                  </a>
                )}
                <a
                  href={`mailto:contact@juniorcode.co?subject=Mission pour ${profile.name}`}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-500"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  {copy.hireMe}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
              <h2 className="mb-4 font-semibold text-white/90">{copy.skills}</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-white/70"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Open to missions */}
            {profile.available && (
              <div className="rounded-2xl border border-market-400/25 bg-market-500/8 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-market-200">
                  <Briefcase className="h-4 w-4" />
                  {copy.openToMissions}
                </div>
                <Link
                  href="/marketplace"
                  className="text-xs text-market-300 underline underline-offset-2 hover:text-market-200"
                >
                  Voir les missions disponibles →
                </Link>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-8 lg:col-span-2">

            {/* Badges */}
            <div>
              <h2 className="mb-4 font-semibold text-white/90">{copy.badges}</h2>
              <div className="space-y-3">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-brand-400/30 hover:bg-white/[0.07]"
                  >
                    <span className="text-2xl shrink-0">{badge.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{badge.title}</span>
                        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-xs text-brand-300 border border-brand-400/20">
                          {copy.certifiedBy}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 rounded-lg border border-white/8 bg-black/20 px-3 py-2">
                        <span className="text-xs text-brand-300 mt-0.5">✓</span>
                        <p className="text-xs text-white/65 italic">« {badge.proof[language]} »</p>
                      </div>
                      <p className="mt-2 text-xs text-white/35">{copy.obtainedOn} {badge.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h2 className="mb-4 font-semibold text-white/90">{copy.portfolio}</h2>
              <div className="space-y-4">
                {profile.projects.map((project) => (
                  <div
                    key={project.id}
                    className={`relative overflow-hidden rounded-2xl border ${project.border} bg-gradient-to-br ${project.color} p-6 transition hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    {project.missionBadge && (
                      <span className="absolute right-4 top-4 rounded-full border border-market-400/40 bg-market-500/20 px-2.5 py-0.5 text-xs font-medium text-market-200">
                        ✅ Mission réelle
                      </span>
                    )}
                    <div className="mb-3 flex items-start gap-3">
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="mt-1 text-sm text-white/65">{project.description[language]}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-white/45">
                        🏅 {project.badge}
                      </span>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/15"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {copy.viewProject}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
