-- Rollback de 026_table_community_build.sql
-- ATTENTION : supprime toutes les publications (et, en cascade, avis et favoris).
-- L'extension pg_trgm est conservee (elle peut servir ailleurs).
BEGIN;

DROP TABLE IF EXISTS community_build_content;
DROP TABLE IF EXISTS community_build;

COMMIT;
