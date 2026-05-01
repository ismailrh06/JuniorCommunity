"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@juniorcode/db";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Language } from "@/lib/i18n/translations";

// ── Schemas ────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
});

const registerSchema = z.object({
  full_name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
  role: z.enum(["learner", "student", "client"]),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthFormProps {
  readonly mode: "login" | "register";
}

type AuthCopy = {
  invalidEmail: string;
  min8Chars: string;
  min2Chars: string;
  wrongCredentials: string;
  divider: string;
  fullName: string;
  fullNamePlaceholder: string;
  roleLabel: string;
  roles: {
    learner: { label: string; desc: string };
    student: { label: string; desc: string };
    client: { label: string; desc: string };
  };
  email: string;
  emailPlaceholder: string;
  passwordLabel: string;
  hidePassword: string;
  showPassword: string;
  forgotPassword: string;
  submitLogin: string;
  submitRegister: string;
};

const AUTH_COPY: Record<Language, AuthCopy> = {
  fr: {
    invalidEmail: "Email invalide",
    min8Chars: "Minimum 8 caractères",
    min2Chars: "Minimum 2 caractères",
    wrongCredentials: "Email ou mot de passe incorrect.",
    divider: "ou",
    fullName: "Nom complet",
    fullNamePlaceholder: "Jean Dupont",
    roleLabel: "Je suis...",
    roles: {
      learner: { label: "🎓 Apprenant", desc: "Je débute" },
      student: { label: "👨‍💻 Étudiant", desc: "Je postule" },
      client: { label: "🏢 Client", desc: "Je recrute" },
    },
    email: "Email",
    emailPlaceholder: "jean@example.com",
    passwordLabel: "Mot de passe",
    hidePassword: "Masquer le mot de passe",
    showPassword: "Afficher le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    submitLogin: "Se connecter",
    submitRegister: "Créer mon compte",
  },
  en: {
    invalidEmail: "Invalid email",
    min8Chars: "Minimum 8 characters",
    min2Chars: "Minimum 2 characters",
    wrongCredentials: "Incorrect email or password.",
    divider: "or",
    fullName: "Full name",
    fullNamePlaceholder: "John Doe",
    roleLabel: "I am...",
    roles: {
      learner: { label: "🎓 Learner", desc: "I am starting" },
      student: { label: "👨‍💻 Student", desc: "I apply" },
      client: { label: "🏢 Client", desc: "I hire" },
    },
    email: "Email",
    emailPlaceholder: "john@example.com",
    passwordLabel: "Password",
    hidePassword: "Hide password",
    showPassword: "Show password",
    forgotPassword: "Forgot password?",
    submitLogin: "Sign in",
    submitRegister: "Create account",
  },
  es: {
    invalidEmail: "Correo inválido",
    min8Chars: "Mínimo 8 caracteres",
    min2Chars: "Mínimo 2 caracteres",
    wrongCredentials: "Correo o contraseña incorrectos.",
    divider: "o",
    fullName: "Nombre completo",
    fullNamePlaceholder: "Juan Pérez",
    roleLabel: "Soy...",
    roles: {
      learner: { label: "🎓 Aprendiz", desc: "Estoy empezando" },
      student: { label: "👨‍💻 Estudiante", desc: "Me postulo" },
      client: { label: "🏢 Cliente", desc: "Contrato" },
    },
    email: "Correo",
    emailPlaceholder: "juan@example.com",
    passwordLabel: "Contrase" + "ña",
    hidePassword: "Ocultar contraseña",
    showPassword: "Mostrar contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    submitLogin: "Iniciar sesión",
    submitRegister: "Crear cuenta",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const { language } = useI18n();
  const copy = AUTH_COPY[language];

  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // ── Login form ──────────────────────────────────────────
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(
      z.object({
        email: z.string().email(copy.invalidEmail),
        password: z.string().min(8, copy.min8Chars),
      })
    ),
  });

  // ── Register form ───────────────────────────────────────
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(
      z.object({
        full_name: z.string().min(2, copy.min2Chars),
        email: z.string().email(copy.invalidEmail),
        password: z.string().min(8, copy.min8Chars),
        role: z.enum(["learner", "student", "client"]),
      })
    ),
    defaultValues: { role: "learner" },
  });

  // ── Submit handlers ─────────────────────────────────────
  const onLoginSubmit = async (data: LoginForm) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setAuthError(copy.wrongCredentials);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const onRegisterSubmit = async (data: RegisterForm) => {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
        },
      },
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    router.push("/dashboard");
  };

  // ── OAuth ────────────────────────────────────────────────
  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${globalThis.location.origin}/auth/callback`,
      },
    });
  };

  const isLogin = mode === "login";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = (isLogin ? loginForm : registerForm) as any;
  const onSubmit = isLogin
    ? loginForm.handleSubmit(onLoginSubmit)
    : registerForm.handleSubmit(onRegisterSubmit);

  return (
    <div className="space-y-4">
      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          disabled={!!oauthLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {oauthLoading === "github" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Github className="h-4 w-4" />
          )}
          GitHub
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {oauthLoading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Google
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">{copy.divider}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Full name (register only) */}
        {mode === "register" && (
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1.5">
              {copy.fullName}
            </label>
            <input
              id="full_name"
              type="text"
              placeholder={copy.fullNamePlaceholder}
              {...registerForm.register("full_name")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
            {registerForm.formState.errors.full_name && (
              <p className="text-xs text-red-500 mt-1">
                {registerForm.formState.errors.full_name.message}
              </p>
            )}
          </div>
        )}

        {/* Role selector (register only) */}
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {copy.roleLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "learner", ...copy.roles.learner },
                { value: "student", ...copy.roles.student },
                { value: "client", ...copy.roles.client },
              ] as const).map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all text-center",
                    registerForm.watch("role") === option.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  )}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...registerForm.register("role")}
                  />
                  <span className="text-base">{option.label}</span>
                  <span className="text-xs mt-0.5 opacity-70">{option.desc}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            {copy.email}
          </label>
          <input
            id="email"
            type="email"
            placeholder={copy.emailPlaceholder}
              {...form.register("email")}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {form.formState.errors.email?.message as string}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            {copy.passwordLabel}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...form.register("password")}
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? copy.hidePassword : copy.showPassword}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {form.formState.errors.password?.message as string}
            </p>
          )}
        </div>

        {/* Forgot password (login only) */}
        {isLogin && (
          <div className="text-right">
            <a href="/auth/forgot-password" className="text-xs text-brand-600 hover:underline">
              {copy.forgotPassword}
            </a>
          </div>
        )}

        {/* Global error */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {authError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isLogin ? copy.submitLogin : copy.submitRegister}
        </button>
      </form>
    </div>
  );
}
