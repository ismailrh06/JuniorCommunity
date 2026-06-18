import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSecurityEvents,
  resolveSecurityEvent,
  type SecurityEvent,
} from "@/lib/security-store";
import {
  Activity,
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Database,
  Eye,
  FlameKindling,
  Globe,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getSupabaseServerClient } from "@juniorcode/db/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Admin — JuniorCode",
  description: "Console d'administration JuniorCode.",
};

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

type AdminProject = {
  id: string;
  title: string;
  status: string;
  budget_min: number;
  budget_max: number;
  client_id: string;
  created_at: string;
};

type AdminApplication = {
  id: string;
  status: string;
  proposed_budget: number;
  project_id: string;
  applicant_id: string;
  created_at: string;
};

type AdminEvent = {
  event: string;
  user_id: string | null;
  created_at: string;
};

type AdminData = {
  users: AdminUser[];
  projects: AdminProject[];
  applications: AdminApplication[];
  events: AdminEvent[];
  securityEvents: SecurityEvent[];
};

const COPY: Record<
  Language,
  {
    title: string;
    subtitle: string;
    secureArea: string;
    users: string;
    projects: string;
    applications: string;
    analytics: string;
    controls: string;
    riskCenter: string;
    roles: string;
    recentUsers: string;
    recentProjects: string;
    recentApplications: string;
    recentEvents: string;
    name: string;
    email: string;
    role: string;
    status: string;
    budget: string;
    applicant: string;
    project: string;
    event: string;
    date: string;
    actions: string;
    view: string;
    empty: string;
    securityTitle: string;
    securitySubtitle: string;
    securityThreats: string;
    securityResolved: string;
    securityCritical: string;
    securityHigh: string;
    securityMedium: string;
    securityLow: string;
    securityIp: string;
    securityUser: string;
    securityDesc: string;
    securitySeverity: string;
    securityType: string;
    securityStatus: string;
    securityOpen: string;
    securityResolvedLabel: string;
  }
> = {
  fr: {
    title: "Console admin",
    subtitle:
      "Pilotage privé de la plateforme : utilisateurs, projets, candidatures, rôles et signaux de sécurité.",
    secureArea: "Accès réservé aux administrateurs",
    users: "Utilisateurs",
    projects: "Projets",
    applications: "Candidatures",
    analytics: "Événements",
    controls: "Contrôles admin",
    riskCenter: "Centre de vigilance",
    roles: "Rôles & permissions",
    recentUsers: "Utilisateurs récents",
    recentProjects: "Projets à surveiller",
    recentApplications: "Candidatures récentes",
    recentEvents: "Activité analytics",
    name: "Nom",
    email: "Email",
    role: "Rôle",
    status: "Statut",
    budget: "Budget",
    applicant: "Candidat",
    project: "Projet",
    event: "Événement",
    date: "Date",
    actions: "Actions",
    view: "Voir",
    empty: "Aucune donnée pour le moment.",
    securityTitle: "🛡️ Security Dashboard",
    securitySubtitle:
      "Interactions suspectes détectées sur la plateforme en temps réel.",
    securityThreats: "Menaces actives",
    securityResolved: "Résolues",
    securityCritical: "Critique",
    securityHigh: "Élevée",
    securityMedium: "Moyenne",
    securityLow: "Faible",
    securityIp: "Adresse IP",
    securityUser: "Utilisateur",
    securityDesc: "Description",
    securitySeverity: "Sévérité",
    securityType: "Type",
    securityStatus: "Statut",
    securityOpen: "Ouvert",
    securityResolvedLabel: "Résolu",
  },
  en: {
    title: "Admin console",
    subtitle:
      "Private platform operations: users, projects, applications, roles, and security signals.",
    secureArea: "Administrators only",
    users: "Users",
    projects: "Projects",
    applications: "Applications",
    analytics: "Events",
    controls: "Admin controls",
    riskCenter: "Risk center",
    roles: "Roles & permissions",
    recentUsers: "Recent users",
    recentProjects: "Projects to review",
    recentApplications: "Recent applications",
    recentEvents: "Analytics activity",
    name: "Name",
    email: "Email",
    role: "Role",
    status: "Status",
    budget: "Budget",
    applicant: "Applicant",
    project: "Project",
    event: "Event",
    date: "Date",
    actions: "Actions",
    view: "View",
    empty: "No data yet.",
    securityTitle: "🛡️ Security Dashboard",
    securitySubtitle:
      "Suspicious interactions detected on the platform in real time.",
    securityThreats: "Active threats",
    securityResolved: "Resolved",
    securityCritical: "Critical",
    securityHigh: "High",
    securityMedium: "Medium",
    securityLow: "Low",
    securityIp: "IP Address",
    securityUser: "User",
    securityDesc: "Description",
    securitySeverity: "Severity",
    securityType: "Type",
    securityStatus: "Status",
    securityOpen: "Open",
    securityResolvedLabel: "Resolved",
  },
  es: {
    title: "Consola admin",
    subtitle:
      "Operaciones privadas: usuarios, proyectos, candidaturas, roles y señales de seguridad.",
    secureArea: "Solo administradores",
    users: "Usuarios",
    projects: "Proyectos",
    applications: "Candidaturas",
    analytics: "Eventos",
    controls: "Controles admin",
    riskCenter: "Centro de vigilancia",
    roles: "Roles y permisos",
    recentUsers: "Usuarios recientes",
    recentProjects: "Proyectos a revisar",
    recentApplications: "Candidaturas recientes",
    recentEvents: "Actividad analytics",
    name: "Nombre",
    email: "Email",
    role: "Rol",
    status: "Estado",
    budget: "Presupuesto",
    applicant: "Candidato",
    project: "Proyecto",
    event: "Evento",
    date: "Fecha",
    actions: "Acciones",
    view: "Ver",
    empty: "Aún no hay datos.",
    securityTitle: "🛡️ Security Dashboard",
    securitySubtitle:
      "Interacciones sospechosas detectadas en la plataforma en tiempo real.",
    securityThreats: "Amenazas activas",
    securityResolved: "Resueltas",
    securityCritical: "Crítica",
    securityHigh: "Alta",
    securityMedium: "Media",
    securityLow: "Baja",
    securityIp: "Dirección IP",
    securityUser: "Usuario",
    securityDesc: "Descripción",
    securitySeverity: "Severidad",
    securityType: "Tipo",
    securityStatus: "Estado",
    securityOpen: "Abierto",
    securityResolvedLabel: "Resuelto",
  },
};

const MOCK_DATA: AdminData = {
  users: [
    {
      id: "alex-martin",
      email: "alex@example.com",
      full_name: "Alex Martin",
      role: "learner",
      created_at: "2026-06-01",
    },
    {
      id: "sophie-durand",
      email: "sophie@example.com",
      full_name: "Sophie Durand",
      role: "student",
      created_at: "2026-06-02",
    },
    {
      id: "payeasy",
      email: "contact@payeasy.fr",
      full_name: "PayEasy SAS",
      role: "client",
      created_at: "2026-05-28",
    },
    {
      id: "admin-test",
      email: "admin@example.com",
      full_name: "Admin Test",
      role: "admin",
      created_at: "2026-05-03",
    },
  ],
  projects: [
    {
      id: "1",
      title: "Landing page FinTech",
      status: "open",
      budget_min: 300,
      budget_max: 500,
      client_id: "payeasy",
      created_at: "2026-06-12",
    },
    {
      id: "2",
      title: "Dashboard analytics",
      status: "draft",
      budget_min: 200,
      budget_max: 400,
      client_id: "cultureparis",
      created_at: "2026-06-16",
    },
    {
      id: "3",
      title: "Refonte UI mobile",
      status: "in_progress",
      budget_min: 400,
      budget_max: 700,
      client_id: "foodtrack",
      created_at: "2026-06-19",
    },
  ],
  applications: [
    {
      id: "a1",
      status: "pending",
      proposed_budget: 450,
      project_id: "1",
      applicant_id: "alex-martin",
      created_at: "2026-06-18",
    },
    {
      id: "a2",
      status: "viewed",
      proposed_budget: 350,
      project_id: "2",
      applicant_id: "sophie-durand",
      created_at: "2026-06-20",
    },
  ],
  events: [
    { event: "signup", user_id: "alex-martin", created_at: "2026-06-01" },
    {
      event: "project_applied",
      user_id: "sophie-durand",
      created_at: "2026-06-20",
    },
    { event: "badge_earned", user_id: "alex-martin", created_at: "2026-06-21" },
  ],
  securityEvents: [
    {
      id: "sec-1",
      type: "brute_force",
      severity: "critical",
      user_id: null,
      ip: "185.220.101.47",
      description:
        "47 tentatives de connexion échouées en 3 minutes depuis la même IP.",
      created_at: "2026-05-03T14:22:00Z",
      resolved: false,
    },
    {
      id: "sec-2",
      type: "role_escalation",
      severity: "critical",
      user_id: "sophie-durand",
      ip: "92.184.12.5",
      description:
        "Tentative de modification du rôle via l'API sans autorisation admin.",
      created_at: "2026-05-03T11:05:00Z",
      resolved: false,
    },
    {
      id: "sec-3",
      type: "mass_request",
      severity: "high",
      user_id: null,
      ip: "103.251.167.20",
      description:
        "1 200 requêtes GET /api/projects en 60 secondes — possible scraping.",
      created_at: "2026-05-02T22:45:00Z",
      resolved: false,
    },
    {
      id: "sec-4",
      type: "invalid_token",
      severity: "high",
      user_id: "payeasy",
      ip: "77.37.214.8",
      description: "Token JWT expiré réutilisé 8 fois après expiration.",
      created_at: "2026-05-02T18:30:00Z",
      resolved: false,
    },
    {
      id: "sec-5",
      type: "suspicious_ip",
      severity: "medium",
      user_id: "alex-martin",
      ip: "45.142.212.100",
      description:
        "Connexion depuis une IP signalée dans la base Tor Exit Nodes.",
      created_at: "2026-05-01T09:15:00Z",
      resolved: true,
    },
    {
      id: "sec-6",
      type: "scraping",
      severity: "medium",
      user_id: null,
      ip: "198.199.94.55",
      description:
        "User-Agent bot détecté sur /marketplace avec 300 requêtes en 2 min.",
      created_at: "2026-04-30T16:00:00Z",
      resolved: true,
    },
    {
      id: "sec-7",
      type: "invalid_token",
      severity: "low",
      user_id: null,
      ip: "213.32.4.12",
      description:
        "Token malformé envoyé à /api/onboarding — possible test de fuzzing.",
      created_at: "2026-04-29T08:00:00Z",
      resolved: true,
    },
  ],
};

async function getLanguage() {
  const cookieStore = await cookies();
  const langRaw = cookieStore
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(langRaw as Language)
    ? (langRaw as Language)
    : "fr";
}

async function getMockRole() {
  const cookieStore = await cookies();
  const userRaw = cookieStore.get("jc-mock-user")?.value;
  if (!userRaw) return null;

  try {
    const user = JSON.parse(
      Buffer.from(userRaw, "base64").toString("utf-8"),
    ) as { role?: string };
    return user.role ?? null;
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function roleBadge(role: string) {
  const classes: Record<string, string> = {
    admin: "bg-red-50 text-red-700 border-red-200",
    mentor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    client: "bg-blue-50 text-blue-700 border-blue-200",
    student: "bg-purple-50 text-purple-700 border-purple-200",
    learner: "bg-green-50 text-green-700 border-green-200",
  };

  return classes[role] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

function statusBadge(status: string) {
  const classes: Record<string, string> = {
    open: "bg-green-50 text-green-700 border-green-200",
    active: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    viewed: "bg-blue-50 text-blue-700 border-blue-200",
    draft: "bg-gray-50 text-gray-700 border-gray-200",
    in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return classes[status] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

async function getAdminData(): Promise<AdminData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isMockMode = supabaseUrl.includes("placeholder") || supabaseUrl === "";

  if (isMockMode) {
    const role = await getMockRole();
    if (!role) redirect("/auth/login");
    if (role !== "admin") redirect("/dashboard");
    return { ...MOCK_DATA, securityEvents: getSecurityEvents() };
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // The generated DB types can lag behind migrations during local setup.
  // Keep the admin gate typed at the boundary and let Supabase enforce RLS too.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const { data: profile } = (await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null };

  if (profile?.role !== "admin") redirect("/dashboard");

  const [usersRes, projectsRes, applicationsRes, eventsRes] = await Promise.all(
    [
      db
        .from("profiles")
        .select("id,email,full_name,role,created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      db
        .from("projects")
        .select("id,title,status,budget_min,budget_max,client_id,created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      db
        .from("applications")
        .select("id,status,proposed_budget,project_id,applicant_id,created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      db
        .from("analytics_events")
        .select("event,user_id,created_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ],
  );

  return {
    users: (usersRes.data ?? []) as AdminUser[],
    projects: (projectsRes.data ?? []) as AdminProject[],
    applications: (applicationsRes.data ?? []) as AdminApplication[],
    events: (eventsRes.data ?? []) as AdminEvent[],
    securityEvents: getSecurityEvents(),
  };
}

// ── Server action — resolve a security event ─────────────────────────────
async function resolveEventAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (id) resolveSecurityEvent(id);
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const language = await getLanguage();
  const copy = COPY[language];
  const data = await getAdminData();

  const pendingApplications = data.applications.filter(
    (item) => item.status === "pending",
  ).length;
  const adminUsers = data.users.filter((user) => user.role === "admin").length;

  const statCards = [
    {
      label: copy.users,
      value: data.users.length,
      icon: Users,
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: copy.projects,
      value: data.projects.length,
      icon: Briefcase,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: copy.applications,
      value: pendingApplications,
      icon: ClipboardList,
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: copy.analytics,
      value: data.events.length,
      icon: Activity,
      accent: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  {copy.secureArea}
                </div>
                <h1 className="text-3xl font-extrabold tracking-normal">
                  {copy.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  {copy.subtitle}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  RLS actif
                </div>
                <p className="mt-1 text-xs text-emerald-100/80">
                  Lecture admin vérifiée par rôle.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, accent, bg }) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${accent}`} />
                </div>
                <p className="text-2xl font-extrabold text-slate-950">
                  {value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-red-600" />
                <h2 className="text-sm font-bold text-slate-950">
                  {copy.controls}
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span>Admins actifs</span>
                  <strong className="text-slate-950">{adminUsers}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span>RLS policies</span>
                  <strong className="text-emerald-700">ON</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span>Service role</span>
                  <strong className="text-slate-950">Serveur</strong>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-950">
                  {copy.riskCenter}
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                  {pendingApplications} candidature(s) en attente de revue.
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  {
                    data.projects.filter(
                      (project) => project.status === "draft",
                    ).length
                  }{" "}
                  projet(s) en brouillon.
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-950">
                  {copy.roles}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["admin", "mentor", "client", "student", "learner"].map(
                  (role) => (
                    <span
                      key={role}
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadge(role)}`}
                    >
                      {role}
                    </span>
                  ),
                )}
              </div>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <TableHeader icon={Users} title={copy.recentUsers} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.name}
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.email}
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.role}
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.date}
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.users.length === 0 ? (
                    <EmptyRow colSpan={5} label={copy.empty} />
                  ) : (
                    data.users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-semibold text-slate-950">
                          {user.full_name ?? "Sans nom"}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {user.email}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${roleBadge(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-400">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <Link
                            href={`/profile/${user.full_name?.toLowerCase().replaceAll(" ", "-") ?? user.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {copy.view}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <TableHeader icon={Briefcase} title={copy.recentProjects} />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.project}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.status}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.budget}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.projects.length === 0 ? (
                      <EmptyRow colSpan={3} label={copy.empty} />
                    ) : (
                      data.projects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-semibold text-slate-950">
                            <Link
                              href={`/projects/${project.id}`}
                              className="hover:text-brand-600 hover:underline"
                            >
                              {project.title}
                            </Link>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-500">
                            {project.budget_min}-{project.budget_max} EUR
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <TableHeader
                icon={ClipboardList}
                title={copy.recentApplications}
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.applicant}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.status}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.budget}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.applications.length === 0 ? (
                      <EmptyRow colSpan={3} label={copy.empty} />
                    ) : (
                      data.applications.map((application) => (
                        <tr key={application.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-mono text-xs text-slate-500">
                            {application.applicant_id.slice(0, 8)}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(application.status)}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-500">
                            {application.proposed_budget} EUR
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <TableHeader icon={Award} title={copy.recentEvents} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.event}
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      User ID
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      {copy.date}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.events.length === 0 ? (
                    <EmptyRow colSpan={3} label={copy.empty} />
                  ) : (
                    data.events.slice(0, 8).map((event, index) => (
                      <tr
                        key={`${event.event}-${event.created_at}-${index}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 font-semibold text-slate-950">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            {event.event}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">
                          {event.user_id?.slice(0, 8) ?? "anonymous"}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-400">
                          {formatDate(event.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {/* ── Security Dashboard ── */}
          <section className="mt-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  {copy.securityTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {copy.securitySubtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    {
                      label: copy.securityCritical,
                      count: data.securityEvents.filter(
                        (e) => e.severity === "critical" && !e.resolved,
                      ).length,
                      color: "bg-red-50 text-red-700 border-red-200",
                    },
                    {
                      label: copy.securityHigh,
                      count: data.securityEvents.filter(
                        (e) => e.severity === "high" && !e.resolved,
                      ).length,
                      color: "bg-orange-50 text-orange-700 border-orange-200",
                    },
                    {
                      label: copy.securityMedium,
                      count: data.securityEvents.filter(
                        (e) => e.severity === "medium" && !e.resolved,
                      ).length,
                      color: "bg-amber-50 text-amber-700 border-amber-200",
                    },
                  ] as const
                ).map(
                  ({ label, count, color }) =>
                    count > 0 && (
                      <span
                        key={label}
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${color}`}
                      >
                        {count} {label}
                      </span>
                    ),
                )}
              </div>
            </div>

            {/* Stats rapides */}
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  {
                    label: copy.securityThreats,
                    value: data.securityEvents.filter((e) => !e.resolved)
                      .length,
                    icon: FlameKindling,
                    color: "text-red-600",
                    bg: "bg-red-50",
                  },
                  {
                    label: copy.securityResolved,
                    value: data.securityEvents.filter((e) => e.resolved).length,
                    icon: CheckCircle2,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "IPs uniques",
                    value: new Set(data.securityEvents.map((e) => e.ip)).size,
                    icon: Globe,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Tokens invalides",
                    value: data.securityEvents.filter(
                      (e) => e.type === "invalid_token",
                    ).length,
                    icon: KeyRound,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                ] as const
              ).map(({ label, value, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-950">
                      {value}
                    </p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table des incidents */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Zap className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-950">
                  Incidents de sécurité
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.securitySeverity}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.securityType}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.securityIp}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.securityDesc}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.securityUser}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.date}
                      </th>
                      <th className="px-5 py-3 text-left font-semibold">
                        {copy.securityStatus}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.securityEvents.map((ev) => {
                      const severityClass: Record<string, string> = {
                        critical: "bg-red-50 text-red-700 border-red-200",
                        high: "bg-orange-50 text-orange-700 border-orange-200",
                        medium: "bg-amber-50 text-amber-700 border-amber-200",
                        low: "bg-slate-50 text-slate-600 border-slate-200",
                      };
                      const typeLabel: Record<string, string> = {
                        brute_force: "Brute force",
                        suspicious_ip: "🌍 IP suspecte",
                        role_escalation: "⬆️ Escalade rôle",
                        mass_request: "FAST Mass request",
                        invalid_token: "🔑 Token invalide",
                        scraping: "🕷️ Scraping",
                      };
                      return (
                        <tr
                          key={ev.id}
                          className={`hover:bg-slate-50 ${ev.resolved ? "opacity-60" : ""}`}
                        >
                          <td className="px-5 py-3">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-bold ${severityClass[ev.severity]}`}
                            >
                              {
                                copy[
                                  `security${ev.severity.charAt(0).toUpperCase() + ev.severity.slice(1)}` as keyof typeof copy
                                ]
                              }
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs font-medium text-slate-700">
                            {typeLabel[ev.type]}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-500">
                            {ev.ip}
                          </td>
                          <td className="px-5 py-3 max-w-xs text-xs text-slate-600">
                            {ev.description}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-400">
                            {ev.user_id?.slice(0, 10) ?? "anonyme"}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-400">
                            {formatDate(ev.created_at)}
                          </td>
                          <td className="px-5 py-3">
                            {ev.resolved ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                                {copy.securityResolvedLabel}
                              </span>
                            ) : (
                              <form
                                action={resolveEventAction}
                                className="inline"
                              >
                                <input type="hidden" name="id" value={ev.id} />
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  {copy.securityOpen}
                                </button>
                              </form>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TableHeader({
  icon: Icon,
  title,
}: Readonly<{ icon: typeof Users; title: string }>) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
      <Icon className="h-4 w-4 text-brand-600" />
      <h2 className="text-sm font-bold text-slate-950">{title}</h2>
    </div>
  );
}

function EmptyRow({
  colSpan,
  label,
}: Readonly<{ colSpan: number; label: string }>) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-8 text-center text-sm text-slate-400"
      >
        {label}
      </td>
    </tr>
  );
}
