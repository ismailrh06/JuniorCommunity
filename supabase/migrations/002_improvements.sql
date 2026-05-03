-- ============================================================
-- JUNIORCODE — Migration 002: Améliorations schéma
-- À exécuter dans : Supabase Dashboard → Database → SQL Editor
-- ============================================================

-- ── 1. Fix handle_new_user : inclure le rôle depuis les métadonnées
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'learner')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ── 2. Auto-créer learner_profiles dès qu'un profil est créé
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_learner_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.learner_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_learner_profile();

-- ── 3. Colonnes onboarding dans learner_profiles
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE public.learner_profiles
  ADD COLUMN IF NOT EXISTS onboarding_goal   TEXT
    CHECK (onboarding_goal IN ('learn', 'mission', 'portfolio')),
  ADD COLUMN IF NOT EXISTS onboarding_level  TEXT
    CHECK (onboarding_level IN ('beginner', 'some', 'experienced')),
  ADD COLUMN IF NOT EXISTS onboarding_path   TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- ── 4. RLS : permettre à un utilisateur d'insérer son propre profil
-- ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "learner_profiles: own insert" ON public.learner_profiles;
CREATE POLICY "learner_profiles: own insert"
  ON public.learner_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── 5. RLS : user_progress — ajouter explicitement INSERT/UPDATE
-- ──────────────────────────────────────────────────────────────────
-- La politique "user_progress: own access" FOR ALL couvre déjà tout.
-- On s'assure juste qu'elle existe correctement :
DROP POLICY IF EXISTS "user_progress: own access" ON public.user_progress;
CREATE POLICY "user_progress: own access"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 6. Fonction RPC pour incrémenter les XP de façon atomique
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_xp(
  p_user_id  UUID,
  p_xp       INTEGER DEFAULT 10
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.learner_profiles
  SET
    xp_points      = xp_points + p_xp,
    last_active_at = now(),
    updated_at     = now()
  WHERE user_id = p_user_id;
END;
$$;

-- ── 7. Fonction RPC pour mettre à jour le streak quotidien
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_last TIMESTAMPTZ;
  v_days INTEGER;
BEGIN
  SELECT last_active_at, streak_days
  INTO v_last, v_days
  FROM public.learner_profiles
  WHERE user_id = p_user_id;

  -- Même jour → ne rien changer
  IF v_last IS NOT NULL AND date_trunc('day', v_last) = date_trunc('day', now()) THEN
    RETURN;
  END IF;

  -- Jour consécutif → +1
  IF v_last IS NOT NULL AND date_trunc('day', v_last) = date_trunc('day', now()) - INTERVAL '1 day' THEN
    UPDATE public.learner_profiles
    SET streak_days = streak_days + 1, last_active_at = now(), updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Rupture → reset à 1
    UPDATE public.learner_profiles
    SET streak_days = 1, last_active_at = now(), updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

-- ── 8. Index pour les requêtes fréquentes
-- ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_learner_profiles_user ON public.learner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status  ON public.user_progress(user_id, status);
