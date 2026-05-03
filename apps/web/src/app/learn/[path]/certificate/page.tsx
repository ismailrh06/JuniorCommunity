import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Award, Download, Share2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ path: string }> }>): Promise<Metadata> {
  const { path } = await params;
  return {
    title: `Certificat ${path} — JuniorCode`,
    description: `Félicitations pour avoir complété le parcours ${path} sur JuniorCode.`,
  };
}

// ─── Copy ─────────────────────────────────────────────────────────────────────
const COPY: Record<Language, {
  congrats: string;
  certifies: string;
  hasCompleted: string;
  badgeEarned: string;
  certifiedBy: string;
  issuedOn: string;
  shareProfile: string;
  downloadCert: string;
  nextStep: string;
  exploreMarketplace: string;
  continueLearning: string;
  shareTitle: string;
  notFound: string;
  notFoundDesc: string;
  backToLearn: string;
}> = {
  fr: {
    congrats: "🎉 Félicitations !",
    certifies: "JuniorCode certifie que",
    hasCompleted: "a complété avec succès le parcours",
    badgeEarned: "Badge obtenu",
    certifiedBy: "Certifié par JuniorCode",
    issuedOn: "Délivré le",
    shareProfile: "Partager mon profil",
    downloadCert: "Télécharger le certificat",
    nextStep: "Prochaine étape",
    exploreMarketplace: "Explorer les missions",
    continueLearning: "Continuer à apprendre",
    shareTitle: "Partager ce certificat",
    notFound: "Parcours introuvable",
    notFoundDesc: "Ce parcours n'existe pas sur JuniorCode.",
    backToLearn: "← Retour aux parcours",
  },
  en: {
    congrats: "🎉 Congratulations!",
    certifies: "JuniorCode certifies that",
    hasCompleted: "has successfully completed the",
    badgeEarned: "Badge earned",
    certifiedBy: "Certified by JuniorCode",
    issuedOn: "Issued on",
    shareProfile: "Share my profile",
    downloadCert: "Download certificate",
    nextStep: "Next step",
    exploreMarketplace: "Explore missions",
    continueLearning: "Continue learning",
    shareTitle: "Share this certificate",
    notFound: "Path not found",
    notFoundDesc: "This learning path does not exist on JuniorCode.",
    backToLearn: "← Back to paths",
  },
  es: {
    congrats: "🎉 ¡Felicitaciones!",
    certifies: "JuniorCode certifica que",
    hasCompleted: "ha completado exitosamente el camino",
    badgeEarned: "Insignia obtenida",
    certifiedBy: "Certificado por JuniorCode",
    issuedOn: "Emitido el",
    shareProfile: "Compartir mi perfil",
    downloadCert: "Descargar certificado",
    nextStep: "Próximo paso",
    exploreMarketplace: "Explorar misiones",
    continueLearning: "Seguir aprendiendo",
    shareTitle: "Compartir este certificado",
    notFound: "Camino no encontrado",
    notFoundDesc: "Este camino de aprendizaje no existe en JuniorCode.",
    backToLearn: "← Volver a los caminos",
  },
};

const PATHS: Record<string, {
  name: Record<Language, string>;
  emoji: string;
  badge: string;
  color: string;
  gradient: string;
}> = {
  "web-developer": {
    name: { fr: "Développeur Web", en: "Web Developer", es: "Desarrollador Web" },
    emoji: "🌐",
    badge: "🌐 Web Developer L1",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
  },
  "ui-designer": {
    name: { fr: "UI Designer", en: "UI Designer", es: "UI Designer" },
    emoji: "🎨",
    badge: "🎨 UI Designer L1",
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
  },
  "data-analyst": {
    name: { fr: "Data Analyst", en: "Data Analyst", es: "Data Analyst" },
    emoji: "📊",
    badge: "📊 Data Analyst L1",
    color: "orange",
    gradient: "from-orange-500 to-red-600",
  },
  "algorithms": {
    name: { fr: "Algorithmes & Logique", en: "Algorithms & Logic", es: "Algoritmos y Lógica" },
    emoji: "🧠",
    badge: "🧠 Algorithm Thinker",
    color: "green",
    gradient: "from-green-500 to-teal-600",
  },
};

export default async function CertificatePage({
  params,
}: Readonly<{ params: Promise<{ path: string }> }>) {
  const { path } = await params;
  const cookieStore = cookies();
  const langRaw = cookieStore.get("juniorcode-language")?.value?.toLowerCase().slice(0, 2);
  const language: Language = SUPPORTED_LANGUAGES.includes(langRaw as Language)
    ? (langRaw as Language)
    : "fr";
  const copy = COPY[language];

  // Read mock user from cookie
  let userName = "Apprenant JuniorCode";
  const userRaw = cookieStore.get("jc-mock-user")?.value;
  if (userRaw) {
    try {
      const user = JSON.parse(Buffer.from(userRaw, "base64").toString("utf-8")) as { full_name?: string };
      if (user.full_name) userName = user.full_name;
    } catch {
      // ignore — malformed cookie
    }
  }

  const pathData = PATHS[path] ?? null;
  const issuedDate = new Date().toLocaleDateString(
    { fr: "fr-FR", en: "en-GB", es: "es-ES" }[language],
  );
  const certId = `JC-${path.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            {copy.backToLearn}
          </Link>

          {pathData ? (
            <div className="space-y-6">
              {/* ── Certificate card ── */}
              <div className={`relative bg-gradient-to-br ${pathData.gradient} rounded-2xl p-8 text-white text-center shadow-xl overflow-hidden`}>
                {/* Decorative rings */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-6 left-6 w-32 h-32 rounded-full border-4 border-white" />
                  <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full border-4 border-white" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white" />
                </div>

                <div className="relative z-10">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <p className="text-sm font-semibold uppercase tracking-widest opacity-75 mb-1">
                    {copy.certifiedBy}
                  </p>
                  <h1 className="text-2xl font-extrabold mb-4">{copy.congrats}</h1>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 mb-4">
                    <p className="text-sm opacity-75 mb-1">{copy.certifies}</p>
                    <p className="text-2xl font-bold">{userName}</p>
                    <p className="text-sm opacity-75 mt-1">
                      {copy.hasCompleted}{" "}
                      <span className="font-semibold">{pathData.name[language]}</span>
                    </p>
                  </div>

                  <div className="text-3xl mb-3">{pathData.emoji}</div>
                  <p className="text-sm opacity-75">{copy.issuedOn} {issuedDate}</p>
                  <p className="text-xs opacity-50 mt-1 font-mono">{certId}</p>
                </div>
              </div>

              {/* ── Badge earned ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                  {pathData.badge.split(" ")[0]}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{copy.badgeEarned}</p>
                  <p className="text-base font-bold text-gray-900">{pathData.badge}</p>
                  <p className="text-sm text-gray-500">{copy.certifiedBy}</p>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                >
                  <Share2 className="h-4 w-4" />
                  {copy.shareTitle}
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-5 py-3 rounded-xl border border-gray-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  {copy.downloadCert}
                </button>
              </div>

              {/* ── Next steps ── */}
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
                <p className="text-sm font-bold text-brand-900 mb-3">{copy.nextStep}</p>
                <div className="space-y-2">
                  <Link
                    href="/marketplace"
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-200 hover:border-brand-400 transition-colors group"
                  >
                    <span className="text-sm font-semibold text-gray-800">{copy.exploreMarketplace}</span>
                    <ArrowRight className="h-4 w-4 text-brand-500 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/learn"
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-200 hover:border-brand-400 transition-colors group"
                  >
                    <span className="text-sm font-semibold text-gray-800">{copy.continueLearning}</span>
                    <ArrowRight className="h-4 w-4 text-brand-500 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🎓</p>
              <h1 className="text-xl font-bold text-gray-800">{copy.notFound}</h1>
              <p className="text-gray-500 mt-2">{copy.notFoundDesc}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
