-- Rollback de 038_table_race_prerequisites.sql
-- A executer apres avoir redeploye une API qui ne lit plus ces tables :
-- sinon /api/items et /api/kits echouent.
BEGIN;

DROP TABLE IF EXISTS kit_prerequisite_race;
DROP TABLE IF EXISTS item_prerequisite_race;

COMMIT;
