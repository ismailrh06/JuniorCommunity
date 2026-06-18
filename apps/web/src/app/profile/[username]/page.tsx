import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — Profil Junior JuniorCode`,
    description: `Portfolio public et badges certifiés de ${username} sur JuniorCode.`,
  };
}

// ─── Copy ─────────────────────────────────────────────────────────────────────
const COPY: Record<
  Language,
  {
    back: string;
    available: string;
    busy: string;
    level: string;
    badges: string;
    portfolio: string;
    skills: string;
    hireMe: string;
    viewProject: string;
    obtainedOn: string;
    certifiedBy: string;
    openToMissions: string;
    noProjects: string;
    completedProjects: string;
    reviews: string;
    notFound: string;
    notFoundDesc: string;
  }
> = {
  fr: {
    back: "← Retour",
    available: "Disponible pour une mission",
    busy: "Actuellement occupé",
    level: "Niveau",
    badges: "Badges certifiés",
    portfolio: "Portfolio",
    skills: "Compétences",
    hireMe: "Contacter pour une mission",
    viewProject: "Voir le projet",
    obtainedOn: "Obtenu le",
    certifiedBy: "Certifié par JuniorCode",
    openToMissions: "Ouvert aux missions Junior-Only",
    noProjects: "Aucun projet pour l'instant.",
    completedProjects: "projets réalisés",
    reviews: "avis",
    notFound: "Profil introuvable",
    notFoundDesc: "Ce profil n'existe pas ou a été supprimé.",
  },
  en: {
    back: "← Back",
    available: "Available for a mission",
    busy: "Currently busy",
    level: "Level",
    badges: "Certified badges",
    portfolio: "Portfolio",
    skills: "Skills",
    hireMe: "Contact for a mission",
    viewProject: "View project",
    obtainedOn: "Earned on",
    certifiedBy: "Certified by JuniorCode",
    openToMissions: "Open to Junior-Only missions",
    noProjects: "No projects yet.",
    completedProjects: "completed projects",
    reviews: "reviews",
    notFound: "Profile not found",
    notFoundDesc: "This profile does not exist or was removed.",
  },
  es: {
    back: "← Volver",
    available: "Disponible para una misión",
    busy: "Actualmente ocupado",
    level: "Nivel",
    badges: "Insignias certificadas",
    portfolio: "Portafolio",
    skills: "Habilidades",
    hireMe: "Contactar para una misión",
    viewProject: "Ver proyecto",
    obtainedOn: "Obtenido el",
    certifiedBy: "Certificado por JuniorCode",
    openToMissions: "Abierto a misiones Junior-Only",
    noProjects: "Sin proyectos por ahora.",
    completedProjects: "proyectos realizados",
    reviews: "reseñas",
    notFound: "Perfil no encontrado",
    notFoundDesc: "Este perfil no existe o fue eliminado.",
  },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PROFILES: Record<
  string,
  {
    username: string;
    fullName: string;
    avatar: string;
    role: string;
    level: number;
    city: string;
    bio: Record<Language, string>;
    available: boolean;
    githubUrl: string;
    portfolioUrl: string;
    skills: string[];
    completedProjects: number;
    reviewCount: number;
    avgRating: number;
    badges: Array<{
      marker: string;
      name: string;
      earnedAt: string;
      projectUrl: string | null;
    }>;
    projects: Array<{
      title: string;
      description: Record<Language, string>;
      tags: string[];
      url: string | null;
      isReal: boolean;
    }>;
  }
> = {
  "alex-martin": {
    username: "alex-martin",
    fullName: "Alex Martin",
    avatar: "AM",
    role: "Web Developer",
    level: 2,
    city: "Paris",
    bio: {
      fr: "Développeur web junior passionné par React et le design. Je construis des projets réels depuis 6 mois et je cherche ma première mission rémunérée.",
      en: "Junior web developer passionate about React and design. I've been building real projects for 6 months and looking for my first paid mission.",
      es: "Desarrollador web junior apasionado por React y el diseño. Construyo proyectos reales desde hace 6 meses y busco mi primera misión remunerada.",
    },
    available: true,
    githubUrl: "https://github.com/alex-martin",
    portfolioUrl: "https://alexmartin.dev",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Git",
    ],
    completedProjects: 3,
    reviewCount: 2,
    avgRating: 4.5,
    badges: [
      {
        marker: "HTML",
        name: "HTML Basics",
        earnedAt: "2026-01-15",
        projectUrl: "https://github.com/alex-martin/html-project",
      },
      {
        marker: "GIT",
        name: "Git Ready",
        earnedAt: "2026-02-10",
        projectUrl: "https://github.com/alex-martin",
      },
      {
        marker: "JS",
        name: "JS Starter",
        earnedAt: "2026-03-20",
        projectUrl: "https://github.com/alex-martin/js-quiz",
      },
    ],
    projects: [
      {
        title: "Portfolio personnel",
        description: {
          fr: "Site portfolio construit avec Next.js et Tailwind CSS, déployé sur Vercel.",
          en: "Portfolio site built with Next.js and Tailwind CSS, deployed on Vercel.",
          es: "Sitio portfolio construido con Next.js y Tailwind CSS, desplegado en Vercel.",
        },
        tags: ["Next.js", "Tailwind", "Vercel"],
        url: "https://alexmartin.dev",
        isReal: false,
      },
      {
        title: "Landing page PayEasy",
        description: {
          fr: "Mission réelle — Landing page pour une startup FinTech. Livrée en 10 jours.",
          en: "Real mission — Landing page for a FinTech startup. Delivered in 10 days.",
          es: "Misión real — Landing page para una startup FinTech. Entregada en 10 días.",
        },
        tags: ["Next.js", "Figma", "SEO"],
        url: null,
        isReal: true,
      },
    ],
  },
};

export default async function ProfilePage({
  params,
}: Readonly<{
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;
  const cookieStore = await cookies();
  const langRaw = cookieStore
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  const language: Language = SUPPORTED_LANGUAGES.includes(langRaw as Language)
    ? (langRaw as Language)
    : "fr";
  const copy = COPY[language];
  const profile = MOCK_PROFILES[username] ?? null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            {copy.back}
          </Link>

          {profile ? (
            <div className="space-y-6">
              {/* ── Hero card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {profile.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">
                          {profile.fullName}
                        </h1>
                        <p className="text-sm text-gray-500">
                          @{profile.username}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          profile.available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${profile.available ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                        />
                        {profile.available ? copy.available : copy.busy}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                      <span>{profile.role}</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {profile.avgRating.toFixed(1)} ({profile.reviewCount}{" "}
                        {copy.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.city}
                      </span>
                      <span>
                        {copy.level} {profile.level}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {profile.bio[language]}
                    </p>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      {profile.available && (
                        <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-full font-medium">
                          {copy.openToMissions}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        <Briefcase className="inline h-3.5 w-3.5 mr-1" />
                        {profile.completedProjects} {copy.completedProjects}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Links & CTA */}
                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <span className="font-bold text-xs bg-gray-900 text-white rounded px-1.5 py-0.5">
                          {"GH"}
                        </span>
                        {" GitHub"}
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                  {profile.available && (
                    <Link
                      href={`/marketplace?contact=${profile.username}`}
                      className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      <Briefcase className="h-4 w-4" />
                      {copy.hireMe}
                    </Link>
                  )}
                </div>
              </div>

              {/* ── Skills ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  {copy.skills}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Certified badges ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  {copy.badges}
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    {copy.certifiedBy}
                  </span>
                </h2>
                <div className="space-y-3">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.name}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-12 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] font-mono text-[10px] font-semibold text-emerald-200">
                          {badge.marker}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {badge.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {copy.obtainedOn}{" "}
                            {new Date(badge.earnedAt).toLocaleDateString(
                              { fr: "fr-FR", en: "en-GB", es: "es-ES" }[
                                language
                              ],
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {badge.projectUrl && (
                          <a
                            href={badge.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Proof
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Portfolio projects ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  {copy.portfolio}
                </h2>
                {profile.projects.length === 0 ? (
                  <p className="text-sm text-gray-400">{copy.noProjects}</p>
                ) : (
                  <div className="space-y-4">
                    {profile.projects.map((project) => (
                      <div
                        key={project.title}
                        className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {project.title}
                              </h3>
                              {project.isReal && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                  🏆 Mission réelle
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {project.description[language]}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 flex items-center gap-1 text-xs text-brand-600 hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {copy.viewProject}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] font-mono text-xs text-emerald-200">
                USER
              </p>
              <h1 className="text-xl font-bold text-gray-800">
                {copy.notFound}
              </h1>
              <p className="text-gray-500 mt-2">{copy.notFoundDesc}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
