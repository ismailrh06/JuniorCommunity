// ============================================================
// TYPES GLOBAUX — JuniorCode Platform
// ============================================================

// ── Rôles utilisateur ──────────────────────────────────────
export type UserRole = "learner" | "student" | "client" | "admin";

// ── Utilisateur ────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

// ── Badges ─────────────────────────────────────────────────
export type BadgeSlug =
  | "html-basics"
  | "git-ready"
  | "js-starter"
  | "project-builder"
  | "verified-junior";

export interface Badge {
  id: string;
  slug: BadgeSlug;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

// ── Parcours d'apprentissage ────────────────────────────────
export type LearningPathSlug = "web-developer" | "ui-designer" | "data-analyst";

export interface LearningPath {
  id: string;
  slug: LearningPathSlug;
  title: string;
  description: string;
  icon: string;
  modules_count: number;
  estimated_duration: string;
  is_active: boolean;
}

// ── Leçons ─────────────────────────────────────────────────
export type LessonType = "lesson" | "exercise" | "project";

export interface Lesson {
  id: string;
  path_id: string;
  title: string;
  description: string;
  content_mdx: string;
  type: LessonType;
  order_index: number;
  duration_minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
  badge_id?: string;
  is_premium: boolean;
  created_at: string;
}

// ── Progression apprenant ──────────────────────────────────
export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: ProgressStatus;
  started_at?: string;
  completed_at?: string;
  lesson?: Lesson;
}

// ── Projets marketplace ────────────────────────────────────
export type ProjectCategory = "web" | "design" | "data" | "mobile" | "other";
export type ProjectStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";
export type ProjectDifficulty = "junior" | "intermediate" | "senior";

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  status: ProjectStatus;
  budget_min: number;
  budget_max: number;
  duration_days: number;
  tags: string[];
  junior_only: boolean;
  is_sponsored: boolean;
  deadline?: string;
  created_at: string;
  updated_at: string;
  client?: User;
}

// ── Candidatures ───────────────────────────────────────────
export type ApplicationStatus =
  | "pending"
  | "viewed"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  project_id: string;
  applicant_id: string;
  cover_letter: string;
  proposed_budget: number;
  proposed_duration_days: number;
  status: ApplicationStatus;
  created_at: string;
  project?: Project;
  applicant?: User;
}

// ── Profil Learn ───────────────────────────────────────────
export interface LearnerProfile {
  id: string;
  user_id: string;
  current_path_id?: string;
  current_level: 0 | 1 | 2 | 3 | 4;
  xp_points: number;
  streak_days: number;
  is_premium: boolean;
  ready_junior: boolean; // Badge Verified Junior obtenu
  created_at: string;
}

// ── Avis / Reviews ─────────────────────────────────────────
export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  created_at: string;
}

// ── Paiements ──────────────────────────────────────────────
export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  project_id: string;
  payer_id: string;
  payee_id: string;
  amount: number; // en centimes
  platform_fee: number;
  stripe_payment_intent_id: string;
  status: PaymentStatus;
  created_at: string;
}

// ── API Responses ──────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
