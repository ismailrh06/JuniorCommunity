"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  SUPPORTED_LANGUAGES,
  translations,
  type Language,
} from "@/lib/i18n/translations";

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  messages: (typeof translations)[Language];
};

const I18nContext = createContext<I18nContextValue | null>(null);

const LANGUAGE_STORAGE_KEY = "juniorcode-language";
const LANGUAGE_COOKIE_KEY = "juniorcode-language";

function readLanguageCookie(): Language | null {
  if (typeof document === "undefined") return null;
  const pair = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${LANGUAGE_COOKIE_KEY}=`));

  if (!pair) return null;
  const raw = decodeURIComponent(pair.split("=")[1] ?? "");
  return normalizeLanguage(raw);
}

function persistLanguage(lang: Language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${encodeURIComponent(lang)}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = lang;
}

function normalizeLanguage(input: string | null | undefined): Language {
  if (!input) return "fr";
  const candidate = input.toLowerCase().slice(0, 2) as Language;
  return SUPPORTED_LANGUAGES.includes(candidate) ? candidate : "fr";
}

export function I18nProvider({
  children,
  initialLanguage = "fr",
}: {
  readonly children: React.ReactNode;
  readonly initialLanguage?: Language;
}) {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    const storedValue = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const cookieValue = readLanguageCookie();
    const next = storedValue
      ? normalizeLanguage(storedValue)
      : (cookieValue ?? normalizeLanguage(navigator.language));

    setLanguage(next);
    persistLanguage(next);

    if (cookieValue !== next) {
      router.refresh();
    }
  }, [router]);

  const changeLanguage = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      persistLanguage(lang);
      router.refresh();
    },
    [router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: changeLanguage,
      messages: translations[language],
    }),
    [changeLanguage, language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
