"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Goal = "learn" | "mission" | "portfolio";
export type Level = "beginner" | "some" | "experienced";
export type PathSlug = "web-developer" | "ui-designer" | "data-analyst" | "algorithms";

export type OnboardingData = {
  goal: Goal;
  level: Level;
  path: PathSlug;
  completedAt: string;
};

// ─── Cookie helpers ───────────────────────────────────────────────────────────
function saveOnboarding(data: OnboardingData): void {
  const encoded = btoa(JSON.stringify(data));
  document.cookie = `jc-onboarding=${encoded}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

// ─── Copy ─────────────────────────────────────────────────────────────────────
const COPY: Record<Language, {
  stepLabel: (current: number, total: number) => string;
  back: string;
  next: string;
  skip: string;

  // Step 1
  step1Title: string;
  step1Subtitle: string;
  goals: Array<{ id: Goal; emoji: string; title: string; desc: string }>;

  // Step 2
  step2Title: string;
  step2Subtitle: string;
  levels: Array<{ id: Level; emoji: string; title: string; desc: string }>;

  // Step 3
  step3Title: string;
  step3Subtitle: string;
  paths: Array<{ id: PathSlug; emoji: string; title: string; desc: string; duration: string }>;

  // Step 4
  step4Title: (name: string) => string;
  step4Subtitle: string;
  step4Cta: string;
  step4Skip: string;
  summaryGoal: string;
  summaryLevel: string;
  summaryPath: string;
}> = {
  fr: {
    stepLabel: (c, t) => `Étape ${c} sur ${t}`,
    back: "Retour",
    next: "Continuer",
    skip: "Passer",

    step1Title: "Quel est ton objectif ?",
    step1Subtitle: "On va personnaliser ton expérience en fonction de où tu veux aller.",
    goals: [
      { id: "learn", emoji: "📚", title: "Apprendre une compétence", desc: "Je veux maîtriser le développement web, le design ou la data." },
      { id: "mission", emoji: "💼", title: "Trouver une première mission", desc: "Je veux décrocher un projet réel rémunéré rapidement." },
      { id: "portfolio", emoji: "🎨", title: "Construire mon portfolio", desc: "Je veux avoir des projets concrets à montrer à des recruteurs." },
    ],

    step2Title: "Où en es-tu actuellement ?",
    step2Subtitle: "Honnêteté totale — il n'y a pas de mauvaise réponse.",
    levels: [
      { id: "beginner", emoji: "🌱", title: "Débutant complet", desc: "Je n'ai jamais codé ou presque. Tout est nouveau pour moi." },
      { id: "some", emoji: "🌿", title: "Quelques bases", desc: "J'ai vu du HTML/CSS, quelques tutos vidéo, mais sans projets finis." },
      { id: "experienced", emoji: "🌳", title: "J'ai déjà des projets", desc: "J'ai livré des choses, j'ai un GitHub, je cherche à progresser." },
    ],

    step3Title: "Quel parcours tu veux suivre ?",
    step3Subtitle: "Tu pourras en changer plus tard depuis ton dashboard.",
    paths: [
      { id: "web-developer", emoji: "💻", title: "Développeur Web", desc: "HTML, CSS, JavaScript, React. De zéro à ton premier projet live.", duration: "6–8 semaines" },
      { id: "ui-designer", emoji: "🎨", title: "Designer UI", desc: "Figma, principes design, maquettes et design systems.", duration: "4–6 semaines" },
      { id: "data-analyst", emoji: "📊", title: "Data Analyst", desc: "Python, Pandas, SQL et dashboards interactifs.", duration: "6–8 semaines" },
      { id: "algorithms", emoji: "🧠", title: "Algorithmique", desc: "Big O, structures de données, logique et résolution de problèmes.", duration: "4–5 semaines" },
    ],

    step4Title: (name) => `Tu es prêt, ${name} 🎉`,
    step4Subtitle: "Voici ton plan personnalisé. On t'a configuré un dashboard adapté à tes objectifs.",
    step4Cta: "Accéder à mon dashboard",
    step4Skip: "Voir la marketplace",
    summaryGoal: "Objectif",
    summaryLevel: "Niveau",
    summaryPath: "Parcours choisi",
  },
  en: {
    stepLabel: (c, t) => `Step ${c} of ${t}`,
    back: "Back",
    next: "Continue",
    skip: "Skip",

    step1Title: "What's your goal?",
    step1Subtitle: "We'll personalize your experience based on where you want to go.",
    goals: [
      { id: "learn", emoji: "📚", title: "Learn a new skill", desc: "I want to master web development, design or data." },
      { id: "mission", emoji: "💼", title: "Find my first mission", desc: "I want to land a real paid project quickly." },
      { id: "portfolio", emoji: "🎨", title: "Build my portfolio", desc: "I want concrete projects to show recruiters." },
    ],

    step2Title: "Where are you right now?",
    step2Subtitle: "Be honest — there's no wrong answer.",
    levels: [
      { id: "beginner", emoji: "🌱", title: "Complete beginner", desc: "I've never coded or barely. Everything is new to me." },
      { id: "some", emoji: "🌿", title: "Some basics", desc: "I've seen some HTML/CSS, a few video tutorials, but no finished projects." },
      { id: "experienced", emoji: "🌳", title: "I have projects", desc: "I've shipped things, I have a GitHub, I'm looking to level up." },
    ],

    step3Title: "Which path do you want to follow?",
    step3Subtitle: "You can change it later from your dashboard.",
    paths: [
      { id: "web-developer", emoji: "💻", title: "Web Developer", desc: "HTML, CSS, JavaScript, React. From zero to your first live project.", duration: "6–8 weeks" },
      { id: "ui-designer", emoji: "🎨", title: "UI Designer", desc: "Figma, design principles, wireframes and design systems.", duration: "4–6 weeks" },
      { id: "data-analyst", emoji: "📊", title: "Data Analyst", desc: "Python, Pandas, SQL and interactive dashboards.", duration: "6–8 weeks" },
      { id: "algorithms", emoji: "🧠", title: "Algorithms", desc: "Big O, data structures, logic and problem-solving.", duration: "4–5 weeks" },
    ],

    step4Title: (name) => `You're all set, ${name} 🎉`,
    step4Subtitle: "Here's your personalized plan. We've set up a dashboard tailored to your goals.",
    step4Cta: "Go to my dashboard",
    step4Skip: "Browse marketplace",
    summaryGoal: "Goal",
    summaryLevel: "Level",
    summaryPath: "Chosen path",
  },
  es: {
    stepLabel: (c, t) => `Paso ${c} de ${t}`,
    back: "Volver",
    next: "Continuar",
    skip: "Saltar",

    step1Title: "¿Cuál es tu objetivo?",
    step1Subtitle: "Personalizaremos tu experiencia según a dónde quieres llegar.",
    goals: [
      { id: "learn", emoji: "📚", title: "Aprender una habilidad", desc: "Quiero dominar el desarrollo web, diseño o datos." },
      { id: "mission", emoji: "💼", title: "Encontrar mi primera misión", desc: "Quiero conseguir un proyecto real pagado rápidamente." },
      { id: "portfolio", emoji: "🎨", title: "Construir mi portfolio", desc: "Quiero proyectos concretos para mostrar a reclutadores." },
    ],

    step2Title: "¿Dónde estás ahora mismo?",
    step2Subtitle: "Sé honesto — no hay respuesta incorrecta.",
    levels: [
      { id: "beginner", emoji: "🌱", title: "Principiante completo", desc: "Nunca he programado o casi. Todo es nuevo para mí." },
      { id: "some", emoji: "🌿", title: "Algunas bases", desc: "He visto algo de HTML/CSS, algunos tutoriales, pero sin proyectos terminados." },
      { id: "experienced", emoji: "🌳", title: "Tengo proyectos", desc: "He entregado cosas, tengo GitHub y busco mejorar." },
    ],

    step3Title: "¿Qué ruta quieres seguir?",
    step3Subtitle: "Puedes cambiarlo más tarde desde tu panel.",
    paths: [
      { id: "web-developer", emoji: "💻", title: "Desarrollador Web", desc: "HTML, CSS, JavaScript, React. De cero a tu primer proyecto.", duration: "6–8 semanas" },
      { id: "ui-designer", emoji: "🎨", title: "Diseñador UI", desc: "Figma, principios de diseño, wireframes y design systems.", duration: "4–6 semanas" },
      { id: "data-analyst", emoji: "📊", title: "Analista de Datos", desc: "Python, Pandas, SQL y dashboards interactivos.", duration: "6–8 semanas" },
      { id: "algorithms", emoji: "🧠", title: "Algoritmia", desc: "Big O, estructuras de datos, lógica y resolución de problemas.", duration: "4–5 semanas" },
    ],

    step4Title: (name) => `¡Todo listo, ${name}! 🎉`,
    step4Subtitle: "Aquí está tu plan personalizado. Hemos configurado un panel adaptado a tus objetivos.",
    step4Cta: "Ir a mi panel",
    step4Skip: "Ver el marketplace",
    summaryGoal: "Objetivo",
    summaryLevel: "Nivel",
    summaryPath: "Ruta elegida",
  },
};

// ─── Goal/level labels (for the summary) ─────────────────────────────────────
function getGoalLabel(id: Goal, copy: (typeof COPY)[Language]) {
  return copy.goals.find((g) => g.id === id)?.title ?? id;
}
function getLevelLabel(id: Level, copy: (typeof COPY)[Language]) {
  return copy.levels.find((l) => l.id === id)?.title ?? id;
}
function getPathLabel(id: PathSlug, copy: (typeof COPY)[Language]) {
  return copy.paths.find((p) => p.id === id)?.title ?? id;
}

// ─── Selection card ───────────────────────────────────────────────────────────
function SelectCard({
  emoji,
  title,
  desc,
  selected,
  onClick,
  index = 0,
}: Readonly<{
  emoji: string;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
}>) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
        selected
          ? "border-brand-300 bg-brand-500/15 shadow-2xl shadow-brand-500/15"
          : "border-white/15 bg-white/[0.045] hover:border-white/30 hover:bg-white/[0.08]"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold">{title}</span>
            {selected && (
              <CheckCircle className="h-5 w-5 shrink-0 text-brand-400" />
            )}
          </div>
          <p className="mt-1 text-sm text-white/60">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: Readonly<{ current: number; total: number }>) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-1 w-full rounded-full bg-white/10">
      <motion.div
        className="h-1 rounded-full bg-gradient-to-r from-brand-400 to-learn-400 transition-all duration-500"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

const stepVariants = {
  enter: { opacity: 0, y: 20, filter: "blur(8px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(8px)" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { language } = useI18n();
  const copy = COPY[language];
  const router = useRouter();

  const TOTAL_STEPS = 4;
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [path, setPath] = useState<PathSlug | null>(null);

  // Read user name from cookie (set during register)
  const firstName = (() => {
    if (typeof document === "undefined") return "toi";
    const match = /(?:^|; )jc-mock-user=([^;]*)/.exec(document.cookie);
    if (!match) return "toi";
    try {
      const user = JSON.parse(atob(match[1])) as { full_name: string };
      return user.full_name.split(" ")[0] ?? "toi";
    } catch { return "toi"; }
  })();

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const finish = async () => {
    if (!goal || !level || !path) return;
    const data: OnboardingData = { goal, level, path, completedAt: new Date().toISOString() };
    saveOnboarding(data);

    // Persist to DB (no-op in mock mode, saves to learner_profiles in real mode)
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level, path }),
      });
    } catch {
      // Non-blocking — cookie is already saved
    }

    router.push("/dashboard");
  };

  const canContinue =
    (step === 1 && goal !== null) ||
    (step === 2 && level !== null) ||
    (step === 3 && path !== null) ||
    step === 4;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] text-white flex flex-col">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[-18rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.78, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-16rem] right-[-12rem] h-[34rem] w-[34rem] rounded-full bg-orange-500/20 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, 18, 0], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#070b16]/80 backdrop-blur-xl px-4 py-4">
        <div className="mx-auto max-w-xl">
          <div className="mb-3 flex items-center justify-between text-xs text-white/50">
            <Link href="/" className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="relative h-8 w-8 overflow-hidden rounded-xl border border-white/15 bg-slate-950 shadow-lg shadow-brand-500/20">
                <Image
                  src="/brand/logo-mark.png"
                  alt="JuniorCode"
                  fill
                  sizes="32px"
                  priority
                  className="object-cover scale-[2.45]"
                />
              </span>
              {" JuniorCode"}
            </Link>
            <span>{copy.stepLabel(step, TOTAL_STEPS)}</span>
          </div>
          <ProgressBar current={step} total={TOTAL_STEPS} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Step 1 — Goal ── */}
              {step === 1 && (
                <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black sm:text-3xl">{copy.step1Title}</h1>
                <p className="mt-2 text-white/65">{copy.step1Subtitle}</p>
              </div>
              <div className="space-y-3">
                {copy.goals.map((g, index) => (
                  <SelectCard
                    key={g.id}
                    emoji={g.emoji}
                    title={g.title}
                    desc={g.desc}
                    selected={goal === g.id}
                    onClick={() => { setGoal(g.id); }}
                    index={index}
                  />
                ))}
              </div>
                </div>
              )}

              {/* ── Step 2 — Level ── */}
              {step === 2 && (
                <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black sm:text-3xl">{copy.step2Title}</h1>
                <p className="mt-2 text-white/65">{copy.step2Subtitle}</p>
              </div>
              <div className="space-y-3">
                {copy.levels.map((l, index) => (
                  <SelectCard
                    key={l.id}
                    emoji={l.emoji}
                    title={l.title}
                    desc={l.desc}
                    selected={level === l.id}
                    onClick={() => { setLevel(l.id); }}
                    index={index}
                  />
                ))}
              </div>
                </div>
              )}

              {/* ── Step 3 — Path ── */}
              {step === 3 && (
                <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black sm:text-3xl">{copy.step3Title}</h1>
                <p className="mt-2 text-white/65">{copy.step3Subtitle}</p>
              </div>
              <div className="space-y-3">
                {copy.paths.map((p, index) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => setPath(p.id)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left rounded-2xl border p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                      path === p.id
                        ? "border-brand-300 bg-brand-500/15 shadow-2xl shadow-brand-500/15"
                        : "border-white/15 bg-white/[0.045] hover:border-white/30 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl shrink-0">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{p.title}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">
                              {p.duration}
                            </span>
                            {path === p.id && (
                              <CheckCircle className="h-5 w-5 text-brand-400" />
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-white/60">{p.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
                </div>
              )}

              {/* ── Step 4 — Summary & Launch ── */}
              {step === 4 && (
                <div className="space-y-8">
              <div className="text-center">
                <motion.div
                  className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-learn-500 text-4xl shadow-2xl shadow-brand-500/30"
                  animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🚀
                </motion.div>
                <h1 className="text-2xl font-black sm:text-3xl">{copy.step4Title(firstName)}</h1>
                <p className="mt-2 text-white/65">{copy.step4Subtitle}</p>
              </div>

              {/* Summary card */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] divide-y divide-white/10">
                {goal && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-white/55">{copy.summaryGoal}</span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {copy.goals.find((g) => g.id === goal)?.emoji}
                      {getGoalLabel(goal, copy)}
                    </span>
                  </div>
                )}
                {level && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-white/55">{copy.summaryLevel}</span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {copy.levels.find((l) => l.id === level)?.emoji}
                      {getLevelLabel(level, copy)}
                    </span>
                  </div>
                )}
                {path && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-white/55">{copy.summaryPath}</span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {copy.paths.find((p) => p.id === path)?.emoji}
                      {getPathLabel(path, copy)}
                    </span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <motion.button
                  type="button"
                  onClick={finish}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 font-semibold text-white shadow-2xl shadow-brand-500/30 transition hover:-translate-y-0.5 hover:from-brand-400 hover:to-brand-500"
                >
                  {copy.step4Cta}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <button
                  type="button"
                  onClick={() => router.push("/marketplace")}
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.04] py-3 text-sm text-white/65 transition hover:bg-white/[0.08]"
                >
                  {copy.step4Skip}
                </button>
              </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ── */}
          {step < 4 && (
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {copy.back}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.next}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Back button on step 4 */}
          {step === 4 && (
            <button
              type="button"
              onClick={goBack}
              className="mt-4 flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white/70 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.back}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
