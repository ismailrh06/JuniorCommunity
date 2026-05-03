-- ============================================================
-- JUNIORCODE — Schéma base de données Supabase
-- Version: 1.0.0
-- ============================================================

-- ── Extensions ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: profiles (extension de auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'learner'
              CHECK (role IN ('learner', 'student', 'client', 'admin')),
  bio         TEXT,
  github_url  TEXT,
  portfolio_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on new user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABLE: badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE
              CHECK (slug IN ('html-basics', 'git-ready', 'js-starter', 'project-builder', 'verified-junior')),
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#3b82f6',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed badges
INSERT INTO public.badges (slug, name, description, icon, color) VALUES
  ('html-basics',      'HTML Basics',      'Maîtrise des bases HTML & CSS',           '🟢', '#22c55e'),
  ('git-ready',        'Git Ready',        'Versionning avec Git & GitHub',            '🔵', '#3b82f6'),
  ('js-starter',       'JS Starter',       'Fondamentaux JavaScript',                 '🟣', '#a855f7'),
  ('project-builder',  'Project Builder',  'Premier projet complet publié en ligne',  '🟠', '#f97316'),
  ('verified-junior',  'Verified Junior',  'Prêt pour la marketplace JuniorCode',     '🟡', '#eab308')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TABLE: user_badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id   UUID REFERENCES public.badges(id) NOT NULL,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- TABLE: learning_paths
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT NOT NULL UNIQUE,
  title              TEXT NOT NULL,
  description        TEXT,
  icon               TEXT,
  modules_count      INTEGER NOT NULL DEFAULT 0,
  estimated_duration TEXT,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed paths
INSERT INTO public.learning_paths (slug, title, description, icon, modules_count, estimated_duration) VALUES
  ('web-developer', 'Développeur Web',   'HTML, CSS, JavaScript, React. De zéro à ton premier projet live.', '💻', 12, '6-8 semaines'),
  ('ui-designer',   'Designer UI',       'Figma, principes design, création de maquettes et design systems.', '🎨', 8,  '4-5 semaines'),
  ('data-analyst',  'Data Analyst Junior','Python, pandas, visualisation de données, premiers dashboards.', '📊', 10, '5-6 semaines')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TABLE: lessons
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id          UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  content_mdx      TEXT,
  type             TEXT NOT NULL DEFAULT 'lesson'
                   CHECK (type IN ('lesson', 'exercise', 'project')),
  order_index      INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  level            SMALLINT NOT NULL DEFAULT 1 CHECK (level BETWEEN 0 AND 4),
  badge_id         UUID REFERENCES public.badges(id),
  is_premium       BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: learner_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learner_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_path_id UUID REFERENCES public.learning_paths(id),
  current_level   SMALLINT NOT NULL DEFAULT 0 CHECK (current_level BETWEEN 0 AND 4),
  xp_points       INTEGER NOT NULL DEFAULT 0,
  streak_days     INTEGER NOT NULL DEFAULT 0,
  last_active_at  TIMESTAMPTZ,
  is_premium      BOOLEAN NOT NULL DEFAULT false,
  ready_junior    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: user_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id    UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- TABLE: projects (marketplace)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'web'
               CHECK (category IN ('web', 'design', 'data', 'mobile', 'other')),
  difficulty   TEXT NOT NULL DEFAULT 'junior'
               CHECK (difficulty IN ('junior', 'intermediate', 'senior')),
  status       TEXT NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  budget_min   INTEGER NOT NULL DEFAULT 0,  -- en euros
  budget_max   INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 14,
  tags         TEXT[] DEFAULT '{}',
  junior_only  BOOLEAN NOT NULL DEFAULT false,
  is_sponsored BOOLEAN NOT NULL DEFAULT false,
  deadline     DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: applications (candidatures)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  applicant_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter          TEXT NOT NULL,
  proposed_budget       INTEGER NOT NULL,
  proposed_duration_days INTEGER NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'viewed', 'accepted', 'rejected', 'withdrawn')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, applicant_id)
);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
  reviewed_id UUID REFERENCES public.profiles(id) NOT NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, reviewer_id)
);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id                UUID REFERENCES public.projects(id) NOT NULL,
  payer_id                  UUID REFERENCES public.profiles(id) NOT NULL,
  payee_id                  UUID REFERENCES public.profiles(id) NOT NULL,
  amount                    INTEGER NOT NULL,         -- en centimes
  platform_fee              INTEGER NOT NULL DEFAULT 0,
  stripe_payment_intent_id  TEXT UNIQUE,
  status                    TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: public read"     ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles: own update"      ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- learner_profiles
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "learner_profiles: own read"   ON public.learner_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "learner_profiles: own update" ON public.learner_profiles FOR UPDATE USING (auth.uid() = user_id);

-- user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_progress: own access" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_badges: public read" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges: own read"    ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

-- projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects: public read open"   ON public.projects FOR SELECT USING (status = 'open' OR client_id = auth.uid());
CREATE POLICY "projects: client insert"      ON public.projects FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "projects: client update"      ON public.projects FOR UPDATE USING (auth.uid() = client_id);

-- applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications: own access"     ON public.applications FOR ALL USING (auth.uid() = applicant_id);
CREATE POLICY "applications: client read"    ON public.applications FOR SELECT USING (
  auth.uid() = (SELECT client_id FROM public.projects WHERE id = project_id)
);

-- reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews: public read"  ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews: own insert"   ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================================
-- INDEXES (performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_status          ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category        ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_junior_only     ON public.projects(junior_only);
CREATE INDEX IF NOT EXISTS idx_projects_created_at      ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_project_id  ON public.applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant   ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user       ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_path_level       ON public.lessons(path_id, level);
