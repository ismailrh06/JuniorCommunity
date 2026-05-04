import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language } from "@/lib/i18n/translations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountInEuros: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amountInEuros);
}

function getLocale(language: Language): string {
  if (language === "en") return "en-US";
  if (language === "es") return "es-ES";
  return "fr-FR";
}

export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
  language: Language = "fr",
): string {
  return new Date(dateString).toLocaleDateString(getLocale(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function formatRelativeTime(
  dateString: string,
  language: Language = "fr",
): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const builders: Record<
    Language,
    {
      now: string;
      minutes: (value: number) => string;
      hours: (value: number) => string;
      days: (value: number) => string;
    }
  > = {
    fr: {
      now: "à l'instant",
      minutes: (value) => `il y a ${value} min`,
      hours: (value) => `il y a ${value}h`,
      days: (value) => `il y a ${value} j`,
    },
    en: {
      now: "just now",
      minutes: (value) => `${value} min ago`,
      hours: (value) => `${value}h ago`,
      days: (value) => `${value}d ago`,
    },
    es: {
      now: "ahora mismo",
      minutes: (value) => `hace ${value} min`,
      hours: (value) => `hace ${value} h`,
      days: (value) => `hace ${value} d`,
    },
  };

  const labels = builders[language];

  if (diffInSeconds < 60) return labels.now;
  if (diffInSeconds < 3600)
    return labels.minutes(Math.floor(diffInSeconds / 60));
  if (diffInSeconds < 86400)
    return labels.hours(Math.floor(diffInSeconds / 3600));
  if (diffInSeconds < 604800)
    return labels.days(Math.floor(diffInSeconds / 86400));
  return formatDate(dateString, undefined, language);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
