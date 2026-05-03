-- ============================================================
-- JUNIORCODE — Migration 003: Rôles, Contenu, Analytics
-- À exécuter dans : Supabase Dashboard → Database → SQL Editor
-- ============================================================

-- ── 1. Rôle mentor ─────────────────────────────────────────────
-- Étend le CHECK constraint de profiles.role pour inclure mentor

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('learner', 'student', 'client', 'admin', 'mentor'));

-- ── 2. required_badge_id sur les projets ───────────────────────
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS required_badge_id UUID REFERENCES public.badges(id);

-- ── 3. Table analytics_events ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT,                        -- anonymous session id
  event      TEXT        NOT NULL,        -- 'signup', 'module_started', 'module_completed', 'project_applied', 'path_started'
  properties JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event      ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_user       ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Tout utilisateur authentifié peut insérer ses propres events
CREATE POLICY "analytics: own insert"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Seul l'admin lit les analytics
CREATE POLICY "analytics: admin read"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── 4. RLS admin bypass (SECURITY DEFINER vue) ─────────────────
-- Les admins peuvent lire/modifier toutes les tables sans restrictions

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Profiles admin policy
DROP POLICY IF EXISTS "profiles: admin all" ON public.profiles;
CREATE POLICY "profiles: admin all"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Projects admin policy
DROP POLICY IF EXISTS "projects: admin all" ON public.projects;
CREATE POLICY "projects: admin all"
  ON public.projects FOR ALL
  USING (public.is_admin());

-- Applications admin policy
DROP POLICY IF EXISTS "applications: admin all" ON public.applications;
CREATE POLICY "applications: admin all"
  ON public.applications FOR ALL
  USING (public.is_admin());

-- Learner profiles admin policy
DROP POLICY IF EXISTS "learner_profiles: admin all" ON public.learner_profiles;
CREATE POLICY "learner_profiles: admin all"
  ON public.learner_profiles FOR ALL
  USING (public.is_admin());

-- ── 5. RLS mentor ──────────────────────────────────────────────
-- Les mentors peuvent lire les profils d'apprenants et leur progression

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_progress: mentor read" ON public.user_progress;
CREATE POLICY "user_progress: mentor read"
  ON public.user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mentor'
    )
  );

-- ── 6. Seed contenu cours — Web Developer ─────────────────────
-- Récupère l'id du path web-developer
DO $$
DECLARE
  v_web_path_id    UUID;
  v_design_path_id UUID;
  v_data_path_id   UUID;
  v_html_badge_id  UUID;
  v_git_badge_id   UUID;
  v_js_badge_id    UUID;
  v_proj_badge_id  UUID;
BEGIN
  SELECT id INTO v_web_path_id    FROM public.learning_paths WHERE slug = 'web-developer';
  SELECT id INTO v_design_path_id FROM public.learning_paths WHERE slug = 'ui-designer';
  SELECT id INTO v_data_path_id   FROM public.learning_paths WHERE slug = 'data-analyst';
  SELECT id INTO v_html_badge_id  FROM public.badges WHERE slug = 'html-basics';
  SELECT id INTO v_git_badge_id   FROM public.badges WHERE slug = 'git-ready';
  SELECT id INTO v_js_badge_id    FROM public.badges WHERE slug = 'js-starter';
  SELECT id INTO v_proj_badge_id  FROM public.badges WHERE slug = 'project-builder';

  -- ── Web Developer modules ──────────────────────────────────
  INSERT INTO public.lessons (path_id, title, description, type, order_index, duration_minutes, level, badge_id, is_premium) VALUES
    (v_web_path_id, 'Introduction au Web',
     'Comment fonctionne un navigateur, HTTP, DNS, le modèle client-serveur.',
     'lesson', 1, 20, 0, NULL, false),

    (v_web_path_id, 'HTML fondamentaux',
     'Structure d''une page HTML, balises sémantiques, formulaires, accessibilité.',
     'lesson', 2, 45, 0, NULL, false),

    (v_web_path_id, 'CSS de base',
     'Sélecteurs, boîte CSS, couleurs, typographie.',
     'lesson', 3, 45, 0, NULL, false),

    (v_web_path_id, 'Flexbox & Grid',
     'Mise en page moderne avec CSS Flexbox et CSS Grid.',
     'lesson', 4, 40, 1, NULL, false),

    (v_web_path_id, 'Projet HTML/CSS : Portfolio statique',
     'Crée et déploie ton premier portfolio avec uniquement HTML et CSS.',
     'project', 5, 90, 1, v_html_badge_id, false),

    (v_web_path_id, 'JavaScript fondamentaux',
     'Variables, types, fonctions, boucles, conditions, DOM manipulation.',
     'lesson', 6, 60, 1, NULL, false),

    (v_web_path_id, 'Git & GitHub',
     'Versionner son code, créer un repo, commits, branches, pull requests.',
     'lesson', 7, 40, 1, v_git_badge_id, false),

    (v_web_path_id, 'Fetch API & async/await',
     'Requêtes HTTP, Promises, async/await, gestion des erreurs.',
     'lesson', 8, 45, 2, NULL, false),

    (v_web_path_id, 'Introduction à React',
     'Composants, JSX, props, state, hooks useState et useEffect.',
     'lesson', 9, 60, 2, NULL, false),

    (v_web_path_id, 'Projet JS : Quiz interactif',
     'Application quiz complète avec score, minuteur et persistance localStorage.',
     'project', 10, 120, 2, v_js_badge_id, false),

    (v_web_path_id, 'Next.js & déploiement',
     'App Router, server components, API routes, déploiement Vercel.',
     'lesson', 11, 60, 3, NULL, true),

    (v_web_path_id, 'Projet final : Application complète',
     'Construis une app full-stack avec Next.js, Supabase et Tailwind. Obtiens ton badge Project Builder.',
     'project', 12, 180, 3, v_proj_badge_id, true)

  ON CONFLICT DO NOTHING;

  -- ── UI Designer modules ────────────────────────────────────
  INSERT INTO public.lessons (path_id, title, description, type, order_index, duration_minutes, level, is_premium) VALUES
    (v_design_path_id, 'Fondamentaux du design',
     'Principes : contraste, alignement, proximité, répétition. L''oeil du designer.',
     'lesson', 1, 30, 0, false),

    (v_design_path_id, 'Couleurs & typographie',
     'Roue chromatique, palettes harmonieuses, choix des polices, hiérarchie typographique.',
     'lesson', 2, 40, 0, false),

    (v_design_path_id, 'Introduction à Figma',
     'Interface, frames, composants, auto-layout, styles partagés.',
     'lesson', 3, 45, 1, false),

    (v_design_path_id, 'Wireframing & UX',
     'Low-fi wireframes, user flows, architecture d''information.',
     'lesson', 4, 50, 1, false),

    (v_design_path_id, 'Projet Figma : App mobile',
     'Maquette complète d''une app mobile (5 écrans minimum) avec design system.',
     'project', 5, 120, 2, false),

    (v_design_path_id, 'Design System & composants',
     'Créer un design system réutilisable avec tokens, composants et variantes.',
     'lesson', 6, 60, 2, true),

    (v_design_path_id, 'Prototype & handoff',
     'Prototype interactif Figma, préparer le handoff pour les développeurs.',
     'lesson', 7, 40, 2, true),

    (v_design_path_id, 'Projet final : Refonte d''une app existante',
     'Analyse UX, identification des problèmes, refonte complète avec documentation.',
     'project', 8, 180, 3, true)

  ON CONFLICT DO NOTHING;

  -- ── Data Analyst modules ───────────────────────────────────
  INSERT INTO public.lessons (path_id, title, description, type, order_index, duration_minutes, level, is_premium) VALUES
    (v_data_path_id, 'Python pour les données',
     'Variables, listes, dictionnaires, boucles, fonctions en Python.',
     'lesson', 1, 50, 0, false),

    (v_data_path_id, 'Jupyter Notebooks',
     'Environnement Jupyter, cellules, markdown, visualiser du code interactif.',
     'lesson', 2, 30, 0, false),

    (v_data_path_id, 'Pandas : manipulation de données',
     'DataFrames, lecture CSV, filtres, groupby, merge, valeurs manquantes.',
     'lesson', 3, 60, 1, false),

    (v_data_path_id, 'NumPy & statistiques descriptives',
     'Arrays NumPy, moyenne, médiane, écart-type, corrélation.',
     'lesson', 4, 45, 1, false),

    (v_data_path_id, 'Visualisation avec Matplotlib & Seaborn',
     'Graphiques en barres, lignes, scatter, heatmaps. Bonnes pratiques de dataviz.',
     'lesson', 5, 50, 1, false),

    (v_data_path_id, 'Projet : Analyse d''un dataset réel',
     'Analyse complète d''un jeu de données public (INSEE ou Kaggle) avec conclusions.',
     'project', 6, 120, 2, false),

    (v_data_path_id, 'SQL pour les data analysts',
     'Requêtes SELECT, WHERE, JOIN, GROUP BY, sous-requêtes.',
     'lesson', 7, 55, 2, true),

    (v_data_path_id, 'Streamlit : créer un dashboard',
     'Construire une app web data avec Streamlit et la déployer en ligne.',
     'lesson', 8, 60, 2, true),

    (v_data_path_id, 'Introduction au Machine Learning',
     'Régression linéaire, classification avec scikit-learn. Concepts clés.',
     'lesson', 9, 60, 3, true),

    (v_data_path_id, 'Projet final : Dashboard analytique',
     'Dashboard Streamlit + analyse ML sur données réelles, déployé sur Streamlit Cloud.',
     'project', 10, 180, 3, true)

  ON CONFLICT DO NOTHING;

  -- ── 7. Seed projets ouverts ────────────────────────────────
  -- On a besoin d'un client_id fictif (un profil admin)
  -- En prod, les vrais projets seront créés par des clients réels
  -- Pour le seed, on crée un profil "system" si besoin

  -- Note : ce seed est optionnel en prod, uniquement pour le dev local
  -- Les projets seront créés par de vrais clients via l'interface

END $$;

-- ── 8. Mettre à jour modules_count dans learning_paths ─────────
UPDATE public.learning_paths lp
SET modules_count = (
  SELECT COUNT(*) FROM public.lessons l WHERE l.path_id = lp.id
);

-- ── 9. Fonction RPC : track analytics event ────────────────────
CREATE OR REPLACE FUNCTION public.track_event(
  p_event      TEXT,
  p_properties JSONB    DEFAULT '{}'::jsonb,
  p_session_id TEXT     DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.analytics_events (user_id, session_id, event, properties)
  VALUES (auth.uid(), p_session_id, p_event, p_properties);
END;
$$;

-- ── 10. Vue analytics agrégée pour le dashboard admin ──────────
-- security_invoker garantit que la vue applique les règles RLS
-- de l'utilisateur qui interroge, et non celles du propriétaire.
CREATE OR REPLACE VIEW public.analytics_summary
WITH (security_invoker = true) AS
SELECT
  event,
  COUNT(*)                                    AS total,
  COUNT(DISTINCT user_id)                     AS unique_users,
  COUNT(*) FILTER (WHERE created_at >= now() - INTERVAL '7 days')  AS last_7d,
  COUNT(*) FILTER (WHERE created_at >= now() - INTERVAL '30 days') AS last_30d,
  DATE_TRUNC('day', created_at)               AS day
FROM public.analytics_events
GROUP BY event, DATE_TRUNC('day', created_at)
ORDER BY day DESC, total DESC;

-- Vue sécurisée (admin only)
ALTER VIEW public.analytics_summary OWNER TO postgres;
REVOKE ALL ON public.analytics_summary FROM PUBLIC;
GRANT SELECT ON public.analytics_summary TO authenticated;

-- ── 11. Index supplémentaires ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_lessons_path_order ON public.lessons(path_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_type       ON public.lessons(type);
CREATE INDEX IF NOT EXISTS idx_projects_badge     ON public.projects(required_badge_id);
