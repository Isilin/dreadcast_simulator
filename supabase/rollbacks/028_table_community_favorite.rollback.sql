-- Rollback de 028_table_community_favorite.sql
-- Exige que 030 et 031 (qui lisent community_favorite) soient deja annules.
BEGIN;

DROP TABLE IF EXISTS community_favorite;

COMMIT;
