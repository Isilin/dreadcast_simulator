-- Seed data pour les drugs et leurs modificateurs de stats

-- Insertion des drugs
INSERT INTO drug (id, name, image) VALUES
  ('0', 'Caducée', '/assets/drugs/caducee.webp'),
  ('1', 'Condor', '/assets/drugs/condor.webp'),
  ('2', 'Filias', '/assets/drugs/filias.webp'),
  ('3', 'Pasorel', '/assets/drugs/pasorel.webp'),
  ('4', 'Arkalion', '/assets/drugs/arkalion.webp'),
  ('5', 'IR-2H', '/assets/drugs/ir2h.webp'),
  ('6', 'Tartare', '/assets/drugs/tartare.webp'),
  ('7', 'Oxylion', '/assets/drugs/oxylion.webp'),
  ('8', 'Vulcain', '/assets/drugs/vulcain.webp')
ON CONFLICT (id) DO NOTHING;

-- Insertion des modificateurs de stats pour Caducée
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('0', 'medicine'::stat_property, 20),
  ('0', 'perception'::stat_property, -60);

-- Insertion des modificateurs de stats pour Condor
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('1', 'computing'::stat_property, 20),
  ('1', 'robustness'::stat_property, -60);

-- Insertion des modificateurs de stats pour Filias
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('2', 'stealth'::stat_property, 20),
  ('2', 'perception'::stat_property, -60);

-- Insertion des modificateurs de stats pour Pasorel
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('3', 'stealth'::stat_property, 20),
  ('3', 'perception'::stat_property, -60);

-- Insertion des modificateurs de stats pour Arkalion
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('4', 'perception'::stat_property, 20),
  ('4', 'robustness'::stat_property, -60);

-- Insertion des modificateurs de stats pour IR-2H
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('5', 'strength'::stat_property, 20),
  ('5', 'robustness'::stat_property, -60);

-- Insertion des modificateurs de stats pour Tartare
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('6', 'robustness'::stat_property, 20),
  ('6', 'stealth'::stat_property, -60);

-- Insertion des modificateurs de stats pour Oxylion
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('7', 'agility'::stat_property, 15),
  ('7', 'perception'::stat_property, 15),
  ('7', 'computing'::stat_property, -60),
  ('7', 'medicine'::stat_property, -60),
  ('7', 'engineering'::stat_property, -60);

-- Insertion des modificateurs de stats pour Vulcain
INSERT INTO stat_modifier (drug_id, property, value) VALUES
  ('8', 'strength'::stat_property, 15),
  ('8', 'agility'::stat_property, 15),
  ('8', 'computing'::stat_property, -60),
  ('8', 'medicine'::stat_property, -60),
  ('8', 'engineering'::stat_property, -60);
