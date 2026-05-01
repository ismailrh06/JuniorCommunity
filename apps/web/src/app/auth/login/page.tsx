"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

const COPY: Record<Language, {
  subtitle: string;
  title: string;
  noAccount: string;
  createAccount: string;
}> = {
  fr: {
    subtitle: "Bon retour 👋",
    title: "Connexion",
    noAccount: "Pas encore de compte ?",
    createAccount: "Créer un compte",
  },
  en: {
    subtitle: "Welcome back 👋",
    title: "Login",
    noAccount: "No account yet?",
    createAccount: "Create an account",
  },
  es: {
    subtitle: "Qué bueno verte 👋",
    title: "Iniciar sesión",
    noAccount: "¿Aún no tienes cuenta?",
    createAccount: "Crear una cuenta",
  },
};

export default function LoginPage() {
  const { language } = useI18n();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-learn-50 flex items-center justify-center px-4">
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
            {copy.noAccount}{" "}
            <Link href="/auth/register" className="text-brand-600 font-medium hover:underline">
              {copy.createAccount}
            </Link>
          </p>

          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}
