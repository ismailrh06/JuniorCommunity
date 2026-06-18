import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { Toaster } from "@/components/ui/toaster";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/translations";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://junior-community.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s | JuniorCode",
    default: "JuniorCode — La fabrique de juniors employables",
  },
  description:
    "Apprends, pratique sur des projets réels et sois payé. La plateforme complète pour les développeurs juniors.",
  keywords: [
    "junior",
    "développeur",
    "apprentissage",
    "marketplace",
    "code",
    "stage",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "JuniorCode",
    images: [
      {
        url: "/brand/logo.png",
        width: 1024,
        height: 1024,
        alt: "JuniorCode",
      },
    ],
  },
  icons: {
    icon: "/brand/new_logo.png",
    apple: "/brand/new_logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const languageCookie = cookieStore
    .get("juniorcode-language")
    ?.value?.toLowerCase()
    .slice(0, 2);
  const language = SUPPORTED_LANGUAGES.includes(languageCookie as Language)
    ? (languageCookie as Language)
    : "fr";

  return (
    <html lang={language} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} premium-theme font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nProvider initialLanguage={language}>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
