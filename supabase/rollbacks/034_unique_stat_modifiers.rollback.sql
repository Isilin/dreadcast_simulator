-- Rollback de 034_unique_stat_modifiers.sql
-- Retire les contraintes d'unicite. Les doublons supprimes ne sont pas
-- recrees (c'etaient des copies identiques ; restaurer depuis backups/ au
-- besoin).
BEGIN;

ALTER TABLE item_effect DROP CONSTRAINT IF EXISTS item_effect_item_id_property_key;
ALTER TABLE item_prerequisite DROP CONSTRAINT IF EXISTS item_prerequisite_item_id_property_key;
ALTER TABLE kit_effect DROP CONSTRAINT IF EXISTS kit_effect_kit_id_property_key;
ALTER TABLE stat_modifier DROP CONSTRAINT IF EXISTS stat_modifier_drug_id_property_key;

COMMIT;
