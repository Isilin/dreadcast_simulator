-- Seed data pour les drugs et leurs modificateurs de stats

-- Insertion des drugs
INSERT INTO drug (id, name, image) VALUES
  ('0', 'Caducée', 'http://www.dreadcast.net/images/objets/caducee.png'),
  ('1', 'Condor', 'http://www.dreadcast.net/images/objets/condor.png'),
  ('2', 'Filias', 'http://www.dreadcast.net/images/objets/filias.png'),
  ('3', 'Pasorel', 'http://www.dreadcast.net/images/objets/pasorel.png'),
  ('4', 'Arkalion', 'http://www.dreadcast.net/images/objets/arkalion.png'),
  ('5', 'IR-2H', 'http://www.dreadcast.net/images/objets/ir2h.png'),
  ('6', 'Tartare', 'http://www.dreadcast.net/images/objets/tartare.png'),
  ('7', 'Oxylion', 'http://www.dreadcast.net/images/objets/oxylion.png'),
  ('8', 'Vulcain', 'http://www.dreadcast.net/images/objets/vulcain.png')
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
