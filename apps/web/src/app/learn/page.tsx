import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowRight,
  BadgeCheck,
  Code2,
  Flame,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";
import {
  DailyChallenge,
  LearningProgressSync,
  MissionCard,
  ProgressRadar,
  QuestTimeline,
  SkillTree,
  StreakCounter,
  UnlockAnimation,
  XPBar,
  type MissionCardData,
} from "@/components/learn/gamified-learning";

const COPY: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    continue: string;
    missions: string;
    dashboard: string;
    paths: string;
    skillTree: string;
    timeline: string;
  }
> = {
  fr: {
    eyebrow: "JuniorCode Learn",
    title: "Apprends en construisant, une mission à la fois.",
    subtitle:
      "Des défis courts, du code vivant, des récompenses visibles et des projets que tu peux montrer.",
    continue: "Continuer la mission",
    missions: "Missions recommandées",
    dashboard: "Tableau de bord",
    paths: "Choisir une aventure",
    skillTree: "Arbre de compétences",
    timeline: "Quête de la semaine",
  },
  en: {
    eyebrow: "JuniorCode Learn",
    title: "Learn by building, one mission at a time.",
    subtitle:
      "Short challenges, live code, visible rewards, and projects you can actually show.",
    continue: "Continue mission",
    missions: "Recommended missions",
    dashboard: "Dashboard",
    paths: "Choose an adventure",
    skillTree: "Skill tree",
    timeline: "Weekly quest",
  },
  es: {
    eyebrow: "JuniorCode Learn",
    title: "Aprende construyendo, una misión a la vez.",
    subtitle:
      "Retos cortos, código vivo, recompensas visibles y proyectos que puedes mostrar.",
    continue: "Continuar misión",
    missions: "Misiones recomendadas",
    dashboard: "Panel",
    paths: "Elegir aventura",
    skillTree: "Árbol de habilidades",
    timeline: "Quest semanal",
  },
};

const MISSIONS: MissionCardData[] = [
  {
    href: "/learn/web-developer/html-basics",
    title: "Mission 1 - Help the robot store page structure",
    intro: "Fix a tiny HTML control room and make the preview pass checks.",
    duration: "12 min",
    xp: 25,
    status: "active",
    tags: ["HTML", "Preview", "Micro task"],
    challenge: "Add lang, main, and an image alt before the timer runs out.",
    reward: "Start",
    tone: "green",
  },
  {
    href: "/learn/web-developer/css-basics",
    title: "Quest - Make the launch panel responsive",
    intro: "Turn a rigid layout into a clean mobile-first interface.",
    duration: "18 min",
    xp: 35,
    status: "active",
    tags: ["CSS", "Flexbox", "UI"],
    challenge: "Use gap, flex-wrap, and one hover state.",
    reward: "Play",
    tone: "blue",
  },
  {
    href: "/learn/web-developer/first-landing",
    title: "Build session - Ship your first landing page",
    intro: "Create a portfolio-ready mini project and unlock deployment.",
    duration: "45 min",
    xp: 90,
    status: "locked",
    tags: ["Project", "Deploy", "Portfolio"],
    challenge: "Complete 2 missions to unlock this build sprint.",
    reward: "Locked",
    tone: "violet",
  },
];

const PATHS = [
  {
    href: "/learn/web-developer",
    icon: "WEB",
    name: "Web Developer",
    result: "Portfolio, dashboard, auth, marketplace clone",
    progress: "42%",
  },
  {
    href: "/learn/ui-designer",
    icon: "UI",
    name: "UI Designer",
    result: "Mobile wireframe, design system, case study",
    progress: "18%",
  },
  {
    href: "/learn/data-analyst",
    icon: "DATA",
    name: "Data Analyst",
    result: "CSV analysis, SQL report, interactive dashboard",
    progress: "9%",
  },
  {
    href: "/learn/algorithms",
    icon: "ALG",
    name: "Algorithms",
    result: "Logic drills, interview patterns, challenge sprint",
    progress: "0%",
  },
];

export default async function LearnPage() {
  const cookieStore = await cookies();
  const languageCookie = cookieStore
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-[#060913] text-white">
      <LearningProgressSync />
      <Navbar />

      <main className="overflow-hidden">
        <section className="relative px-4 pb-10 pt-8 sm:pb-14 sm:pt-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[110px]" />
          <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/72 backdrop-blur">
                <Sparkles className="h-4 w-4 text-learn-200" />
                {copy.eyebrow}
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-normal sm:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/66 sm:text-lg">
                {copy.subtitle}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/learn/web-developer/html-basics"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-learn-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-learn-950/30 transition hover:bg-learn-400"
                >
                  <Rocket className="h-4 w-4" />
                  {copy.continue}
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/78 transition hover:bg-white/[0.1]"
                >
                  <Trophy className="h-4 w-4" />
                  {copy.dashboard}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <XPBar current={740} max={1000} level={7} />
              <StreakCounter days={3} />
              <DailyChallenge />
              <UnlockAnimation label="Build Session: Portfolio Lab" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">{copy.missions}</h2>
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/52">
                +150 XP available
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {MISSIONS.map((mission) => (
                <MissionCard key={mission.title} mission={mission} />
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <ProgressRadar
              values={[
                { label: "HTML/CSS", value: 68 },
                { label: "JavaScript", value: 31 },
                { label: "Projects", value: 44 },
                { label: "Deploy", value: 18 },
              ]}
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-200" />
                <h3 className="font-bold">{copy.timeline}</h3>
              </div>
              <QuestTimeline
                items={[
                  {
                    title: "Finish HTML robot mission",
                    meta: "+25 XP, unlock CSS quest",
                    status: "active",
                  },
                  {
                    title: "Build a responsive card",
                    meta: "+35 XP, badge progress",
                    status: "locked",
                  },
                  {
                    title: "Deploy one portfolio section",
                    meta: "Portfolio-ready proof",
                    status: "locked",
                  },
                ]}
              />
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-brand-200" />
            <h2 className="text-2xl font-black">{copy.paths}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PATHS.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] font-mono text-xs font-semibold text-emerald-200">
                    {path.icon}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/58">
                    {path.progress}
                  </span>
                </div>
                <h3 className="font-bold">{path.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-relaxed text-white/58">
                  {path.result}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-learn-300 to-brand-300"
                    style={{ width: path.progress }}
                  />
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-200">
                  Open path
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 pb-16">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-learn-200" />
            <h2 className="text-2xl font-black">{copy.skillTree}</h2>
          </div>
          <SkillTree
            skills={[
              { name: "Semantic HTML", status: "completed", xp: 100 },
              { name: "Responsive UI", status: "active", xp: 140 },
              { name: "DOM Events", status: "locked", xp: 180 },
              { name: "API Fetching", status: "locked", xp: 220 },
              { name: "Auth Flow", status: "locked", xp: 280 },
              { name: "Dashboard Build", status: "locked", xp: 320 },
              { name: "Marketplace Clone", status: "locked", xp: 420 },
              { name: "Client Delivery", status: "locked", xp: 500 },
            ]}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
