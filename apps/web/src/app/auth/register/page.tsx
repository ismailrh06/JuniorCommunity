"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

const COPY: Record<Language, {
  subtitle: string;
  title: string;
  alreadyRegistered: string;
  login: string;
  legalPrefix: string;
  terms: string;
  legalAnd: string;
  privacy: string;
}> = {
  fr: {
    subtitle: "Commence ton parcours 🚀",
    title: "Créer un compte",
    alreadyRegistered: "Déjà inscrit ?",
    login: "Se connecter",
    legalPrefix: "En créant un compte, tu acceptes nos",
    terms: "CGU",
    legalAnd: "et notre",
    privacy: "politique de confidentialité",
  },
  en: {
    subtitle: "Start your journey 🚀",
    title: "Create an account",
    alreadyRegistered: "Already registered?",
    login: "Sign in",
    legalPrefix: "By creating an account, you agree to our",
    terms: "Terms",
    legalAnd: "and our",
    privacy: "privacy policy",
  },
  es: {
    subtitle: "Empieza tu camino 🚀",
    title: "Crear una cuenta",
    alreadyRegistered: "¿Ya tienes cuenta?",
    login: "Iniciar sesión",
    legalPrefix: "Al crear una cuenta, aceptas nuestros",
    terms: "Términos",
    legalAnd: "y nuestra",
    privacy: "política de privacidad",
  },
};

export default function RegisterPage() {
  const { language } = useI18n();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-learn-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-gray-900 text-xl mb-2">
            <span className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold">
              JC
            </span>
            {" "}
            JuniorCode
          </Link>
          <p className="text-gray-500 text-sm mt-1">{copy.subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{copy.title}</h1>
          <p className="text-gray-500 text-sm mb-6">
            {copy.alreadyRegistered}{" "}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">
              {copy.login}
            </Link>
          </p>

          <AuthForm mode="register" />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {copy.legalPrefix}{" "}
          <Link href="/legal/terms" className="underline hover:text-gray-600">{copy.terms}</Link>
          {" "}{copy.legalAnd}{" "}
          <Link href="/legal/privacy" className="underline hover:text-gray-600">{copy.privacy}</Link>.
        </p>
      </div>
    </div>
  );
}
