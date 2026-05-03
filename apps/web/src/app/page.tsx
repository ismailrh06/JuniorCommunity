"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Briefcase, Star, Users } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

export default function HomePage() {
  const { language, messages } = useI18n();

  const learnFeatures: Record<Language, string[]> = {
    fr: [
      "5 niveaux progressifs",
      "Projets concrets à chaque étape",
      "Badge Verified Junior",
      "Accès marketplace inclus",
    ],
    en: [
      "5 progressive levels",
      "Real projects at each step",
      "Verified Junior badge",
      "Marketplace access included",
    ],
    es: [
      "5 niveles progresivos",
      "Proyectos reales en cada etapa",
      "Badge Verified Junior",
      "Acceso al marketplace incluido",
    ],
  };

  const marketplaceFeatures: Record<Language, string[]> = {
    fr: ["Projets Junior-Only", "Accompagnement à chaque étape", "Paiement sécurisé", "Notation et avis"],
    en: ["Junior-only projects", "Support at every step", "Secure payments", "Ratings & reviews"],
    es: ["Proyectos solo para juniors", "Acompañamiento en cada etapa", "Pago seguro", "Valoraciones y reseñas"],
  };

  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:pt-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-500/30 blur-[120px] animate-pulse" />
        <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-market-500/20 blur-[110px]" />
        <div className="pointer-events-none absolute -left-24 top-56 h-72 w-72 rounded-full bg-learn-500/20 blur-[110px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 flex justify-center">
            <Badge className="border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md">
              {messages.home.waitlist}
            </Badge>
          </div>

          <h1 className="mx-auto max-w-5xl text-center text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            {messages.home.titlePrefix}{" "}
            <span className="bg-gradient-to-r from-brand-400 via-white to-learn-300 bg-clip-text text-transparent">{messages.home.titleGradient}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-center text-base text-white/75 sm:text-xl">
            {messages.home.subtitle}
            <br className="hidden sm:block" />
            <strong className="text-white">{messages.home.subtitleStrong}</strong>
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/learn"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-brand-500/30 transition hover:-translate-y-0.5 hover:from-brand-400 hover:to-brand-500"
            >
              <BookOpen className="h-5 w-5" />
              {messages.home.ctaLearn}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <Briefcase className="h-5 w-5" />
              {messages.home.ctaMarketplace}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: messages.home.stats.learners, value: "500+", icon: Users },
              { label: messages.home.stats.projects, value: "120+", icon: Briefcase },
              { label: messages.home.stats.hired, value: "80+", icon: ArrowRight },
              { label: messages.home.stats.clients, value: "95%", icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/[0.10]"
              >
                <Icon className="mb-3 h-4 w-4 text-brand-300" />
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-white/65 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Écosystème ── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand-300">{messages.home.platformTag}</p>
          <h2 className="text-3xl font-bold sm:text-4xl">{messages.home.ecosystemTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            {messages.home.ecosystemDesc}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl border border-learn-400/25 bg-gradient-to-b from-learn-500/10 to-white/[0.04] p-8 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-learn-500/20">
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-learn-400/20 blur-3xl" />
            <div className="relative">
              <div className="mb-5 inline-flex rounded-2xl bg-learn-500 p-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">{messages.home.learnTitle}</h3>
              <p className="mt-3 text-white/75">
                {messages.home.learnDesc}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                {learnFeatures[language].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-learn-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-7 bg-learn-600 hover:bg-learn-500" asChild>
                <Link href="/learn">{messages.home.learnCta}</Link>
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-market-400/25 bg-gradient-to-b from-market-500/10 to-white/[0.04] p-8 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-market-500/20">
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-market-400/20 blur-3xl" />
            <div className="relative">
              <div className="mb-5 inline-flex rounded-2xl bg-market-500 p-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">{messages.home.marketTitle}</h3>
              <p className="mt-3 text-white/75">
                {messages.home.marketDesc}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                {marketplaceFeatures[language].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-market-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-7 bg-market-600 hover:bg-market-500" asChild>
                <Link href="/marketplace">{messages.home.marketCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Parcours 4 étapes ── */}
      <section className="mx-auto max-w-5xl px-4 pb-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand-300">Le parcours complet</p>
          <h2 className="text-3xl font-bold sm:text-4xl">{messages.home.journeyTitle}</h2>
          <p className="mt-3 max-w-2xl mx-auto text-white/70">{messages.home.journeyDesc}</p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {messages.home.journeySteps.map((step, idx) => {
            const tagColors: Record<string, string> = {
              "JC Learn": "bg-learn-500/20 text-learn-200 border-learn-400/30",
              "Badge": "bg-brand-500/20 text-brand-200 border-brand-400/30",
              "Marketplace": "bg-market-500/20 text-market-200 border-market-400/30",
            };
            const glowColors = ["shadow-learn-500/10", "shadow-learn-500/10", "shadow-brand-500/10", "shadow-market-500/10"];
            const borderColors = ["border-learn-400/25", "border-learn-400/25", "border-brand-400/35", "border-market-400/25"];
            return (
              <div key={step.step} className="relative flex flex-col gap-3">
                {/* Arrow connector (hidden on last) */}
                {idx < 3 && (
                  <div className="absolute right-0 top-8 hidden lg:flex translate-x-1/2 z-10 h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#070b16] text-white/50">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className={`group h-full rounded-2xl border ${borderColors[idx]} bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-xl ${glowColors[idx]}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{step.icon}</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className={`mb-3 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${tagColors[step.tag] ?? "bg-white/10 text-white/50 border-white/15"}`}>
                    {step.tag}
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-white/65">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Badges = preuves ── */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
          <div className="rounded-3xl border border-brand-400/20 bg-gradient-to-br from-brand-500/8 via-white/[0.03] to-market-500/8 p-5 sm:p-8 md:p-10">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.25em] text-brand-300">Certification</p>
              <h2 className="text-2xl font-bold sm:text-3xl">{messages.home.badgeProofTitle}</h2>
              <p className="mt-2 max-w-lg text-sm text-white/65">{messages.home.badgeProofDesc}</p>
            </div>
            <Link
              href="/learn"
              className="mt-4 inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-400/40 bg-brand-500/15 px-4 py-2 text-sm font-medium text-brand-200 transition hover:bg-brand-500/25 sm:mt-0"
            >
              <BookOpen className="h-4 w-4" />
              {messages.home.learnCta}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {messages.home.badgeProofItems.map((badge) => (
              <div
                key={badge.title}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.emoji}</span>
                  <span className="font-semibold">{badge.title}</span>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                  <span className="mt-0.5 text-xs text-brand-300">✓</span>
                  <p className="text-xs text-white/70 italic">« {badge.proof} »</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <Briefcase className="h-3.5 w-3.5" />
                  Visible sur ton profil public
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="mx-4 mb-20 rounded-3xl border border-white/15 bg-gradient-to-r from-brand-600 to-market-600 p-6 text-center sm:mx-8 sm:p-10">
        <h2 className="text-3xl font-black sm:text-4xl">{messages.home.finalTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/85">
          {messages.home.finalDesc}
        </p>
        <Button size="lg" variant="secondary" className="mt-8" asChild>
          <Link href="/auth/register">{messages.home.finalCta}</Link>
        </Button>
      </section>

      <Footer />
    </main>
  );
}
