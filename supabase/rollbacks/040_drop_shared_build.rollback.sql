-- Rollback de 040_drop_shared_build.sql
-- Recree la structure de shared_build dans son etat 020 + 023a + 023b. Les
-- lignes sont a restaurer depuis la sauvegarde prise avant 040.
BEGIN;

CREATE TABLE IF NOT EXISTS shared_build (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  build_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_shared_build_build FOREIGN KEY (build_id)
    REFERENCES build(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_shared_build_per_build UNIQUE (build_id)
);

CREATE INDEX IF NOT EXISTS idx_shared_build_build_ref
  ON shared_build(build_id);
CREATE INDEX IF NOT EXISTS idx_shared_build_user_id
  ON shared_build(user_id);

ALTER TABLE shared_build ENABLE ROW LEVEL SECURITY;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON shared_build FROM anon;

CREATE POLICY "Allow owner read shared builds" ON shared_build
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Allow subscriber share own builds" ON shared_build
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND private.owns_build(build_id)
    AND (SELECT private.has_active_subscription())
  );

CREATE POLICY "Allow subscriber update own shared builds" ON shared_build
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND private.owns_build(build_id)
    AND (SELECT private.has_active_subscription())
  );

CREATE OR REPLACE FUNCTION public.get_shared_build(p_id UUID)
RETURNS TABLE (
  id UUID,
  slot INTEGER,
  snapshot JSONB,
  saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    sb.id,
    ranked.slot::INTEGER,
    ranked.snapshot,
    ranked.saved_at,
    sb.created_at
  FROM public.shared_build sb
  JOIN LATERAL (
    SELECT o.id, o.slot, o.snapshot, o.saved_at
    FROM (
      SELECT
        b.id,
        b.snapshot,
        b.saved_at,
        row_number() OVER (ORDER BY b.created_at ASC, b.id ASC) AS slot
      FROM public.build b
      WHERE b.user_id = sb.user_id
    ) o
    WHERE o.id = sb.build_id
  ) ranked ON true
  WHERE sb.id = p_id;
$$;

REVOKE ALL ON FUNCTION public.get_shared_build(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_build(UUID) TO anon, authenticated;

COMMIT;
