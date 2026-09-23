-- Rollback de 025_table_user_profile.sql
-- ATTENTION : supprime tous les pseudos.
BEGIN;

DROP FUNCTION IF EXISTS private.has_pseudo();
DROP TABLE IF EXISTS user_profile;

COMMIT;
