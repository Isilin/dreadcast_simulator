-- Unicite des modificateurs de stats : (item_id, property) pour item_effect et
-- item_prerequisite, (kit_id, property) pour kit_effect, (drug_id, property)
-- pour stat_modifier.
-- Sans cle naturelle, le ON CONFLICT DO NOTHING des seeds ne se declenchait
-- jamais (seule la PK UUID generee etait unique) : chaque re-execution d'un
-- seed dupliquait ses lignes. Le seed des armes (010) passe deux fois le
-- 2026-03-08 a double 59 effets et 86 prerequis, et le simulateur
-- additionnait les effets en double.
-- Supprime les doublons (garde la ligne la plus ancienne, echoue si deux copies
-- ont des valeurs differentes) puis ajoute les contraintes. Rejouable.
BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM item_effect GROUP BY item_id, property HAVING count(DISTINCT value) > 1)
    OR EXISTS (SELECT 1 FROM item_prerequisite GROUP BY item_id, property HAVING count(DISTINCT value) > 1)
    OR EXISTS (SELECT 1 FROM kit_effect GROUP BY kit_id, property HAVING count(DISTINCT value) > 1)
    OR EXISTS (SELECT 1 FROM stat_modifier GROUP BY drug_id, property HAVING count(DISTINCT value) > 1)
  THEN
    RAISE EXCEPTION 'Doublons avec des valeurs differentes : choisir la bonne valeur a la main avant cette migration';
  END IF;
END $$;

DELETE FROM item_effect t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY item_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM item_effect
) d
WHERE t.id = d.id AND d.rn > 1;

DELETE FROM item_prerequisite t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY item_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM item_prerequisite
) d
WHERE t.id = d.id AND d.rn > 1;

DELETE FROM kit_effect t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY kit_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM kit_effect
) d
WHERE t.id = d.id AND d.rn > 1;

DELETE FROM stat_modifier t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY drug_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM stat_modifier
) d
WHERE t.id = d.id AND d.rn > 1;

-- Memes noms que les UNIQUE des schemas 003, 011, 012 et 014 (nom par defaut
-- de Postgres), pour qu'une base neuve et une base migree convergent.
ALTER TABLE item_effect DROP CONSTRAINT IF EXISTS item_effect_item_id_property_key;
ALTER TABLE item_effect
  ADD CONSTRAINT item_effect_item_id_property_key UNIQUE (item_id, property);

ALTER TABLE item_prerequisite DROP CONSTRAINT IF EXISTS item_prerequisite_item_id_property_key;
ALTER TABLE item_prerequisite
  ADD CONSTRAINT item_prerequisite_item_id_property_key UNIQUE (item_id, property);

ALTER TABLE kit_effect DROP CONSTRAINT IF EXISTS kit_effect_kit_id_property_key;
ALTER TABLE kit_effect
  ADD CONSTRAINT kit_effect_kit_id_property_key UNIQUE (kit_id, property);

ALTER TABLE stat_modifier DROP CONSTRAINT IF EXISTS stat_modifier_drug_id_property_key;
ALTER TABLE stat_modifier
  ADD CONSTRAINT stat_modifier_drug_id_property_key UNIQUE (drug_id, property);

COMMIT;
