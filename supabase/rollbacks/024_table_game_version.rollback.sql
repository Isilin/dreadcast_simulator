-- Rollback de 024_table_game_version.sql
-- Exige que 026 (community_build, qui reference game_version) soit deja annule.
BEGIN;

DROP FUNCTION IF EXISTS private.current_game_version();
DROP TABLE IF EXISTS game_version;

COMMIT;
