# 🚀 JuniorCode — Marketplace + Learn Platform

> **La fabrique de juniors employables.**
> Apprendre → Pratiquer → Être payé.

---

## 🧭 Vue d'ensemble

JuniorCode est un **écosystème complet** en deux piliers :

| Pilier | Description |
|--------|-------------|
| **JuniorCode Marketplace** | Mise en relation étudiants ↔ startups/assos pour des projets réels |
| **JuniorCode Learn** | Parcours d'apprentissage orienté action pour devenir un junior employable |

---

## 👥 Les 4 types d'utilisateurs

| Rôle | Description |
|------|-------------|
| 🎓 **Apprenant** | Débutant qui suit le parcours Learn |
| 👨‍💻 **Étudiant** | Junior qui postule à des projets marketplace |
| 🏢 **Client** | Startup / association qui publie des projets |
| 🛡️ **Admin** | Gestion de la plateforme |

---

## 🏗️ Architecture Monorepo (Turborepo)

```
JuniorCode/
├── apps/
│   ├── web/          → Frontend Next.js (marketplace + learn)
│   └── api/          → Backend Node.js / Fastify
├── packages/
│   ├── ui/           → Composants partagés (shadcn/ui)
│   ├── db/           → Client Supabase + types générés
│   └── config/       → ESLint, TypeScript, Tailwind configs
├── supabase/
│   └── migrations/   → Migrations SQL
└── docs/
    ├── ARCHITECTURE.md
    └── ROADMAP.md
```

---

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (composants)
- **Zustand** (state management)
- **React Query / TanStack Query** (data fetching)

### Backend
- **Supabase** (BaaS complet)
  - Auth (email, GitHub, Google OAuth)
  - PostgreSQL Database
  - Storage (fichiers, avatars)
  - Realtime (notifications)
  - Edge Functions (logique custom)

### Tooling
- **Turborepo** (monorepo)
- **pnpm** (package manager)
- **Vitest** (tests)
- **Playwright** (e2e)
- **ESLint + Prettier**

### Déploiement
- **Vercel** (frontend)
- **Supabase Cloud** (backend/db)
- **GitHub Actions** (CI/CD)

---

## 🚀 Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/<votre-pseudo>/juniorcommunity.git
cd juniorcommunity

# 2. Installer les dépendances
pnpm install

# 3. Variables d'environnement
cp .env.example .env.local
# Remplir les clés Supabase

# 4. Lancer en développement
pnpm dev
```

---

## 📦 Scripts disponibles

```bash
pnpm dev          # Lance tous les apps en dev
pnpm build        # Build de production
pnpm lint         # Linting
pnpm test         # Tests unitaires
pnpm test:e2e     # Tests end-to-end
```

---

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Schéma DB](supabase/migrations/)
