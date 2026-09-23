-- Rollback de 032_index_community_content_author.sql
BEGIN;

DROP INDEX IF EXISTS idx_community_build_content_author;

COMMIT;
