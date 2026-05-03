import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  ShieldAlert,
  Award,
  Eye,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Admin — JuniorCode",
  description: "Tableau de bord d'administration JuniorCode.",
};

// ─── Copy ─────────────────────────────────────────────────────────────────────
const COPY: Record<Language, {
  title: string;
  subtitle: string;
  statsTitle: string;
  usersSection: string;
  projectsSection: string;
  badgesSection: string;
  name: string;
  email: string;
  role: string;
  status: string;
  actions: string;
  view: string;
  active: string;
  pending: string;
  client: string;
  budget: string;
  badgeName: string;
  issuedTo: string;
  date: string;
}> = {
  fr: {
    title: "Administration",
    subtitle: "Vue d'ensemble de la plateforme JuniorCode.",
    statsTitle: "Statistiques",
    usersSection: "Utilisateurs récents",
    projectsSection: "Projets actifs",
    badgesSection: "Badges récents",
    name: "Nom",
    email: "Email",
    role: "Rôle",
    status: "Statut",
    actions: "Actions",
    view: "Voir",
    active: "Actif",
    pending: "En attente",
    client: "Client",
    budget: "Budget",
    badgeName: "Badge",
    issuedTo: "Attribué à",
    date: "Date",
  },
  en: {
    title: "Administration",
    subtitle: "JuniorCode platform overview.",
    statsTitle: "Statistics",
    usersSection: "Recent users",
    projectsSection: "Active projects",
    badgesSection: "Recent badges",
    name: "Name",
    email: "Email",
    role: "Role",
    status: "Status",
    actions: "Actions",
    view: "View",
    active: "Active",
    pending: "Pending",
    client: "Client",
    budget: "Budget",
    badgeName: "Badge",
    issuedTo: "Issued to",
    date: "Date",
  },
  es: {
    title: "Administración",
    subtitle: "Resumen de la plataforma JuniorCode.",
    statsTitle: "Estadísticas",
    usersSection: "Usuarios recientes",
    projectsSection: "Proyectos activos",
    badgesSection: "Insignias recientes",
    name: "Nombre",
    email: "Email",
    role: "Rol",
    status: "Estado",
    actions: "Acciones",
    view: "Ver",
    active: "Activo",
    pending: "Pendiente",
    client: "Cliente",
    budget: "Presupuesto",
    badgeName: "Insignia",
    issuedTo: "Otorgado a",
    date: "Fecha",
  },
};

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "1", name: "Alex Martin", email: "alex@example.com", role: "learner", status: "active", joinedAt: "2026-06-01" },
  { id: "2", name: "Sophie Durand", email: "sophie@example.com", role: "student", status: "active", joinedAt: "2026-06-02" },
  { id: "3", name: "Lucas Chen", email: "lucas@example.com", role: "learner", status: "pending", joinedAt: "2026-06-05" },
  { id: "4", name: "PayEasy SAS", email: "contact@payeasy.fr", role: "client", status: "active", joinedAt: "2026-05-28" },
  { id: "5", name: "Maria Lopez", email: "maria@example.com", role: "learner", status: "active", joinedAt: "2026-06-07" },
];

const MOCK_PROJECTS = [
  { id: "1", title: "Landing page FinTech", client: "PayEasy", budget: "300–500€", status: "active", applicants: 3 },
  { id: "2", title: "Refonte UI mobile", client: "FoodTrack", budget: "400–700€", status: "active", applicants: 5 },
  { id: "3", title: "Dashboard analytics", client: "CultureParis", budget: "200–400€", status: "pending", applicants: 1 },
];

const MOCK_BADGES = [
  { id: "1", badge: "🌐 Web Developer L1", issuedTo: "Alex Martin", date: "2026-06-15" },
  { id: "2", badge: "🎨 UI Designer L1", issuedTo: "Sophie Durand", date: "2026-06-18" },
  { id: "3", badge: "📊 Data Analyst L1", issuedTo: "Lucas Chen", date: "2026-06-20" },
];

const STATS = [
  { emoji: "👥", key: "users", value: 142, trend: "+12 ce mois" },
  { emoji: "📁", key: "projects", value: 38, trend: "+5 ce mois" },
  { emoji: "🏅", key: "badges", value: 94, trend: "+18 ce mois" },
  { emoji: "💰", key: "revenue", value: "4 200€", trend: "+800€ ce mois" },
];

export default async function AdminPage() {
  // Auth check — must be logged in AND have role "admin"
  const cookieStore = cookies();
  const userRaw = cookieStore.get("jc-mock-user")?.value;
  if (!userRaw) redirect("/auth/login");

  let role = "";
  try {
    const user = JSON.parse(Buffer.from(userRaw, "base64").toString("utf-8")) as { role?: string };
    role = user.role ?? "";
  } catch {
    redirect("/auth/login");
  }

  // In mock mode anyone with the URL can preview; in production we'd strictly gate by role === "admin"
  const isAdmin = role === "admin";

  const langRaw = cookieStore.get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language: Language = SUPPORTED_LANGUAGES.includes(langRaw as Language)
    ? (langRaw as Language)
    : "fr";
  const copy = COPY[language];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h1 className="text-2xl font-extrabold text-gray-900">{copy.title}</h1>
                {!isAdmin && (
                  <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                    Mode démo
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{copy.subtitle}</p>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <div key={stat.key} className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-2xl mb-1">{stat.emoji}</p>
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.trend}</p>
              </div>
            ))}
          </div>

          {/* ── Users table ── */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Users className="h-4 w-4 text-brand-500" />
              <h2 className="text-sm font-bold text-gray-900">{copy.usersSection}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[copy.name, copy.email, copy.role, copy.status, copy.actions].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          ({ client: "bg-blue-100 text-blue-700", student: "bg-purple-100 text-purple-700", learner: "bg-green-100 text-green-700" } as Record<string, string>)[user.role] ?? "bg-gray-100 text-gray-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          user.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {user.status === "active" ? copy.active : copy.pending}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/profile/${user.name.toLowerCase().replaceAll(" ", "-")}`}
                          className="inline-flex items-center gap-1 text-brand-600 hover:underline text-xs font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {copy.view}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Projects table ── */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Briefcase className="h-4 w-4 text-brand-500" />
              <h2 className="text-sm font-bold text-gray-900">{copy.projectsSection}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Projet", copy.client, copy.budget, copy.status, "Candidats"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_PROJECTS.map((proj) => (
                    <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        <Link href={`/projects/${proj.id}`} className="hover:text-brand-600 hover:underline">
                          {proj.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{proj.client}</td>
                      <td className="px-5 py-3 text-gray-500">{proj.budget}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          proj.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {proj.status === "active" ? copy.active : copy.pending}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{proj.applicants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Badges table ── */}
          <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Award className="h-4 w-4 text-brand-500" />
              <h2 className="text-sm font-bold text-gray-900">{copy.badgesSection}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[copy.badgeName, copy.issuedTo, copy.date].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_BADGES.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{b.badge}</td>
                      <td className="px-5 py-3 text-gray-500">{b.issuedTo}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
