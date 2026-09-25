-- Rollback de 035_build_delete_policy.sql
BEGIN;

DROP POLICY IF EXISTS "Allow user delete own builds" ON build;

COMMIT;
