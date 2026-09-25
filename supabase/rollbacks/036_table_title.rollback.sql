-- Rollback de 036_table_title.sql (apres le rollback de 037)
BEGIN;

DROP TABLE IF EXISTS title;

COMMIT;
