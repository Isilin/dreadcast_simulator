-- Durcissement des liens de partage — etape A (additive).
--
-- Avant : tout utilisateur connecte pouvait inserer ou repointer n'importe
-- quel shared_build, et la table (avec les snapshots et user_id des builds
-- partages) etait listable par tous via l'anon key.
--
-- Ordre de deploiement obligatoire :
--   1. cette etape A (les anciennes policies restent actives, rien ne casse)
--   2. deploiement de l'API qui lit via get_shared_build() et ecrit user_id
--   3. etape B (023b) qui supprime les anciennes policies permissives
BEGIN;

ALTER TABLE shared_build
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE shared_build sb
SET user_id = b.user_id
FROM build b
WHERE b.id = sb.build_id
  AND sb.user_id IS NULL;

ALTER TABLE shared_build ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE shared_build ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_shared_build_user_id ON shared_build(user_id);

-- Defense en profondeur : un visiteur non connecte n'ecrit jamais.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON shared_build FROM anon;

DROP POLICY IF EXISTS "Allow owner read shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow subscriber share own builds" ON shared_build;
DROP POLICY IF EXISTS "Allow subscriber update own shared builds" ON shared_build;

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

-- Lecture publique d'un partage par son identifiant uniquement. Le slot est
-- la position du build parmi ceux de son proprietaire (meme ordre que
-- api/builds). user_id n'est jamais renvoye.
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
