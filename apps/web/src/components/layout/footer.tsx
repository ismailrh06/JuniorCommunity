"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Briefcase, GitBranch } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

type FooterSection = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export function Footer() {
  const { messages } = useI18n();

  const footerSections: FooterSection[] = [
    {
      title: messages.footer.sections.product,
      links: [
        { label: messages.footer.links.jcLearn, href: "/learn" },
        { label: messages.footer.links.marketplace, href: "/marketplace" },
        { label: messages.footer.links.pricing, href: "/pricing" },
        { label: messages.footer.links.roadmap, href: "/roadmap" },
      ],
    },
    {
      title: messages.footer.sections.learn,
      links: [
        { label: messages.footer.links.webDev, href: "/learn/web-developer" },
        { label: messages.footer.links.uiDesigner, href: "/learn/ui-designer" },
        {
          label: messages.footer.links.dataAnalyst,
          href: "/learn/data-analyst",
        },
        { label: messages.footer.links.allPaths, href: "/learn" },
      ],
    },
    {
      title: messages.footer.sections.business,
      links: [
        { label: messages.footer.links.postProject, href: "/marketplace/new" },
        { label: messages.footer.links.whyJuniorCode, href: "/for-clients" },
        { label: messages.footer.links.testimonials, href: "/testimonials" },
        { label: messages.footer.links.contact, href: "/contact" },
      ],
    },
    {
      title: messages.footer.sections.legal,
      links: [
        { label: messages.footer.links.terms, href: "/legal/terms" },
        { label: messages.footer.links.privacy, href: "/legal/privacy" },
        { label: messages.footer.links.cookies, href: "/legal/cookies" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,#070a10_0%,#05070b_100%)]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-slate-100 mb-4"
            >
              <Image
                src="/brand/new_logo.png"
                alt="JuniorCode"
                width={60}
                height={60}
                className="rounded-md object-contain"
              />
              JuniorCode
            </Link>
            <p className="text-sm leading-6 text-slate-500 mb-4">
              {messages.footer.tagline.split("\n")[0]}
              <br />
              {messages.footer.tagline.split("\n")[1]}
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/juniorcode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04] transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                aria-label="GitHub"
              >
                <span className="text-xs font-bold text-slate-400">GH</span>
              </a>
              <a
                href="https://twitter.com/juniorcode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04] transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                aria-label="Twitter / X"
              >
                <span className="text-xs font-bold text-slate-400">X</span>
              </a>
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-200 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <BookOpen className="h-4 w-4" />
            <span>
              © {new Date().getFullYear()} JuniorCode.{" "}
              {messages.footer.copyright}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <GitBranch className="h-3.5 w-3.5" />
            <span>{messages.footer.madeForJuniors}</span>
            <Briefcase className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
