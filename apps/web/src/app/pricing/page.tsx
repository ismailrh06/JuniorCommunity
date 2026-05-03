import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { CheckCircle, Star, XCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Tarifs — JuniorCode",
  description: "Gratuit pour les apprenants. Pro pour aller plus loin. Recruteur pour trouver des juniors certifiés.",
};

// ─── Copy ─────────────────────────────────────────────────────────────────────
const COPY: Record<Language, {
  headline: string;
  sub: string;
  mostPopular: string;
  monthly: string;
  free: string;
  freeCta: string;
  proCta: string;
  clientCta: string;
  faq: string;
  faqItems: Array<{ q: string; a: string }>;
}> = {
  fr: {
    headline: "Tarifs simples, impact réel",
    sub: "Gratuit pour apprendre. Payant pour décroller et recruter.",
    mostPopular: "Le plus populaire",
    monthly: "/ mois",
    free: "Gratuit",
    freeCta: "Commencer gratuitement",
    proCta: "Passer en Pro",
    clientCta: "Contacter l'équipe",
    faq: "Questions fréquentes",
    faqItems: [
      { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement. Vous continuez à avoir accès au plan gratuit après annulation." },
      { q: "Les badges sont-ils vraiment vérifiés ?", a: "Chaque badge est lié à un projet réel soumis et validé par notre équipe ou un partenaire." },
      { q: "Y a-t-il une version d'essai Pro ?", a: "Oui, 14 jours gratuits sans carte bancaire." },
      { q: "Comment fonctionne le plan Recruteur ?", a: "Contactez-nous pour un devis adapté à votre volume de recrutement junior." },
    ],
  },
  en: {
    headline: "Simple pricing, real impact",
    sub: "Free to learn. Paid to grow and hire.",
    mostPopular: "Most popular",
    monthly: "/ month",
    free: "Free",
    freeCta: "Start for free",
    proCta: "Go Pro",
    clientCta: "Contact the team",
    faq: "Frequently asked questions",
    faqItems: [
      { q: "Can I cancel anytime?", a: "Yes, no commitment. You keep access to the free plan after cancellation." },
      { q: "Are badges really verified?", a: "Each badge is linked to a real project submitted and validated by our team or a partner." },
      { q: "Is there a Pro trial?", a: "Yes, 14 days free — no credit card required." },
      { q: "How does the Recruiter plan work?", a: "Contact us for a quote tailored to your junior hiring volume." },
    ],
  },
  es: {
    headline: "Precios simples, impacto real",
    sub: "Gratis para aprender. De pago para crecer y contratar.",
    mostPopular: "El más popular",
    monthly: "/ mes",
    free: "Gratis",
    freeCta: "Empezar gratis",
    proCta: "Pasarse a Pro",
    clientCta: "Contactar al equipo",
    faq: "Preguntas frecuentes",
    faqItems: [
      { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, sin compromiso. Sigues teniendo acceso al plan gratuito después de cancelar." },
      { q: "¿Las insignias están realmente verificadas?", a: "Cada insignia está vinculada a un proyecto real enviado y validado por nuestro equipo o un socio." },
      { q: "¿Hay una prueba Pro?", a: "Sí, 14 días gratis sin tarjeta de crédito." },
      { q: "¿Cómo funciona el plan Reclutador?", a: "Contáctanos para un presupuesto adaptado a tu volumen de contratación junior." },
    ],
  },
};

type PlanFeature = { label: Record<Language, string>; included: boolean };

const PLANS: Array<{
  key: string;
  emoji: string;
  name: Record<Language, string>;
  price: Record<Language, string>;
  desc: Record<Language, string>;
  features: PlanFeature[];
  highlight: boolean;
  ctaKey: "freeCta" | "proCta" | "clientCta";
  ctaHref: string;
}> = [
  {
    key: "free",
    emoji: "🌱",
    name: { fr: "Apprenant", en: "Learner", es: "Aprendiz" },
    price: { fr: "0€", en: "€0", es: "0€" },
    desc: {
      fr: "Tout ce qu'il faut pour démarrer son parcours junior.",
      en: "Everything you need to start your junior journey.",
      es: "Todo lo que necesitas para empezar tu camino junior.",
    },
    features: [
      { label: { fr: "Parcours d'apprentissage complet", en: "Full learning path", es: "Ruta de aprendizaje completa" }, included: true },
      { label: { fr: "Jusqu'à 3 badges certifiés", en: "Up to 3 certified badges", es: "Hasta 3 insignias certificadas" }, included: true },
      { label: { fr: "Profil public JuniorCode", en: "Public JuniorCode profile", es: "Perfil público JuniorCode" }, included: true },
      { label: { fr: "Accès aux projets Junior-Only", en: "Access to Junior-Only projects", es: "Acceso a proyectos Junior-Only" }, included: true },
      { label: { fr: "Mentorat communautaire", en: "Community mentoring", es: "Mentoría comunitaria" }, included: false },
      { label: { fr: "Accès prioritaire aux missions", en: "Priority access to missions", es: "Acceso prioritario a misiones" }, included: false },
      { label: { fr: "CV généré automatiquement", en: "Auto-generated CV", es: "CV generado automáticamente" }, included: false },
    ],
    highlight: false,
    ctaKey: "freeCta",
    ctaHref: "/auth/register",
  },
  {
    key: "pro",
    emoji: "⚡",
    name: { fr: "Junior+", en: "Junior+", es: "Junior+" },
    price: { fr: "19€", en: "€19", es: "19€" },
    desc: {
      fr: "Pour décrocher ta première mission rémunérée plus vite.",
      en: "To land your first paid mission faster.",
      es: "Para conseguir tu primera misión remunerada más rápido.",
    },
    features: [
      { label: { fr: "Tout du plan Apprenant", en: "Everything in Learner", es: "Todo del plan Aprendiz" }, included: true },
      { label: { fr: "Badges illimités", en: "Unlimited badges", es: "Insignias ilimitadas" }, included: true },
      { label: { fr: "Mentorat communautaire", en: "Community mentoring", es: "Mentoría comunitaria" }, included: true },
      { label: { fr: "Accès prioritaire aux missions", en: "Priority access to missions", es: "Acceso prioritario a misiones" }, included: true },
      { label: { fr: "CV généré automatiquement", en: "Auto-generated CV", es: "CV generado automáticamente" }, included: true },
      { label: { fr: "Tableau de bord avancé", en: "Advanced dashboard", es: "Panel avanzado" }, included: true },
      { label: { fr: "Support prioritaire", en: "Priority support", es: "Soporte prioritario" }, included: true },
    ],
    highlight: true,
    ctaKey: "proCta",
    ctaHref: "/auth/register?plan=pro",
  },
  {
    key: "client",
    emoji: "🏢",
    name: { fr: "Recruteur", en: "Recruiter", es: "Reclutador" },
    price: { fr: "Sur devis", en: "Quote", es: "Presupuesto" },
    desc: {
      fr: "Pour trouver et recruter des juniors certifiés en toute confiance.",
      en: "To find and hire certified juniors with confidence.",
      es: "Para encontrar y contratar juniors certificados con confianza.",
    },
    features: [
      { label: { fr: "Accès à l'annuaire des juniors", en: "Access to junior directory", es: "Acceso al directorio de juniors" }, included: true },
      { label: { fr: "Badges vérifiés et projets prouvés", en: "Verified badges & proven projects", es: "Insignias verificadas y proyectos probados" }, included: true },
      { label: { fr: "Publication de projets illimitée", en: "Unlimited project posting", es: "Publicación de proyectos ilimitada" }, included: true },
      { label: { fr: "Matching automatique par compétences", en: "Automatic skill-based matching", es: "Matching automático por habilidades" }, included: true },
      { label: { fr: "Support dédié", en: "Dedicated support", es: "Soporte dedicado" }, included: true },
      { label: { fr: "Rapports de recrutement", en: "Recruitment reports", es: "Informes de reclutamiento" }, included: true },
      { label: { fr: "Intégration ATS sur demande", en: "ATS integration on request", es: "Integración ATS bajo petición" }, included: true },
    ],
    highlight: false,
    ctaKey: "clientCta",
    ctaHref: "mailto:hello@juniorcode.com",
  },
];

export default async function PricingPage() {
  const cookieStore = cookies();
  const langRaw = cookieStore.get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language: Language = SUPPORTED_LANGUAGES.includes(langRaw as Language)
    ? (langRaw as Language)
    : "fr";
  const copy = COPY[language];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* ── Hero ── */}
        <section className="bg-white border-b border-gray-100 py-16 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-brand-200">
            <Star className="h-4 w-4" />
            Pricing
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{copy.headline}</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{copy.sub}</p>
        </section>

        {/* ── Plans ── */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.highlight
                    ? "border-brand-500 bg-brand-600 text-white shadow-xl shadow-brand-200"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow">
                      ⭐ {copy.mostPopular}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-3xl mb-1">{plan.emoji}</p>
                  <h2 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {plan.name[language]}
                  </h2>
                  <p className={`text-3xl font-extrabold mt-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {plan.price[language]}
                    {plan.key !== "client" && (
                      <span className={`text-base font-normal ml-1 ${plan.highlight ? "text-brand-100" : "text-gray-400"}`}>
                        {copy.monthly}
                      </span>
                    )}
                  </p>
                  <p className={`text-sm mt-2 ${plan.highlight ? "text-brand-100" : "text-gray-500"}`}>
                    {plan.desc[language]}
                  </p>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat.label.fr} className="flex items-start gap-2 text-sm">
                      {feat.included
                        ? <CheckCircle className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlight ? "text-green-300" : "text-green-500"}`} />
                        : <XCircle className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlight ? "text-brand-300" : "text-gray-300"}`} />
                      }
                      <span className={(() => {
                        if (feat.included) return plan.highlight ? "text-white" : "text-gray-700";
                        return plan.highlight ? "text-brand-200 line-through" : "text-gray-400 line-through";
                      })()}>
                        {feat.label[language]}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-white text-brand-700 hover:bg-brand-50"
                      : "bg-brand-600 hover:bg-brand-700 text-white"
                  }`}
                >
                  {copy[plan.ctaKey]}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{copy.faq}</h2>
          <div className="space-y-4">
            {copy.faqItems.map((item) => (
              <div key={item.q} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900 mb-1">{item.q}</p>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
