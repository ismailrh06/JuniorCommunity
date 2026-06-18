"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type AuthShellProps = {
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ subtitle, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.82, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-18rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-orange-500/20 blur-3xl"
          animate={{
            x: [0, -28, 0],
            y: [0, 20, 0],
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[14%] left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, 24, 0], opacity: [0.35, 0.62, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]" />
      </div>

      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold text-white"
            >
              <Image
                src="/brand/new_logo.png"
                alt="JuniorCode"
                width={60}
                height={60}
                priority
                className="rounded-2xl object-contain"
              />
              JuniorCode
            </Link>
            <p className="mt-3 text-sm text-white/60">{subtitle}</p>
          </motion.div>

          <motion.div
            className="premium-auth-card rounded-[8px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
