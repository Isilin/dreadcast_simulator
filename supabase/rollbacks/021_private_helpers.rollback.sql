-- Rollback de 021_private_helpers.sql
-- A executer apres les rollbacks des scripts suivants (ordre inverse).
BEGIN;

DROP FUNCTION IF EXISTS private.owns_build(UUID);
DROP FUNCTION IF EXISTS private.has_active_subscription();
DROP FUNCTION IF EXISTS private.is_admin();
DROP FUNCTION IF EXISTS private.set_updated_at();
DROP SCHEMA IF EXISTS private;

COMMIT;
