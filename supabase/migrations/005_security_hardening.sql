-- ============================================================
-- JUNIORCODE — Migration 005: Security hardening
-- ============================================================

-- Keep SECURITY DEFINER functions from resolving objects through an attacker
-- controlled search path.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Never trust raw user metadata for privileged roles. Client-side signup may
-- request learner/student/client only; admin and mentor must be assigned later
-- by an existing admin or service role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role TEXT;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';

  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE
      WHEN requested_role IN ('learner', 'student', 'client') THEN requested_role
      ELSE 'learner'
    END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Stop normal users from changing their own role through the broad
-- "profiles: own update" policy.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role
     AND auth.role() <> 'service_role'
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change profile roles';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_role_escalation
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_escalation();

-- Make the existing owner update policy explicit for writes.
DROP POLICY IF EXISTS "profiles: own update" ON public.profiles;
CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: admin all" ON public.profiles;
CREATE POLICY "profiles: admin all"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "projects: admin all" ON public.projects;
CREATE POLICY "projects: admin all"
  ON public.projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "applications: admin all" ON public.applications;
CREATE POLICY "applications: admin all"
  ON public.applications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learner_profiles: admin all" ON public.learner_profiles;
CREATE POLICY "learner_profiles: admin all"
  ON public.learner_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Payments were missing RLS entirely.
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments: own read" ON public.payments;
CREATE POLICY "payments: own read"
  ON public.payments FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id OR public.is_admin());

DROP POLICY IF EXISTS "payments: admin all" ON public.payments;
CREATE POLICY "payments: admin all"
  ON public.payments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Basic financial integrity checks.
ALTER TABLE public.projects
  ADD CONSTRAINT projects_budget_non_negative
    CHECK (budget_min >= 0 AND budget_max >= 0) NOT VALID,
  ADD CONSTRAINT projects_budget_order
    CHECK (budget_max >= budget_min) NOT VALID,
  ADD CONSTRAINT projects_duration_positive
    CHECK (duration_days > 0) NOT VALID;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_budget_positive
    CHECK (proposed_budget > 0) NOT VALID,
  ADD CONSTRAINT applications_duration_positive
    CHECK (proposed_duration_days > 0) NOT VALID,
  ADD CONSTRAINT applications_cover_letter_length
    CHECK (char_length(cover_letter) BETWEEN 10 AND 5000) NOT VALID;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_amount_positive
    CHECK (amount > 0) NOT VALID,
  ADD CONSTRAINT payments_fee_non_negative
    CHECK (platform_fee >= 0) NOT VALID,
  ADD CONSTRAINT payments_fee_lte_amount
    CHECK (platform_fee <= amount) NOT VALID;

-- Secure RPC functions exposed to authenticated users.
CREATE OR REPLACE FUNCTION public.increment_xp(
  p_user_id UUID,
  p_xp INTEGER DEFAULT 10
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id is required';
  END IF;

  IF auth.role() <> 'service_role'
     AND auth.uid() IS DISTINCT FROM p_user_id
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Cannot increment XP for another user';
  END IF;

  IF p_xp < 0 OR p_xp > 1000 THEN
    RAISE EXCEPTION 'XP increment out of range';
  END IF;

  UPDATE public.learner_profiles
  SET
    xp_points = xp_points + p_xp,
    last_active_at = now(),
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last TIMESTAMPTZ;
  v_days INTEGER;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id is required';
  END IF;

  IF auth.role() <> 'service_role'
     AND auth.uid() IS DISTINCT FROM p_user_id
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Cannot update streak for another user';
  END IF;

  SELECT last_active_at, streak_days
  INTO v_last, v_days
  FROM public.learner_profiles
  WHERE user_id = p_user_id;

  IF v_last IS NOT NULL AND date_trunc('day', v_last) = date_trunc('day', now()) THEN
    RETURN;
  END IF;

  IF v_last IS NOT NULL AND date_trunc('day', v_last) = date_trunc('day', now()) - INTERVAL '1 day' THEN
    UPDATE public.learner_profiles
    SET streak_days = streak_days + 1, last_active_at = now(), updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public.learner_profiles
    SET streak_days = 1, last_active_at = now(), updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.track_event(
  p_event TEXT,
  p_properties JSONB DEFAULT '{}'::jsonb,
  p_session_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_event NOT IN (
    'signup',
    'path_started',
    'module_started',
    'module_completed',
    'project_applied',
    'page_view',
    'badge_earned'
  ) THEN
    RAISE EXCEPTION 'Invalid analytics event';
  END IF;

  IF octet_length(p_properties::text) > 8192 THEN
    RAISE EXCEPTION 'Analytics properties too large';
  END IF;

  INSERT INTO public.analytics_events (user_id, session_id, event, properties)
  VALUES (auth.uid(), left(p_session_id, 128), p_event, COALESCE(p_properties, '{}'::jsonb));
END;
$$;

REVOKE ALL ON FUNCTION public.increment_xp(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_streak(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.track_event(TEXT, JSONB, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.increment_xp(UUID, INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_streak(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.track_event(TEXT, JSONB, TEXT) TO authenticated, service_role;
