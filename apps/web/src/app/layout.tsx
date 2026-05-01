import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | JuniorCode",
    default: "JuniorCode — La fabrique de juniors employables",
  },
  description:
    "Apprends, pratique sur des projets réels et sois payé. La plateforme complète pour les développeurs juniors.",
  keywords: ["junior", "développeur", "apprentissage", "marketplace", "code", "stage"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://juniorcode.fr",
    siteName: "JuniorCode",
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nProvider>
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
