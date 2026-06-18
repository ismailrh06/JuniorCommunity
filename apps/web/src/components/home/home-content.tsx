"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Monitor,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  type LucideProps,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

type IconComponent = ComponentType<LucideProps>;

const LEARN_FEATURES: Record<Language, string[]> = {
  fr: [
    "Parcours par niveaux, pas une liste de vidéos",
    "Exercices courts avec livrables vérifiables",
    "Portfolio construit au fil des modules",
    "Accès missions selon les compétences validées",
  ],
  en: [
    "Level-based path, not a video playlist",
    "Short exercises with verifiable outputs",
    "Portfolio built throughout the modules",
    "Mission access based on validated skills",
  ],
  es: [
    "Ruta por niveles, no una lista de videos",
    "Ejercicios cortos con entregables verificables",
    "Portfolio construido durante los módulos",
    "Acceso a misiones según habilidades validadas",
  ],
};

const MARKETPLACE_FEATURES: Record<Language, string[]> = {
  fr: [
    "Briefs cadrés pour juniors",
    "Budget, durée et prérequis visibles",
    "Candidatures guidées et traçables",
    "Historique de progression lié au profil",
  ],
  en: [
    "Junior-scoped briefs",
    "Visible budget, duration and requirements",
    "Guided, traceable applications",
    "Progress history attached to the profile",
  ],
  es: [
    "Briefs acotados para juniors",
    "Presupuesto, duración y requisitos visibles",
    "Postulaciones guiadas y trazables",
    "Historial de progreso ligado al perfil",
  ],
};

const BETA_STATS: Record<Language, [string, string, string, string]> = {
  fr: ["BETA-01", "5 niveaux", "12 missions", "Profil vérifiable"],
  en: ["BETA-01", "5 levels", "12 missions", "Verified profile"],
  es: ["BETA-01", "5 niveles", "12 misiones", "Perfil verificable"],
};

const TRACK_ITEMS = [
  { code: "HTML-01", label: "Structure responsive", status: "Validé", score: 100 },
  { code: "CSS-02", label: "Interface dashboard", status: "Review", score: 72 },
  { code: "JS-03", label: "State and forms", status: "Next", score: 38 },
  { code: "APP-04", label: "Client project", status: "Locked", score: 14 },
];

const MISSION_ROWS = [
  {
    role: "Landing page cleanup",
    budget: "120-180 EUR",
    level: "L2",
    state: "Open",
  },
  {
    role: "React bugfix sprint",
    budget: "220-300 EUR",
    level: "L3",
    state: "Review",
  },
  {
    role: "Analytics dashboard",
    budget: "350-500 EUR",
    level: "L4",
    state: "Locked",
  },
];

const JOURNEY_ICONS = [BookOpen, Code2, ShieldCheck, Briefcase];

const fadeUp = {
  hidden: { opacity: 1, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function HomeContent() {
  const { language, messages } = useI18n();
  const m = messages.home;
  const betaStats = BETA_STATS[language];
  const reduceMotion = useReducedMotion();

  const viewport = { once: true, margin: "-80px" };
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  const statItems = [
    { label: m.stats.learners, value: betaStats[0], icon: Users },
    { label: m.stats.projects, value: betaStats[1], icon: BookOpen },
    { label: m.stats.hired, value: betaStats[2], icon: Briefcase },
    { label: m.stats.clients, value: betaStats[3], icon: Trophy },
  ] as const;

  return (
    <main className="overflow-hidden bg-[#070a10] text-slate-100">
      <section className="relative border-b border-white/10 px-4 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.18),transparent_31%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.14),transparent_28%),linear-gradient(180deg,#0a1019_0%,#070a10_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.96fr] lg:items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            transition={transition}
          >
            <motion.div
              variants={fadeUp}
              transition={transition}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
              {m.waitlist}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={transition}
              className="max-w-3xl text-4xl font-semibold leading-[1.03] text-white sm:text-5xl lg:text-6xl"
            >
              {m.titlePrefix}{" "}
              <span className="bg-gradient-to-r from-emerald-200 via-cyan-100 to-slate-50 bg-clip-text text-transparent">
                {m.titleGradient}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={transition}
              className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
            >
              {m.subtitle}
            </motion.p>
            <motion.p
              variants={fadeUp}
              transition={transition}
              className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              {m.subtitleStrong}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={transition}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <PremiumLink href="/learn" tone="solid">
                <BookOpen className="h-4 w-4" />
                {m.ctaLearn}
              </PremiumLink>
              <PremiumLink href="/marketplace" tone="ghost">
                <Briefcase className="h-4 w-4" />
                {m.ctaMarketplace}
              </PremiumLink>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {statItems.map(({ label, value, icon: Icon }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  transition={transition}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="rounded-[8px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur"
                >
                  <Icon className="mb-4 h-4 w-4 text-emerald-200" />
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <HeroWorkspace reduceMotion={reduceMotion} />
        </div>
      </section>

      <AnimatedSection className="border-b border-white/10 bg-[#080d14] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionEyebrow>{m.platformTag}</SectionEyebrow>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                {m.ecosystemTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              {m.ecosystemDesc}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PlatformPanel
              icon={BookOpen}
              eyebrow="Learn track"
              title={m.learnTitle}
              description={m.learnDesc}
              features={LEARN_FEATURES[language]}
              href="/learn"
              cta={m.learnCta}
            />
            <PlatformPanel
              icon={Briefcase}
              eyebrow="Mission track"
              title={m.marketTitle}
              description={m.marketDesc}
              features={MARKETPLACE_FEATURES[language]}
              href="/marketplace"
              cta={m.marketCta}
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="relative border-b border-white/10 bg-[#070a10] px-4 py-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <SectionEyebrow>Workflow</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {m.journeyTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              {m.journeyDesc}
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {m.journeySteps.map((step, idx) => {
              const Icon = JOURNEY_ICONS[idx] ?? CheckCircle2;
              return (
                <MotionCard key={step.step} delay={idx * 0.03}>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06]">
                      <Icon className="h-5 w-5 text-cyan-100" />
                    </div>
                    <span className="font-mono text-xs text-slate-600">
                      0{step.step}
                    </span>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    {step.tag}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.desc}
                  </p>
                </MotionCard>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-white/10 bg-[#080d14] px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionEyebrow>Credential layer</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {m.badgeProofTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              {m.badgeProofDesc}
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-4 sm:grid-cols-3"
          >
            {m.badgeProofItems.map((badge, index) => (
              <MotionCard key={badge.title} delay={index * 0.04}>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] border border-emerald-300/20 bg-emerald-300/[0.08] font-mono text-xs font-semibold text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                  {["WD", "RE", "DA"][index] ?? "JC"}
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {badge.title}
                </h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
                  {badge.proof}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  Public profile proof
                </div>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#070a10] px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_auto]">
          <div className="rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:p-8">
            <SectionEyebrow>Start point</SectionEyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
              {m.finalTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              {m.finalDesc}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur sm:min-w-80 sm:p-8">
            <PremiumLink href="/auth/register" tone="solid">
              {m.finalCta}
              <ArrowRight className="h-4 w-4" />
            </PremiumLink>
            <PremiumLink href="/marketplace" tone="ghost">
              View mission board
            </PremiumLink>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}

function HeroWorkspace({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] blur-sm"
      />
      <div className="relative overflow-hidden rounded-[8px] border border-white/12 bg-[#0d131d]/90 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(16,185,129,0.14),transparent_34%)]" />
        <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            <Terminal className="h-4 w-4 text-emerald-200" />
            Junior workspace
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-700" />
            <span className="h-2 w-2 rounded-full bg-slate-600" />
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
          </div>
        </div>

        <div className="relative grid gap-px bg-white/10 md:grid-cols-[0.92fr_1.08fr]">
          <div className="bg-[#0e1520]/95 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Current path
            </p>
            <div className="space-y-3">
              {TRACK_ITEMS.map((item, index) => (
                <motion.div
                  key={item.code}
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.18 + index * 0.08,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-[8px] border border-white/10 bg-white/[0.045] p-3"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-emerald-200">
                        {item.code}
                      </p>
                      <p className="mt-1 text-sm text-slate-200">
                        {item.label}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
                      {item.status}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={reduceMotion ? false : { width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{
                        delay: 0.34 + index * 0.08,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-200"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-[#0b111a]/95 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Mission queue
              </p>
              <span className="font-mono text-xs text-slate-500">
                level_gate: on
              </span>
            </div>
            <div className="space-y-2">
              {MISSION_ROWS.map((mission, index) => (
                <motion.div
                  key={mission.role}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.22 + index * 0.08,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-white/10 bg-white/[0.045] p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {mission.role}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {mission.budget} · {mission.level}
                    </p>
                  </div>
                  <span className="self-start rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
                    {mission.state}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-5 rounded-[8px] border border-emerald-300/15 bg-slate-950/70 p-4 font-mono text-xs leading-6 text-slate-400"
            >
              <p>
                <span className="text-emerald-200">$</span> verify profile
                --skills
              </p>
              <p className="text-slate-500">checks: html, css, git, deploy</p>
              <p className="text-emerald-200">status: eligible_for_L2</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedSection({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { y: 22 }}
      whileInView={reduceMotion ? undefined : { y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

function MotionCard({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -5,
              borderColor: "rgba(110, 231, 183, 0.35)",
              backgroundColor: "rgba(255, 255, 255, 0.075)",
            }
      }
      className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.2)] backdrop-blur"
    >
      {children}
    </motion.div>
  );
}

function PremiumLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "solid" | "ghost";
  children: ReactNode;
}) {
  const base =
    "group inline-flex h-11 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-semibold transition duration-200";
  const styles =
    tone === "solid"
      ? "bg-gradient-to-r from-emerald-300 to-cyan-200 text-slate-950 shadow-[0_14px_45px_rgba(16,185,129,0.25)] hover:shadow-[0_18px_55px_rgba(34,211,238,0.22)]"
      : "border border-white/12 bg-white/[0.055] text-slate-100 hover:border-white/25 hover:bg-white/[0.09]";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

function PlatformPanel({
  icon: Icon,
  eyebrow,
  title,
  description,
  features,
  href,
  cta,
}: {
  icon: IconComponent;
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  cta: string;
}) {
  return (
    <MotionCard>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06]">
            <Icon className="h-5 w-5 text-emerald-200" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {eyebrow}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
          </div>
        </div>
        <Monitor className="hidden h-5 w-5 text-slate-600 sm:block" />
      </div>

      <p className="text-sm leading-6 text-slate-400">{description}</p>

      <div className="mt-6 grid gap-2">
        {features.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
            <span className="text-slate-300">{item}</span>
          </div>
        ))}
      </div>

      <Link
        href={href}
        className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-cyan-100"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </MotionCard>
  );
}
