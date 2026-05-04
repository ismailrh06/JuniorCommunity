-- ============================================================
-- Gamified Learn progress
-- Stores mission/step/daily-challenge progress with text IDs
-- such as "html-basics" and "html-basics:0".
-- ============================================================

CREATE TABLE IF NOT EXISTS public.learning_progress_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id      TEXT NOT NULL,
  item_type    TEXT NOT NULL CHECK (item_type IN ('mission', 'step', 'daily')),
  status       TEXT NOT NULL DEFAULT 'completed'
               CHECK (status IN ('in_progress', 'completed')),
  xp_awarded   INTEGER NOT NULL DEFAULT 0,
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE public.learning_progress_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "learning_progress_items: own access"
  ON public.learning_progress_items;
CREATE POLICY "learning_progress_items: own access"
  ON public.learning_progress_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "learning_progress_items: admin all"
  ON public.learning_progress_items;
CREATE POLICY "learning_progress_items: admin all"
  ON public.learning_progress_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_learning_progress_items_user
  ON public.learning_progress_items(user_id);

CREATE INDEX IF NOT EXISTS idx_learning_progress_items_lookup
  ON public.learning_progress_items(user_id, item_type, status);
