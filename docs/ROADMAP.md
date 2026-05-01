# 🗺️ ROADMAP — JuniorCode

> Stratégie de lancement en 3 phases sur 90 jours.

---

## 📅 Phase 1 — MVP Learn (Semaines 1–4)

**Objectif : lancer JuniorCode Learn avec les fondamentaux**

### Semaine 1 — Setup technique
- [x] Structure monorepo (Turborepo + pnpm)
- [ ] Setup Supabase (auth, DB, storage)
- [ ] Setup Next.js avec App Router
- [ ] CI/CD GitHub Actions → Vercel

### Semaine 2 — Auth & Profils
- [ ] Authentification (email + GitHub OAuth)
- [ ] Page profil apprenant
- [ ] Onboarding (choix de parcours + mini-test de niveau)
- [ ] Système de rôles (learner / student / client / admin)

### Semaine 3 — Curriculum Learn
- [ ] Page `/learn` — liste des parcours
- [ ] Page `/learn/[path]` — curriculum d'un parcours
- [ ] Page `/learn/module/[id]` — contenu d'un module (MDX)
- [ ] Système de progression (user_progress)

### Semaine 4 — Badges & Gamification
- [ ] Attribution de badges automatique
- [ ] Badge "Verified Junior" (débloque marketplace)
- [ ] Dashboard apprenant (progression + badges)
- [ ] Streak / XP points

---

## 📅 Phase 2 — MVP Marketplace (Semaines 5–8)

**Objectif : lancer la marketplace avec flux complet**

### Semaine 5 — Projets
- [ ] Page `/marketplace` — liste des projets
- [ ] Page `/marketplace/[id]` — détail projet
- [ ] Publication d'un projet (côté client)
- [ ] Filtres (catégorie, budget, Junior Only)

### Semaine 6 — Candidatures
- [ ] Formulaire de candidature
- [ ] Tableau de bord client (gestion candidatures)
- [ ] Tableau de bord étudiant (mes candidatures)
- [ ] Notifications email (Resend)

### Semaine 7 — Paiements
- [ ] Intégration Stripe (escrow simplifié)
- [ ] Factures automatiques
- [ ] Système de validation livraison

### Semaine 8 — Reviews & Polish
- [ ] Système d'avis (5 étoiles + commentaire)
- [ ] Profil public junior (portfolio + badges + avis)
- [ ] Optimisations SEO
- [ ] Tests E2E (Playwright)

---

## 📅 Phase 3 — Croissance (Semaines 9–12)

**Objectif : acquérir les premiers 100 utilisateurs**

### Semaine 9 — Premium & Monétisation
- [ ] Plan Free vs Premium (Learn)
- [ ] Abonnement Stripe (mensuel/annuel)
- [ ] Accès aux modules premium
- [ ] Mentorat / Review de projets (premium)

### Semaine 10 — Admin Dashboard
- [ ] Interface admin complète
- [ ] Modération projets et profils
- [ ] Analytiques (inscriptions, conversions)
- [ ] Gestion des badges manuels

### Semaine 11 — Landing & SEO
- [ ] Landing page principale (copywriting complet)
- [ ] Blog (contenu SEO)
- [ ] Page "Pour les clients" (B2B)
- [ ] Page "Pour les étudiants" (B2C)

### Semaine 12 — Lancement
- [ ] Beta privée (50 early adopters)
- [ ] Product Hunt launch
- [ ] Intégrations écoles / BDE
- [ ] Monitoring (Sentry + Vercel Analytics)

---

## 🏆 Métriques de succès (3 mois)

| Métrique | Objectif |
|----------|----------|
| Apprenants inscrits | 500 |
| Parcours complétés | 100 |
| Projets publiés | 50 |
| Candidatures soumises | 200 |
| Projets complétés | 20 |
| MRR (revenus récurrents) | 500€ |

---

## 💰 Modèle économique

### JuniorCode Learn
| Plan | Prix | Inclus |
|------|------|--------|
| Free | 0€ | 1 parcours, modules basiques |
| Premium | 19€/mois | Tous les parcours, reviews, badge Verified |
| Annuel | 149€/an | Premium × 12 mois (–34%) |

### JuniorCode Marketplace
| Source | Commission |
|--------|-----------|
| Commission projet | 10% du budget |
| Mise en avant projet | 29€ |
| Plan client Pro | 49€/mois |
