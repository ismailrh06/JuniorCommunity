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
    window.location.assign("/");
  };

  const navLinks = [
    { href: "/learn", label: messages.nav.learn, icon: BookOpen },
    { href: "/marketplace", label: messages.nav.marketplace, icon: Briefcase },
    { href: "/dashboard", label: messages.nav.dashboard, icon: LayoutDashboard },
  ];
  const isAdmin = userRole === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070a10]/86 shadow-[0_1px_0_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
            className="flex items-center gap-2 text-lg font-semibold text-slate-100"
        >
          <Image
            src="/brand/new_logo.png"
            alt="JuniorCode"
            width={100}
            height={100}
            priority
            className="rounded-md object-contain"
          />
          JuniorCode
        </Link>

        {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all",
                pathname.startsWith(href)
                  ? "bg-white/10 text-emerald-200 shadow-[0_8px_28px_rgba(0,0,0,0.22)]"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <div className="mr-2 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold transition",
                  language === lang
                    ? "bg-emerald-300 text-slate-950"
                    : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-200",
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
                    "flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-red-950/50 text-red-300"
                      : "text-slate-400 hover:bg-red-950/40 hover:text-red-300",
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06]">
                  <User className="h-4 w-4 text-emerald-200" />
                </div>
                {userName || messages.nav.profile}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-950/40 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                {messages.nav.logout}
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-[8px] px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
              >
                {messages.nav.login}
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 rounded-[8px] bg-gradient-to-r from-emerald-300 to-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_12px_35px_rgba(16,185,129,0.22)] transition hover:shadow-[0_16px_42px_rgba(34,211,238,0.2)]"
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
          className="rounded-[8px] p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100 md:hidden"
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
        <div className="border-t border-white/10 bg-[#070a10]/96 px-4 pb-4 backdrop-blur-xl md:hidden">
          <div className="mt-3 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold transition",
                  language === lang
                    ? "bg-emerald-300 text-slate-950"
                    : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-200",
                )}
                aria-label={`${messages.nav.language} ${lang}`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>

          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-[8px] px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-white/10 text-emerald-200"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-[8px] border border-red-900/60 px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/40"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-[8px] border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06]"
                  >
                    <User className="h-4 w-4 text-emerald-200" />
                    {userName || messages.nav.profile}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 rounded-[8px] border border-red-900/60 px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/40"
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
                    className="rounded-[8px] border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06]"
                  >
                    {messages.nav.login}
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-[8px] bg-gradient-to-r from-emerald-300 to-cyan-200 px-4 py-3 text-center text-sm font-semibold text-slate-950"
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
