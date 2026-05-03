"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

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
    <AuthShell subtitle={copy.subtitle}>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{copy.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {copy.noAccount}{" "}
        <Link href="/auth/register" className="text-brand-600 font-medium hover:underline">
          {copy.createAccount}
        </Link>
      </p>

      <AuthForm mode="login" />
    </AuthShell>
  );
}
