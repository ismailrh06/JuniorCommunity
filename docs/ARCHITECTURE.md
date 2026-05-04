# 🏗️ Architecture — JuniorCode

## Vue d'ensemble

```
JuniorCode/
├── apps/
│   └── web/                        → Application Next.js principale
│       ├── src/
│       │   ├── app/                → App Router (pages & layouts)
│       │   │   ├── layout.tsx      → Root layout (ThemeProvider, QueryProvider)
│       │   │   ├── page.tsx        → Landing page
│       │   │   ├── learn/
│       │   │   │   ├── page.tsx           → Liste des parcours
│       │   │   │   ├── [path]/page.tsx    → Curriculum d'un parcours
│       │   │   │   └── module/[id]/page.tsx → Contenu d'un module
│       │   │   ├── marketplace/
│       │   │   │   ├── page.tsx           → Liste des projets
│       │   │   │   └── [id]/page.tsx      → Détail d'un projet
│       │   │   ├── dashboard/
│       │   │   │   ├── page.tsx           → Dashboard apprenant
│       │   │   │   ├── applications/      → Mes candidatures
│       │   │   │   └── projects/          → Mes projets (client)
│       │   │   ├── profile/[id]/page.tsx  → Profil public
│       │   │   ├── auth/
│       │   │   │   ├── login/page.tsx
│       │   │   │   ├── register/page.tsx
│       │   │   │   └── callback/route.ts
│       │   │   └── admin/                 → Interface admin
│       │   ├── components/
│       │   │   ├── ui/                    → shadcn/ui components
│       │   │   ├── providers/             → React providers
│       │   │   ├── layout/                → Navbar, Footer, Sidebar
│       │   │   ├── learn/                 → Composants Learn spécifiques
│       │   │   ├── marketplace/           → Composants Marketplace
│       │   │   └── shared/                → Composants partagés
│       │   ├── hooks/                     → Custom React hooks
│       │   ├── lib/                       → Utilitaires
│       │   ├── store/                     → Zustand stores
│       │   └── types/                     → Types TypeScript
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── db/                         → Client Supabase + types DB
│   │   └── src/
│   │       ├── client.browser.ts   → Client côté navigateur
│   │       ├── client.server.ts    → Client côté serveur (RSC)
│   │       ├── database.types.ts   → Types auto-générés Supabase
│   │       └── index.ts
│   ├── ui/                         → Composants React partagés (shadcn/ui)
│   └── config/                     → Configs ESLint, TypeScript, Tailwind
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  → Schéma complet (tables + RLS + indexes)
│
└── docs/
    ├── ARCHITECTURE.md             → Ce fichier
    └── ROADMAP.md                  → Roadmap 90 jours
```

---

## 🔄 Flux utilisateur

### Flux Learn → Marketplace

```
Débutant arrive sur /learn
    ↓
Choisit un parcours (Web / Design / Data)
    ↓
Suit les modules (Niveau 1 → 4)
    ↓
Complète les exercices & projets
    ↓
Obtient badge "Verified Junior" 🟡
    ↓
Accès débloqué sur /marketplace
    ↓
Postule aux projets Junior Only
    ↓
Réalise le projet, est payé
    ↓
Reçoit avis → renforce son profil
```

---

## 🗄️ Modèle de données

### Tables principales

| Table              | Description                                         |
| ------------------ | --------------------------------------------------- |
| `profiles`         | Extension de auth.users — tous les utilisateurs     |
| `learner_profiles` | Données spécifiques apprenants (XP, streak, niveau) |
| `learning_paths`   | Parcours disponibles (Web, Design, Data)            |
| `lessons`          | Modules/leçons avec contenu MDX                     |
| `user_progress`    | Progression par leçon                               |
| `badges`           | Badges disponibles                                  |
| `user_badges`      | Badges obtenus par utilisateur                      |
| `projects`         | Projets marketplace                                 |
| `applications`     | Candidatures                                        |
| `reviews`          | Avis post-projet                                    |
| `payments`         | Paiements Stripe                                    |

---

## 🔐 Sécurité (RLS Supabase)

- **Profils** : lecture publique, modification uniquement par propriétaire
- **Projets** : lecture publique si status=open, modification par client uniquement
- **Candidatures** : accessible par applicant + client du projet
- **Progression** : accessible uniquement par l'utilisateur concerné
- **Paiements** : accessible par payer + payee uniquement

---

## 🌐 Routes API (Supabase Edge Functions)

| Route                             | Méthode | Description                         |
| --------------------------------- | ------- | ----------------------------------- |
| `/functions/v1/award-badge`       | POST    | Attribuer un badge à un utilisateur |
| `/functions/v1/complete-lesson`   | POST    | Marquer une leçon comme complétée   |
| `/functions/v1/create-payment`    | POST    | Initier un paiement Stripe          |
| `/functions/v1/send-notification` | POST    | Envoyer un email (Resend)           |

---

## 📦 Stack complète

| Couche          | Technologie              | Raison                          |
| --------------- | ------------------------ | ------------------------------- |
| Framework       | Next.js 14 (App Router)  | SSR, RSC, performance           |
| Language        | TypeScript               | Sécurité types, DX              |
| Styling         | Tailwind CSS + shadcn/ui | Rapidité, cohérence             |
| BaaS            | Supabase                 | Auth + DB + Storage + Realtime  |
| State           | Zustand                  | Simple, léger                   |
| Data Fetching   | TanStack Query           | Cache, mutations, optimistic UI |
| Formulaires     | React Hook Form + Zod    | Validation robuste              |
| Paiements       | Stripe                   | Standard industrie              |
| Emails          | Resend                   | Delivrabilité excellente        |
| Monorepo        | Turborepo                | Build cache, DX                 |
| Package Manager | pnpm                     | Performance, disk space         |
| Déploiement     | Vercel                   | Intégration Next.js parfaite    |
| CI/CD           | GitHub Actions           | Gratuit, intégré                |
| Tests           | Vitest + Playwright      | Unitaires + E2E                 |
