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

  const timelineByLanguage: Record<Language, Array<{ level: number; title: string; desc: string }>> = {
    fr: [
      { level: 0, title: "Onboarding", desc: "Compte, objectif, mini test de niveau." },
      { level: 1, title: "Fondations", desc: "HTML/CSS, Git, JavaScript appliqué." },
      { level: 2, title: "Premier projet guidé", desc: "Portfolio, app concrète, retours mentor." },
      { level: 3, title: "Préparation marché", desc: "Offres, devis, communication client." },
      { level: 4, title: "Projet réel", desc: "Livraison complète sur mission Junior-Only." },
    ],
    en: [
      { level: 0, title: "Onboarding", desc: "Account setup, objective, mini level test." },
      { level: 1, title: "Foundations", desc: "HTML/CSS, Git, applied JavaScript." },
      { level: 2, title: "First guided project", desc: "Portfolio, real app, mentor feedback." },
      { level: 3, title: "Market readiness", desc: "Offers, quotes, client communication." },
      { level: 4, title: "Real project", desc: "End-to-end delivery on Junior-only missions." },
    ],
    es: [
      { level: 0, title: "Onboarding", desc: "Cuenta, objetivo y mini prueba de nivel." },
      { level: 1, title: "Fundamentos", desc: "HTML/CSS, Git y JavaScript aplicado." },
      { level: 2, title: "Primer proyecto guiado", desc: "Portfolio, app real y feedback mentor." },
      { level: 3, title: "Preparación al mercado", desc: "Ofertas, presupuesto y comunicación cliente." },
      { level: 4, title: "Proyecto real", desc: "Entrega completa en misiones Junior-only." },
    ],
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

      {/* ── Timeline ── */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{messages.home.timelineTitle}</h2>
          <p className="mt-3 text-white/70">{messages.home.timelineDesc}</p>
        </div>

        <div className="space-y-4">
          {timelineByLanguage[language].map((step) => (
            <div
              key={step.level}
              className="group flex items-start gap-4 rounded-2xl border border-white/15 bg-white/[0.04] p-5 transition hover:border-brand-400/50 hover:bg-white/[0.07]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-300/40 bg-brand-500/15 text-sm font-bold text-brand-200">
                N{step.level}
              </div>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-white/65">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="mx-4 mb-20 rounded-3xl border border-white/15 bg-gradient-to-r from-brand-600 to-market-600 p-10 text-center sm:mx-8">
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
