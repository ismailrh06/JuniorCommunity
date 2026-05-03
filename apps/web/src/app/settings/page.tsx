"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Globe, Lock, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getMockUserBrowser, saveMockUser, type MockUser } from "@/lib/mock-auth";

const COPY = {
  fr: {
    title: "Paramètres",
    profileTab: "Profil",
    languageTab: "Langue",
    accountTab: "Compte",
    fullName: "Nom complet",
    email: "Email",
    bio: "Bio",
    githubUrl: "URL GitHub",
    portfolioUrl: "URL Portfolio",
    save: "Enregistrer les modifications",
    saved: "✅ Modifications enregistrées !",
    language: "Langue de l'interface",
    langFr: "Français",
    langEn: "English",
    langEs: "Español",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    changePassword: "Changer le mot de passe",
    passwordChanged: "✅ Mot de passe mis à jour !",
    dangerZone: "Zone de danger",
    deleteAccount: "Supprimer mon compte",
    deleteConfirm: "Êtes-vous sûr ? Cette action est irréversible.",
    loginRequired: "Connectez-vous pour accéder aux paramètres.",
    loginCta: "Se connecter",
    bioPlaceholder: "Décris-toi en quelques mots…",
    githubPlaceholder: "https://github.com/username",
    portfolioPlaceholder: "https://monportfolio.dev",
  },
  en: {
    title: "Settings",
    profileTab: "Profile",
    languageTab: "Language",
    accountTab: "Account",
    fullName: "Full name",
    email: "Email",
    bio: "Bio",
    githubUrl: "GitHub URL",
    portfolioUrl: "Portfolio URL",
    save: "Save changes",
    saved: "✅ Changes saved!",
    language: "Interface language",
    langFr: "Français",
    langEn: "English",
    langEs: "Español",
    currentPassword: "Current password",
    newPassword: "New password",
    changePassword: "Change password",
    passwordChanged: "✅ Password updated!",
    dangerZone: "Danger zone",
    deleteAccount: "Delete my account",
    deleteConfirm: "Are you sure? This action is irreversible.",
    loginRequired: "Please log in to access settings.",
    loginCta: "Log in",
    bioPlaceholder: "Describe yourself in a few words…",
    githubPlaceholder: "https://github.com/username",
    portfolioPlaceholder: "https://myportfolio.dev",
  },
  es: {
    title: "Configuración",
    profileTab: "Perfil",
    languageTab: "Idioma",
    accountTab: "Cuenta",
    fullName: "Nombre completo",
    email: "Email",
    bio: "Bio",
    githubUrl: "URL de GitHub",
    portfolioUrl: "URL de Portfolio",
    save: "Guardar cambios",
    saved: "✅ ¡Cambios guardados!",
    language: "Idioma de la interfaz",
    langFr: "Français",
    langEn: "English",
    langEs: "Español",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    changePassword: "Cambiar contraseña",
    passwordChanged: "✅ ¡Contraseña actualizada!",
    dangerZone: "Zona de peligro",
    deleteAccount: "Eliminar mi cuenta",
    deleteConfirm: "¿Estás seguro? Esta acción es irreversible.",
    loginRequired: "Inicia sesión para acceder a la configuración.",
    loginCta: "Iniciar sesión",
    bioPlaceholder: "Descríbete en pocas palabras…",
    githubPlaceholder: "https://github.com/usuario",
    portfolioPlaceholder: "https://miportfolio.dev",
  },
};

type Tab = "profile" | "language" | "account";
type Lang = "fr" | "en" | "es";

export default function SettingsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Lang>("fr");
  const copy = COPY[language] ?? COPY.fr;

  useEffect(() => {
    const lang = document.cookie
      .split("; ")
      .find((c) => c.startsWith("juniorcode-language="))
      ?.split("=")[1]
      ?.slice(0, 2) as Lang | undefined;
    if (lang && ["fr", "en", "es"].includes(lang)) setLanguage(lang);
  }, []);

  const [tab, setTab] = useState<Tab>("profile");
  const [user, setUser] = useState<MockUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const u = getMockUserBrowser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }
    setUser(u);
    setFullName(u.full_name);
  }, [router]);

  function handleSaveProfile() {
    if (!user) return;
    saveMockUser({ ...user, full_name: fullName } as MockUser);
    setUser((prev) => (prev ? { ...prev, full_name: fullName } : null));
    setSavedMsg(copy.saved);
    setTimeout(() => setSavedMsg(""), 3000);
  }

  function handleLangChange(lang: Lang) {
    document.cookie = `juniorcode-language=${lang};path=/;max-age=31536000`;
    globalThis.location.reload();
  }

  if (!user) return null;

  const tabs: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
    { key: "profile", label: copy.profileTab, icon: <User className="h-4 w-4" /> },
    { key: "language", label: copy.languageTab, icon: <Globe className="h-4 w-4" /> },
    { key: "account", label: copy.accountTab, icon: <Lock className="h-4 w-4" /> },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">{copy.title}</h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2 rounded-lg transition-colors ${
                  tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Profile tab ── */}
          {tab === "profile" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.fullName}</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.email}</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.bio}</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder={copy.bioPlaceholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.githubUrl}</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder={copy.githubPlaceholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.portfolioUrl}</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder={copy.portfolioPlaceholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50"
                />
              </div>

              {savedMsg && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  {savedMsg}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                <Save className="h-4 w-4" />
                {copy.save}
              </button>
            </div>
          )}

          {/* ── Language tab ── */}
          {tab === "language" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">{copy.language}</p>
              <div className="space-y-2">
                {(["fr", "en", "es"] as Lang[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLangChange(lang)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                      language === lang
                        ? "border-brand-500 bg-brand-50 text-brand-800"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>{({ fr: "🇫🇷 ", en: "🇬🇧 ", es: "🇪🇸 " } as Record<Lang, string>)[lang]}{copy[`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}` as "langFr" | "langEn" | "langEs"]}</span>
                    {language === lang && <span className="text-brand-500 text-xs font-bold">{"✓"} Actif</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Account tab ── */}
          {tab === "account" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.currentPassword}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPwd ? "text" : "password"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.newPassword}</label>
                  <div className="relative">
                    <input
                      type={showNewPwd ? "text" : "password"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Lock className="h-4 w-4" />
                  {copy.changePassword}
                </button>
              </div>

              <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                <h3 className="text-sm font-bold text-red-800 mb-3">{copy.dangerZone}</h3>
                {deleteConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm text-red-700">{copy.deleteConfirm}</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
                      >
                        {copy.deleteAccount}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(false)}
                        className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm transition-colors hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-2 text-red-700 hover:text-red-800 font-semibold text-sm transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    {copy.deleteAccount}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
