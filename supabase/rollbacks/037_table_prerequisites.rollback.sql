-- Rollback de 037_table_prerequisites.sql
-- A executer apres avoir redeploye une API qui ne lit plus ces tables :
-- sinon /api/items et /api/kits echouent.
BEGIN;

DROP TABLE IF EXISTS kit_prerequisite_implant;
DROP TABLE IF EXISTS kit_prerequisite_title;
DROP TABLE IF EXISTS kit_prerequisite;
DROP TABLE IF EXISTS item_prerequisite_implant;
DROP TABLE IF EXISTS item_prerequisite_title;

COMMIT;
