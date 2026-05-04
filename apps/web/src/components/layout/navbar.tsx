"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Briefcase,
  LayoutDashboard,
  Menu,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";
import { getMockUserBrowser, clearMockUser, isMockMode } from "@/lib/mock-auth";

const LANGUAGE_LABELS: Record<Language, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
};

async function getBrowserSupabase() {
  const { getSupabaseBrowserClient } = await import("@juniorcode/db/browser");
  return getSupabaseBrowserClient();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const { language, setLanguage, messages } = useI18n();

  useEffect(() => {
    let alive = true;

    async function loadSession() {
      if (isMockMode()) {
        const user = getMockUserBrowser();
        if (!alive) return;
        setIsLoggedIn(!!user);
        setUserName(user?.full_name ?? "");
        setUserRole(user?.role ?? "");
        return;
      }

      const supabase = await getBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!alive) return;
      setIsLoggedIn(!!user);
      setUserName(
        (user?.user_metadata?.full_name as string | undefined) ??
          user?.email?.split("@")[0] ??
          "",
      );

      if (!user) {
        setUserRole("");
        return;
      }

      // Generated DB types can lag behind local Supabase migrations.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      const { data: profile } = (await db
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single()) as {
        data: { role?: string; full_name?: string | null } | null;
      };

      if (!alive) return;
      setUserRole(profile?.role ?? "");
      setUserName(profile?.full_name ?? user.email?.split("@")[0] ?? "");
    }

    loadSession();

    return () => {
      alive = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!isMockMode()) {
      let unsubscribe: (() => void) | undefined;

      getBrowserSupabase().then((supabase) => {
        const { data: listener } = supabase.auth.onAuthStateChange(() => {
          router.refresh();
        });
        unsubscribe = () => listener.subscription.unsubscribe();
      });

      return () => unsubscribe?.();
    }
  }, [router]);

  const handleLogout = async () => {
    if (isMockMode()) {
      clearMockUser();
    } else {
      const supabase = await getBrowserSupabase();
      await supabase.auth.signOut();
    }

    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    {
      href: "/learn",
      label: messages.nav.learn,
      icon: BookOpen,
      color: "text-learn-600",
    },
    {
      href: "/marketplace",
      label: messages.nav.marketplace,
      icon: Briefcase,
      color: "text-market-600",
    },
    {
      href: "/dashboard",
      label: messages.nav.dashboard,
      icon: LayoutDashboard,
      color: "text-brand-600",
    },
  ];
  const isAdmin = userRole === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-gray-900 text-lg"
        >
          <Image
            src="/brand/new_logo.png"
            alt="JuniorCode"
            width={100}
            height={100}
            priority
            className="rounded-xl object-contain"
          />
          JuniorCode
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? `bg-gray-100 ${color}`
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <div className="mr-2 flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold transition",
                  language === lang
                    ? "bg-brand-600 text-white"
                    : "text-gray-500 hover:bg-gray-100",
                )}
                aria-label={`${messages.nav.language} ${lang}`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-red-50 text-red-700"
                      : "text-gray-500 hover:text-red-700 hover:bg-red-50",
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand-600" />
                </div>
                {userName || messages.nav.profile}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {messages.nav.logout}
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {messages.nav.login}
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                {messages.nav.start}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <div className="mt-3 flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold transition",
                  language === lang
                    ? "bg-brand-600 text-white"
                    : "text-gray-500 hover:bg-gray-100",
                )}
                aria-label={`${messages.nav.language} ${lang}`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>

          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? `bg-gray-100 ${color}`
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-brand-600" />
                    {userName || messages.nav.profile}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {messages.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-center text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {messages.nav.login}
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-center text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors"
                  >
                    {messages.nav.start}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
