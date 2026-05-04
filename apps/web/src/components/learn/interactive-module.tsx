"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  ExternalLink,
  Flag,
  Hammer,
  Lightbulb,
  PlayCircle,
  Send,
  Sparkles,
  Target,
  TerminalSquare,
  Trophy,
  Zap,
} from "lucide-react";
import type { Language } from "@/lib/i18n/translations";

type ModuleType = "lesson" | "exercise" | "project";

type Step = {
  title: string;
  content: string;
  details?: string[];
  example?: string;
  code?: string;
  practice?: string;
  tip?: string;
};

export type InteractiveModuleContent = {
  id: string;
  title: string;
  duration: string;
  type: ModuleType;
  intro: string;
  objectives: string[];
  steps: Step[];
  resources?: { label: string; url: string }[];
};

type InteractiveModuleProps = {
  language: Language;
  module: InteractiveModuleContent;
  path: string;
  pathLabel: string;
  prevModule?: { id: string; title: string } | null;
  nextModule?: { id: string; title: string } | null;
};

const COPY: Record<
  Language,
  {
    room: string;
    missionBrief: string;
    tasks: string;
    task: string;
    understand: string;
    keyDetails: string;
    guidedExample: string;
    practice: string;
    lab: string;
    checkpoint: string;
    progress: string;
    completed: string;
    markDone: string;
    completedTask: string;
    answerPlaceholder: string;
    checkAnswer: string;
    correct: string;
    tryAgain: string;
    hint: string;
    playground: string;
    playgroundIntro: string;
    runChecks: string;
    resetLab: string;
    labPassed: string;
    labNeedsWork: string;
    applyPrompt: string;
    applyPlaceholder: string;
    submitReflection: string;
    reflectionSaved: string;
    objectives: string;
    resources: string;
    previous: string;
    next: string;
    backToPath: string;
    viewMissions: string;
    lesson: string;
    exercise: string;
    project: string;
    xp: string;
  }
> = {
  fr: {
    room: "Room",
    missionBrief: "Brief de mission",
    tasks: "Tâches",
    task: "Tâche",
    understand: "Comprendre",
    keyDetails: "Les détails à retenir",
    guidedExample: "Exemple guidé",
    practice: "À toi de pratiquer",
    lab: "Mini-lab",
    checkpoint: "Checkpoint",
    progress: "Progression",
    completed: "terminé",
    markDone: "Valider la tâche",
    completedTask: "Tâche validée",
    answerPlaceholder: "Tape ta réponse...",
    checkAnswer: "Vérifier",
    correct: "Correct. Bien joué.",
    tryAgain: "Pas encore. Relis l'indice et retente.",
    hint: "Indice",
    playground: "Playground",
    playgroundIntro: "Modifie le code, puis lance les checks.",
    runChecks: "Lancer les checks",
    resetLab: "Reset",
    labPassed: "Lab validé. Tu as appliqué le concept.",
    labNeedsWork: "Il manque encore un élément demandé.",
    applyPrompt:
      "Explique en 1 phrase comment tu appliquerais ça dans ton projet.",
    applyPlaceholder: "Ex: J'utiliserais...",
    submitReflection: "Sauvegarder",
    reflectionSaved: "Réponse sauvegardée.",
    objectives: "Objectifs",
    resources: "Ressources",
    previous: "Précédent",
    next: "Suivant",
    backToPath: "Retour au parcours",
    viewMissions: "Voir les missions",
    lesson: "Leçon",
    exercise: "Exercice",
    project: "Projet",
    xp: "XP",
  },
  en: {
    room: "Room",
    missionBrief: "Mission brief",
    tasks: "Tasks",
    task: "Task",
    understand: "Understand",
    keyDetails: "Key details",
    guidedExample: "Guided example",
    practice: "Your turn to practice",
    lab: "Mini lab",
    checkpoint: "Checkpoint",
    progress: "Progress",
    completed: "completed",
    markDone: "Complete task",
    completedTask: "Task completed",
    answerPlaceholder: "Type your answer...",
    checkAnswer: "Check",
    correct: "Correct. Nice work.",
    tryAgain: "Not yet. Read the hint and try again.",
    hint: "Hint",
    playground: "Playground",
    playgroundIntro: "Edit the code, then run the checks.",
    runChecks: "Run checks",
    resetLab: "Reset",
    labPassed: "Lab passed. You applied the concept.",
    labNeedsWork: "One required element is still missing.",
    applyPrompt:
      "In one sentence, explain how you would use this in your project.",
    applyPlaceholder: "Example: I would use...",
    submitReflection: "Save",
    reflectionSaved: "Answer saved.",
    objectives: "Objectives",
    resources: "Resources",
    previous: "Previous",
    next: "Next",
    backToPath: "Back to path",
    viewMissions: "View missions",
    lesson: "Lesson",
    exercise: "Exercise",
    project: "Project",
    xp: "XP",
  },
  es: {
    room: "Room",
    missionBrief: "Brief de misión",
    tasks: "Tareas",
    task: "Tarea",
    understand: "Comprender",
    keyDetails: "Detalles clave",
    guidedExample: "Ejemplo guiado",
    practice: "Ahora practica",
    lab: "Mini-lab",
    checkpoint: "Checkpoint",
    progress: "Progreso",
    completed: "terminado",
    markDone: "Validar tarea",
    completedTask: "Tarea validada",
    answerPlaceholder: "Escribe tu respuesta...",
    checkAnswer: "Verificar",
    correct: "Correcto. Buen trabajo.",
    tryAgain: "Todavía no. Lee la pista e inténtalo otra vez.",
    hint: "Pista",
    playground: "Playground",
    playgroundIntro: "Edita el código y luego lanza los checks.",
    runChecks: "Lanzar checks",
    resetLab: "Reset",
    labPassed: "Lab validado. Aplicaste el concepto.",
    labNeedsWork: "Todavía falta un elemento pedido.",
    applyPrompt: "En una frase, explica cómo usarías esto en tu proyecto.",
    applyPlaceholder: "Ejemplo: Usaría...",
    submitReflection: "Guardar",
    reflectionSaved: "Respuesta guardada.",
    objectives: "Objetivos",
    resources: "Recursos",
    previous: "Anterior",
    next: "Siguiente",
    backToPath: "Volver a la ruta",
    viewMissions: "Ver misiones",
    lesson: "Lección",
    exercise: "Ejercicio",
    project: "Proyecto",
    xp: "XP",
  },
};

const HTML_STARTER: Record<Language, string> = {
  fr: `<!DOCTYPE html>
<html>
  <head>
    <title>Ma page</title>
  </head>
  <body>
    <h1>Bonjour</h1>
    <img src="photo.jpg">
  </body>
</html>`,
  en: `<!DOCTYPE html>
<html>
  <head>
    <title>My page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <img src="photo.jpg">
  </body>
</html>`,
  es: `<!DOCTYPE html>
<html>
  <head>
    <title>Mi página</title>
  </head>
  <body>
    <h1>Hola</h1>
    <img src="photo.jpg">
  </body>
</html>`,
};

const CHECKPOINTS: Record<
  string,
  Record<Language, Array<{ question: string; answers: string[]; hint: string }>>
> = {
  "html-basics": {
    fr: [
      {
        question: "Quel attribut indique la langue de la page ?",
        answers: ["lang"],
        hint: "Il se place souvent sur la balise <html>.",
      },
      {
        question: "Quelle balise contient le contenu principal unique ?",
        answers: ["main"],
        hint: "Une seule par page.",
      },
      {
        question: "Quel attribut décrit une image ?",
        answers: ["alt"],
        hint: "Très important pour l'accessibilité.",
      },
    ],
    en: [
      {
        question: "Which attribute declares the page language?",
        answers: ["lang"],
        hint: "It is often placed on the <html> tag.",
      },
      {
        question: "Which tag contains the unique main content?",
        answers: ["main"],
        hint: "Use only one per page.",
      },
      {
        question: "Which attribute describes an image?",
        answers: ["alt"],
        hint: "Very important for accessibility.",
      },
    ],
    es: [
      {
        question: "Qué atributo indica el idioma de la página?",
        answers: ["lang"],
        hint: "Suele ir en la etiqueta <html>.",
      },
      {
        question: "Qué etiqueta contiene el contenido principal único?",
        answers: ["main"],
        hint: "Usa solo una por página.",
      },
      {
        question: "Qué atributo describe una imagen?",
        answers: ["alt"],
        hint: "Muy importante para accesibilidad.",
      },
    ],
  },
};

export function InteractiveModule({
  language,
  module,
  path,
  pathLabel,
  prevModule,
  nextModule,
}: InteractiveModuleProps) {
  const copy = COPY[language];
  const [activeTask, setActiveTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerStatus, setAnswerStatus] = useState<
    Record<number, "correct" | "wrong">
  >({});
  const [labCode, setLabCode] = useState(HTML_STARTER[language]);
  const [labPassed, setLabPassed] = useState<boolean | null>(null);
  const [reflection, setReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const checkpoints = CHECKPOINTS[module.id]?.[language] ?? [];
  const completedCount = completedTasks.length;
  const progress = Math.round(
    (completedCount / Math.max(module.steps.length, 1)) * 100,
  );
  const activeStep = module.steps[activeTask] ?? module.steps[0];
  const stepDetails = activeStep.details?.length
    ? activeStep.details
    : getDefaultDetails(module.type, language, Boolean(activeStep.code));
  const guidedExample =
    activeStep.example ??
    getDefaultExample(module.type, language, Boolean(activeStep.code));

  const typeLabel = getTypeLabel(module.type, copy);
  const xp = useMemo(
    () => module.steps.length * 25 + checkpoints.length * 10,
    [checkpoints.length, module.steps.length],
  );

  function markTaskComplete(index: number) {
    const id = `${module.id}:${index}`;
    setCompletedTasks((current) =>
      current.includes(id) ? current : [...current, id],
    );
    setActiveTask((current) => Math.min(current + 1, module.steps.length - 1));
  }

  function isTaskComplete(index: number) {
    return completedTasks.includes(`${module.id}:${index}`);
  }

  function checkAnswer(index: number) {
    const checkpoint = checkpoints[index];
    const value = (answers[index] ?? "").trim().toLowerCase();
    const ok = checkpoint.answers.some(
      (answer) => answer.toLowerCase() === value,
    );
    setAnswerStatus((current) => ({
      ...current,
      [index]: ok ? "correct" : "wrong",
    }));
  }

  function runLabChecks() {
    const lower = labCode.toLowerCase();
    const ok =
      lower.includes("<html lang=") &&
      lower.includes("<main") &&
      lower.includes("</main>") &&
      /<img[\s\S]*\salt=/.test(lower);

    setLabPassed(ok);
    if (ok) markTaskComplete(0);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-2 text-sm text-white/50">
          <Link href="/learn" className="hover:text-white transition-colors">
            Learn
          </Link>
          <span>/</span>
          <Link
            href={`/learn/${path}`}
            className="hover:text-white transition-colors"
          >
            {pathLabel}
          </Link>
          <span>/</span>
          <span className="text-white/80">{module.title}</span>
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
          <Trophy className="h-3.5 w-3.5 text-yellow-300" />
          {xp} {copy.xp}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
            <div className="border-b border-white/10 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${getTypeClass(module.type)}`}
                >
                  {getTypeIcon(module.type)}
                  {typeLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/55">
                  <Clock3 className="h-3.5 w-3.5" />
                  {module.duration}
                </span>
              </div>
              <h1 className="text-xl font-bold leading-tight">
                {module.title}
              </h1>
              <p className="mt-3 text-sm text-white/60">{module.intro}</p>
            </div>

            <div className="border-b border-white/10 p-5">
              <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                <span>{copy.progress}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-learn-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/45">
                {completedCount} / {module.steps.length} {copy.completed}
              </p>
            </div>

            <div className="p-3">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                {copy.tasks}
              </p>
              <div className="space-y-1">
                {module.steps.map((step, index) => {
                  const done = isTaskComplete(index);
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setActiveTask(index)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                        activeTask === index
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-learn-300" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {index + 1}. {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Flag className="h-5 w-5 text-brand-300" />
              <h2 className="font-semibold">{copy.missionBrief}</h2>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {module.intro}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {module.objectives.map((objective) => (
                <div
                  key={objective}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-white/70"
                >
                  <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-learn-300" />
                  {objective}
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/80 text-sm font-bold">
                  {activeTask + 1}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">
                    {copy.task}
                  </p>
                  <h2 className="font-semibold">{activeStep.title}</h2>
                </div>
              </div>
              {isTaskComplete(activeTask) && (
                <span className="rounded-full bg-learn-500/20 px-3 py-1 text-xs font-medium text-learn-200">
                  {copy.completedTask}
                </span>
              )}
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-300" />
                  <h3 className="text-sm font-semibold">{copy.understand}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/72">
                  {activeStep.content}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-learn-300" />
                  <h3 className="text-sm font-semibold">{copy.keyDetails}</h3>
                </div>
                <ul className="space-y-2 text-sm leading-relaxed text-white/68">
                  {stepDetails.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-learn-300" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
                  <Code2 className="h-4 w-4 text-white/45" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/45">
                    {copy.guidedExample}
                  </span>
                </div>
                <p
                  className={`${activeStep.code ? "border-b border-white/10" : ""} bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/68`}
                >
                  {guidedExample}
                </p>
                {activeStep.code && (
                  <pre className="overflow-x-auto bg-black/30 p-4 font-mono text-xs leading-relaxed text-green-300">
                    <code>{activeStep.code}</code>
                  </pre>
                )}
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-learn-500/25 bg-learn-500/10 px-4 py-3">
                <Hammer className="mt-0.5 h-4 w-4 flex-shrink-0 text-learn-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-learn-200/75">
                    {copy.practice}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">
                    {activeStep.practice ??
                      getPracticePrompt(
                        module.type,
                        language,
                        Boolean(activeStep.code),
                      )}
                  </p>
                </div>
              </div>

              {activeStep.tip && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/70">
                      {copy.hint}
                    </p>
                    <p className="mt-1 text-sm text-amber-100/90">
                      {activeStep.tip}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => markTaskComplete(activeTask)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isTaskComplete(activeTask)
                  ? copy.completedTask
                  : copy.markDone}
              </button>
            </div>
          </section>

          {module.id === "html-basics" && (
            <section className="rounded-2xl border border-white/15 bg-[#0d1220] p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <TerminalSquare className="h-5 w-5 text-learn-300" />
                    <h2 className="font-semibold">{copy.playground}</h2>
                  </div>
                  <p className="mt-1 text-sm text-white/50">
                    {copy.playgroundIntro}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLabCode(HTML_STARTER[language]);
                    setLabPassed(null);
                  }}
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
                >
                  {copy.resetLab}
                </button>
              </div>

              <textarea
                value={labCode}
                onChange={(event) => setLabCode(event.target.value)}
                spellCheck={false}
                className="min-h-[260px] w-full resize-y rounded-xl border border-white/10 bg-black/45 p-4 font-mono text-xs leading-relaxed text-green-200 outline-none transition focus:border-learn-300"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={runLabChecks}
                  className="inline-flex items-center gap-2 rounded-xl bg-learn-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-learn-500"
                >
                  <PlayCircle className="h-4 w-4" />
                  {copy.runChecks}
                </button>
                {labPassed !== null && (
                  <span
                    className={`text-sm ${labPassed ? "text-learn-300" : "text-amber-200"}`}
                  >
                    {labPassed ? copy.labPassed : copy.labNeedsWork}
                  </span>
                )}
              </div>
            </section>
          )}

          {checkpoints.length > 0 && (
            <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-300" />
                <h2 className="font-semibold">{copy.checkpoint}</h2>
              </div>
              <div className="space-y-4">
                {checkpoints.map((checkpoint, index) => (
                  <div
                    key={checkpoint.question}
                    className="rounded-xl border border-white/10 bg-black/15 p-4"
                  >
                    <p className="text-sm font-medium">{checkpoint.question}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {copy.hint}: {checkpoint.hint}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={answers[index] ?? ""}
                        onChange={(event) =>
                          setAnswers((current) => ({
                            ...current,
                            [index]: event.target.value,
                          }))
                        }
                        placeholder={copy.answerPlaceholder}
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand-300"
                      />
                      <button
                        type="button"
                        onClick={() => checkAnswer(index)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
                      >
                        <Send className="h-4 w-4" />
                        {copy.checkAnswer}
                      </button>
                    </div>
                    {answerStatus[index] && (
                      <p
                        className={`mt-2 text-sm ${answerStatus[index] === "correct" ? "text-learn-300" : "text-amber-200"}`}
                      >
                        {answerStatus[index] === "correct"
                          ? copy.correct
                          : copy.tryAgain}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Hammer className="h-5 w-5 text-brand-300" />
              <h2 className="font-semibold">{copy.lab}</h2>
            </div>
            <p className="text-sm text-white/65">{copy.applyPrompt}</p>
            <textarea
              value={reflection}
              onChange={(event) => {
                setReflection(event.target.value);
                setReflectionSaved(false);
              }}
              placeholder={copy.applyPlaceholder}
              className="mt-3 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand-300"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (reflection.trim().length > 12) {
                    setReflectionSaved(true);
                    markTaskComplete(module.steps.length - 1);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                {copy.submitReflection}
              </button>
              {reflectionSaved && (
                <span className="text-sm text-learn-300">
                  {copy.reflectionSaved}
                </span>
              )}
            </div>
          </section>

          {module.resources && module.resources.length > 0 && (
            <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
              <h2 className="mb-4 font-semibold">{copy.resources}</h2>
              <ul className="space-y-2">
                {module.resources.map((resource) => (
                  <li key={resource.url}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-brand-300 transition hover:text-brand-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {resource.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex-1">
                {prevModule && (
                  <Link
                    href={`/learn/${path}/${prevModule.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden max-w-[170px] truncate sm:block">
                      {prevModule.title}
                    </span>
                    <span className="sm:hidden">{copy.previous}</span>
                  </Link>
                )}
              </div>

              <Link
                href={`/learn/${path}`}
                className="text-sm text-white/50 transition hover:text-white"
              >
                {copy.backToPath}
              </Link>

              <div className="flex flex-1 justify-end">
                {nextModule ? (
                  <Link
                    href={`/learn/${path}/${nextModule.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
                  >
                    <span className="hidden max-w-[170px] truncate sm:block">
                      {nextModule.title}
                    </span>
                    <span className="sm:hidden">{copy.next}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 rounded-xl bg-learn-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-learn-500"
                  >
                    {copy.viewMissions}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function getTypeLabel(type: ModuleType, copy: (typeof COPY)[Language]) {
  if (type === "project") return copy.project;
  if (type === "exercise") return copy.exercise;
  return copy.lesson;
}

function getTypeIcon(type: ModuleType) {
  if (type === "project") return <Hammer className="h-4 w-4" />;
  if (type === "exercise") return <Zap className="h-4 w-4" />;
  return <BookOpen className="h-4 w-4" />;
}

function getTypeClass(type: ModuleType) {
  if (type === "project")
    return "border-brand-500/30 bg-brand-500/20 text-brand-300";
  if (type === "exercise")
    return "border-learn-500/30 bg-learn-500/20 text-learn-300";
  return "border-white/20 bg-white/10 text-white/70";
}

function getDefaultDetails(
  type: ModuleType,
  language: Language,
  hasCode: boolean,
) {
  const details: Record<Language, Record<ModuleType, string[]>> = {
    fr: {
      lesson: [
        "Commence par comprendre le rôle du concept avant de mémoriser la syntaxe.",
        hasCode
          ? "Lis l'exemple ligne par ligne : repère ce qui est obligatoire, ce qui est configurable et ce qui peut être renommé."
          : "Relie l'idée à une situation concrète : une page, une interface, une mission ou un livrable.",
        "À la fin, tu dois pouvoir expliquer le concept sans recopier le texte du cours.",
      ],
      exercise: [
        "L'objectif n'est pas seulement de finir : tu dois comprendre pourquoi chaque action est demandée.",
        "Compare ton résultat avec la consigne et corrige les écarts avant de valider.",
        "Garde une trace de ce que tu as fait, car ce sera réutilisable dans un projet réel.",
      ],
      project: [
        "Découpe le livrable en petites décisions : structure, contenu, style, comportement, vérification.",
        "Chaque étape doit produire quelque chose de visible ou testable.",
        "Pense comme un junior en mission : simple, propre, vérifiable, montrable.",
      ],
    },
    en: {
      lesson: [
        "Start by understanding what the concept is for before memorizing syntax.",
        hasCode
          ? "Read the example line by line: spot what is required, what is configurable, and what can be renamed."
          : "Connect the idea to a concrete situation: a page, an interface, a mission, or a deliverable.",
        "By the end, you should be able to explain the concept without copying the lesson text.",
      ],
      exercise: [
        "The goal is not just to finish: understand why each action is requested.",
        "Compare your result with the instructions and fix gaps before validating.",
        "Keep a trace of what you did, because you will reuse it in a real project.",
      ],
      project: [
        "Break the deliverable into small decisions: structure, content, style, behavior, verification.",
        "Every step should produce something visible or testable.",
        "Think like a junior on a client mission: simple, clean, verifiable, presentable.",
      ],
    },
    es: {
      lesson: [
        "Empieza entendiendo para qué sirve el concepto antes de memorizar la sintaxis.",
        hasCode
          ? "Lee el ejemplo línea por línea: identifica qué es obligatorio, qué se puede configurar y qué se puede renombrar."
          : "Conecta la idea con una situación concreta: una página, una interfaz, una misión o un entregable.",
        "Al final, deberías poder explicar el concepto sin copiar el texto del curso.",
      ],
      exercise: [
        "El objetivo no es solo terminar: debes entender por qué se pide cada acción.",
        "Compara tu resultado con la consigna y corrige las diferencias antes de validar.",
        "Guarda una huella de lo que hiciste, porque podrás reutilizarlo en un proyecto real.",
      ],
      project: [
        "Divide el entregable en pequeñas decisiones: estructura, contenido, estilo, comportamiento y verificación.",
        "Cada paso debe producir algo visible o comprobable.",
        "Piensa como junior en una misión real: simple, limpio, verificable y presentable.",
      ],
    },
  };

  return details[language][type];
}

function getDefaultExample(
  type: ModuleType,
  language: Language,
  hasCode: boolean,
) {
  const examples: Record<Language, Record<ModuleType, string>> = {
    fr: {
      lesson: hasCode
        ? "Observe l'exemple comme un modèle : lis d'abord l'intention, puis identifie les parties que tu pourrais modifier dans ton propre projet."
        : "Exemple concret : si ce concept apparaissait dans une mission client, demande-toi quelle décision il t'aiderait à prendre et quel résultat il changerait.",
      exercise:
        "Exemple concret : avant de commencer, écris le résultat attendu en une phrase. Après l'exercice, vérifie que ton résultat correspond à cette phrase.",
      project:
        "Exemple concret : traite cette étape comme une mini-livraison. À la fin, tu dois pouvoir montrer l'avancement et expliquer ton choix principal.",
    },
    en: {
      lesson: hasCode
        ? "Use the example as a model: read the intention first, then identify the parts you could change in your own project."
        : "Concrete example: if this concept appeared in a client mission, ask what decision it would help you make and what result it would change.",
      exercise:
        "Concrete example: before starting, write the expected result in one sentence. After the exercise, check that your result matches it.",
      project:
        "Concrete example: treat this step like a mini delivery. At the end, you should be able to show progress and explain your main choice.",
    },
    es: {
      lesson: hasCode
        ? "Usa el ejemplo como modelo: lee primero la intención y luego identifica las partes que podrías cambiar en tu propio proyecto."
        : "Ejemplo concreto: si este concepto apareciera en una misión de cliente, pregúntate qué decisión te ayudaría a tomar y qué resultado cambiaría.",
      exercise:
        "Ejemplo concreto: antes de empezar, escribe el resultado esperado en una frase. Después del ejercicio, verifica que tu resultado coincida.",
      project:
        "Ejemplo concreto: trata este paso como una mini entrega. Al final, deberías poder mostrar el avance y explicar tu decisión principal.",
    },
  };

  return examples[language][type];
}

function getPracticePrompt(
  type: ModuleType,
  language: Language,
  hasCode: boolean,
) {
  const prompts: Record<Language, Record<ModuleType, string>> = {
    fr: {
      lesson: hasCode
        ? "Reproduis l'exemple dans un petit fichier, change deux valeurs, puis explique ce qui a changé avec tes mots."
        : "Prends un cas réel de ton projet et applique le concept en 5 minutes. Note ce qui est clair et ce qui bloque encore.",
      exercise:
        "Réalise l'action demandée sur ton propre projet, puis vérifie le résultat comme si tu devais le livrer à un client.",
      project:
        "Intègre cette étape dans ton livrable final. Garde une version propre que tu pourrais montrer dans ton portfolio.",
    },
    en: {
      lesson: hasCode
        ? "Recreate the example in a small file, change two values, then explain what changed in your own words."
        : "Pick a real case from your project and apply the concept for 5 minutes. Note what is clear and what still feels blocked.",
      exercise:
        "Do the requested action in your own project, then check the result as if you were handing it to a client.",
      project:
        "Add this step to your final deliverable. Keep a clean version you could show in your portfolio.",
    },
    es: {
      lesson: hasCode
        ? "Reproduce el ejemplo en un archivo pequeño, cambia dos valores y explica con tus palabras qué cambió."
        : "Toma un caso real de tu proyecto y aplica el concepto durante 5 minutos. Anota qué está claro y qué sigue bloqueado.",
      exercise:
        "Haz la acción pedida en tu propio proyecto y revisa el resultado como si fueras a entregarlo a un cliente.",
      project:
        "Integra este paso en tu entregable final. Guarda una versión limpia que puedas mostrar en tu portfolio.",
    },
  };

  return prompts[language][type];
}
