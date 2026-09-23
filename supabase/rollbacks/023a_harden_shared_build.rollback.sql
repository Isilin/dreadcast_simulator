-- Rollback de 023a_harden_shared_build.sql
-- Appliquer d'abord 023b_drop_legacy_shared_policies.rollback.sql, et
-- redeployer l'ancienne API (lecture directe des tables) avant ce script.
BEGIN;

DROP FUNCTION IF EXISTS public.get_shared_build(UUID);

DROP POLICY IF EXISTS "Allow subscriber update own shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow subscriber share own builds" ON shared_build;
DROP POLICY IF EXISTS "Allow owner read shared builds" ON shared_build;

DROP INDEX IF EXISTS idx_shared_build_user_id;

-- Droits par defaut de Supabase avant 023a.
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON shared_build TO anon;
ALTER TABLE shared_build DROP COLUMN IF EXISTS user_id;

COMMIT;
