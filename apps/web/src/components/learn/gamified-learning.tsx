"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  Flame,
  Gift,
  Lightbulb,
  Lock,
  Play,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useLearningProgressStore } from "@/stores/learning-progress";

export type MissionStatus = "completed" | "active" | "locked";
export type MissionTone = "green" | "blue" | "violet" | "amber" | "rose";

export type MissionCardData = {
  href: string;
  title: string;
  intro: string;
  duration: string;
  xp: number;
  status: MissionStatus;
  tags: string[];
  challenge: string;
  reward: string;
  tone?: MissionTone;
};

const toneClasses: Record<MissionTone, string> = {
  green: "from-learn-400/25 to-emerald-500/5 text-learn-200",
  blue: "from-brand-400/25 to-cyan-500/5 text-brand-200",
  violet: "from-market-400/25 to-fuchsia-500/5 text-market-200",
  amber: "from-amber-400/25 to-yellow-500/5 text-amber-200",
  rose: "from-rose-400/25 to-pink-500/5 text-rose-200",
};

export function LearningProgressSync() {
  const syncFromServer = useLearningProgressStore(
    (state) => state.syncFromServer,
  );

  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  return null;
}

export function XPBar({
  current,
  max,
  level,
  label = "XP",
}: {
  current: number;
  max: number;
  level: number;
  label?: string;
}) {
  const storedXp = useLearningProgressStore((state) => state.xp);
  const displayCurrent = Math.max(current, storedXp);
  const displayMax = Math.max(max, Math.ceil((displayCurrent + 1) / 500) * 500);
  const displayLevel = Math.max(level, Math.floor(displayCurrent / 500) + 1);
  const progress = Math.min(
    100,
    Math.round((displayCurrent / displayMax) * 100),
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-200">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Level {displayLevel}
            </p>
            <p className="text-sm font-semibold text-white">
              {displayCurrent} / {displayMax} {label}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
          {progress}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/35">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-learn-300 via-brand-300 to-market-300"
        />
      </div>
    </div>
  );
}

export function StreakCounter({
  days,
  compact = false,
}: {
  days: number;
  compact?: boolean;
}) {
  const storedDays = useLearningProgressStore((state) => state.streakDays);
  const displayDays = Math.max(days, storedDays);

  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-100",
        compact ? "px-3 py-2" : "p-4",
      )}
    >
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-amber-300" />
        <span className="text-sm font-semibold">{displayDays}-day streak</span>
      </div>
      {!compact && (
        <p className="mt-2 text-xs text-amber-100/65">
          Keep one tiny win alive today.
        </p>
      )}
    </div>
  );
}

export function MissionCard({ mission }: { mission: MissionCardData }) {
  const missionId = mission.href.split("/").filter(Boolean).at(-1) ?? mission.href;
  const isCompleted = useLearningProgressStore((state) =>
    state.isMissionCompleted(missionId),
  );
  const status = isCompleted ? "completed" : mission.status;
  const locked = status === "locked";
  const content = (
    <motion.article
      whileHover={locked ? undefined : { y: -4 }}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border p-5 transition",
        "border-white/12 bg-white/[0.055] shadow-xl shadow-black/20 backdrop-blur",
        locked
          ? "opacity-60"
          : "hover:border-white/25 hover:bg-white/[0.08]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-90",
          toneClasses[mission.tone ?? "green"],
        )}
      />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25 ring-1 ring-white/10">
            {status === "completed" ? (
              <CheckCircle2 className="h-6 w-6 text-learn-300" />
            ) : status === "locked" ? (
              <Lock className="h-5 w-5 text-white/45" />
            ) : (
              <Rocket className="h-6 w-6 text-white" />
            )}
          </div>
          <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-white/70">
            +{mission.xp} XP
          </span>
        </div>

        <h3 className="text-lg font-bold leading-snug text-white">
          {mission.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/62">
          {mission.intro}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {mission.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/68"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-white/40">
            Quick challenge
          </p>
          <p className="mt-1 text-sm text-white/78">{mission.challenge}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-white/55">
            <Clock3 className="h-4 w-4" />
            {mission.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-brand-200">
            {isCompleted ? "Completed" : locked ? "Locked" : mission.reward}
            {!locked && <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />}
          </span>
        </div>
      </div>
    </motion.article>
  );

  if (locked) return <div aria-disabled>{content}</div>;
  return <Link href={mission.href}>{content}</Link>;
}

export function AchievementPopup({
  show,
  title,
  description,
  xp,
}: {
  show: boolean;
  title: string;
  description: string;
  xp: number;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border border-learn-300/25 bg-[#0b1324]/95 p-4 text-white shadow-2xl shadow-learn-950/40 backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-learn-400/20">
              <Trophy className="h-6 w-6 text-learn-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{title}</p>
              <p className="mt-1 text-sm text-white/62">{description}</p>
            </div>
            <span className="rounded-full bg-learn-400/20 px-2.5 py-1 text-xs font-semibold text-learn-100">
              +{xp} XP
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SkillTree({
  skills,
}: {
  skills: Array<{ name: string; status: MissionStatus; xp: number }>;
}) {
  const completedMissions = useLearningProgressStore(
    (state) => state.completedMissions,
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04 }}
          className={cn(
            "relative rounded-2xl border p-4",
            skill.status === "locked" && completedMissions.length < index
              ? "border-white/8 bg-white/[0.035] text-white/45"
              : "border-white/12 bg-white/[0.06] text-white",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                skill.status === "completed" || completedMissions.length > index
                  ? "bg-learn-400/20 text-learn-200"
                  : skill.status === "active"
                    ? "bg-brand-400/20 text-brand-200"
                    : "bg-white/8 text-white/35",
              )}
            >
              {skill.status === "completed" || completedMissions.length > index ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : skill.status === "active" ? (
                <Sparkles className="h-5 w-5" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
            <span className="text-xs">{skill.xp} XP</span>
          </div>
          <p className="font-semibold">{skill.name}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function DailyChallenge() {
  const challengeId = `daily-${new Date().toISOString().slice(0, 10)}`;
  const claimed = useLearningProgressStore((state) =>
    state.isDailyChallengeClaimed(challengeId),
  );
  const claimDailyChallenge = useLearningProgressStore(
    (state) => state.claimDailyChallenge,
  );

  return (
    <div className="rounded-2xl border border-brand-300/20 bg-brand-400/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-brand-100/55">
            Daily challenge
          </p>
          <h3 className="mt-1 font-bold text-white">
            Add one hover state to a real button
          </h3>
          <p className="mt-2 text-sm text-white/62">
            Tiny task, visible result, fast win.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-300/15">
          <Star className="h-6 w-6 text-brand-100" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => claimDailyChallenge(challengeId)}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400"
      >
        {claimed ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {claimed ? "+15 XP claimed" : "Start challenge"}
      </button>
    </div>
  );
}

export function UnlockAnimation({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-2xl border border-market-300/20 bg-market-400/10 p-5"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 2 }}
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-market-300/15"
      >
        <Gift className="h-6 w-6 text-market-100" />
      </motion.div>
      <p className="text-xs uppercase tracking-[0.18em] text-market-100/55">
        You unlocked
      </p>
      <h3 className="mt-1 font-bold text-white">{label}</h3>
    </motion.div>
  );
}

export function QuestTimeline({
  items,
}: {
  items: Array<{ title: string; meta: string; status: MissionStatus }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.title} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border",
                item.status === "completed"
                  ? "border-learn-300/30 bg-learn-300/20 text-learn-100"
                  : item.status === "active"
                    ? "border-brand-300/30 bg-brand-300/20 text-brand-100"
                    : "border-white/10 bg-white/5 text-white/35",
              )}
            >
              {item.status === "completed" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </div>
            {index < items.length - 1 && <div className="h-8 w-px bg-white/10" />}
          </div>
          <div className="min-w-0 pb-3">
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-sm text-white/48">{item.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressRadar({
  values,
}: {
  values: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Radar className="h-5 w-5 text-learn-200" />
        <h3 className="font-bold text-white">Skill radar</h3>
      </div>
      <div className="space-y-3">
        {values.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs text-white/55">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/30">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.value}%` }}
                viewport={{ once: true }}
                className="h-full rounded-full bg-gradient-to-r from-learn-300 to-brand-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RewardModal({
  open,
  onClose,
  title,
  reward,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  reward: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0b1324] p-6 text-center text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-learn-300/15">
              <Award className="h-8 w-8 text-learn-100" />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-white/62">{reward}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-learn-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-learn-400"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function InteractiveCodeBlock({
  starter,
  required,
  onComplete,
}: {
  starter: string;
  required: string[];
  onComplete?: () => void;
}) {
  const [code, setCode] = useState(starter);
  const [hintOpen, setHintOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);

  const checks = useMemo(
    () =>
      required.map((token) => ({
        token,
        passed: code.toLowerCase().includes(token.toLowerCase()),
      })),
    [code, required],
  );
  const passed = checks.every((check) => check.passed);
  const previewHtml = code.replaceAll(
    'src="photo.jpg"',
    'src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27180%27%3E%3Crect width=%27320%27 height=%27180%27 fill=%27%23dbeafe%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%231e40af%27 font-family=%27Arial%27 font-size=%2720%27%3EPreview%3C/text%3E%3C/svg%3E"',
  );

  function runValidation() {
    if (passed) {
      onComplete?.();
      setRewardOpen(true);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0a1020]">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-learn-200" />
          <div>
            <h3 className="font-bold text-white">Live playground</h3>
            <p className="text-xs text-white/45">
              Edit, run checks, unlock the next step.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setHintOpen((value) => !value)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-3 py-2 text-xs font-semibold text-white/65 transition hover:bg-white/10"
        >
          <Lightbulb className="h-4 w-4" />
          Hint
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            className="h-[340px] w-full resize-none bg-black/30 p-4 font-mono text-xs leading-relaxed text-green-200 outline-none"
          />
        </div>
        <div className="min-h-[340px] bg-white p-4 text-slate-950">
          <div
            className="h-full rounded-xl border border-slate-200 p-4"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 p-4">
        <AnimatePresence>
          {hintOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100/80"
            >
              Add each required token exactly once, then run validation.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-2 sm:grid-cols-3">
          {checks.map((check) => (
            <div
              key={check.token}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                check.passed
                  ? "border-learn-300/25 bg-learn-300/10 text-learn-100"
                  : "border-white/10 bg-white/[0.04] text-white/45",
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {check.token}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={runValidation}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
            passed
              ? "bg-learn-500 hover:bg-learn-400"
              : "bg-white/10 text-white/45",
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          {passed ? "Mission complete" : "Run checks"}
        </button>
      </div>

      <RewardModal
        open={rewardOpen}
        onClose={() => setRewardOpen(false)}
        title="Mission complete"
        reward="You unlocked the next challenge and earned +25 XP."
      />
    </div>
  );
}
