-- Rollback de 023b_drop_legacy_shared_policies.sql
-- Restaure les policies d'origine (020). ATTENTION : rouvre la lecture
-- publique de tous les builds partages.
BEGIN;

DROP POLICY IF EXISTS "Allow public read shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow user insert own shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow user update own shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow public read shared snapshots" ON build;

CREATE POLICY "Allow public read shared builds" ON shared_build
  FOR SELECT
  USING (true);

CREATE POLICY "Allow user insert own shared builds" ON shared_build
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow user update own shared builds" ON shared_build
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public read shared snapshots" ON build
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM shared_build
      WHERE shared_build.build_id = build.id
    )
  );

COMMIT;
