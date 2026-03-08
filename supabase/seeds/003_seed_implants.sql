-- Seed data pour les implants, leurs attributs et valeurs par niveau

-- Insertion des implants
INSERT INTO implant (name, level_max) VALUES
  ('Génie', 10),
  ('Réplicateur', 10),
  ('Sain et sauf', 10),
  ('Chameau', 10),
  ('Monsieur Clone', 10),
  ('Geek', 10),
  ('Chanceux', 10),
  ('Raciste', 5),
  ('Urgentiste', 10),
  ('Prestidigitateur', 10),
  ('Flash Gordon', 2),
  ('Inépuisable', 10),
  ('Peau d''argent', 10),
  ('Ingénieur', 10),
  ('Brute', 10),
  ('Rôdeur', 10),
  ('Peau d''acier', 10),
  ('La Main Bleue', 10),
  ('Éclaireur', 10),
  ('Je te vois', 10),
  ('Scientifique', 10),
  ('Économe', 10),
  ('Félin', 10),
  ('Aide de camp', 10),
  ('Commando', 10),
  ('Ninja', 9),
  ('Polyvalent', 9),
  ('Tireur d''élite', 9),
  ('Oeil de lynx', 9),
  ('Enragé', 9)
ON CONFLICT (name) DO NOTHING;

-- Insertion des attributs pour chaque implant
-- Geek
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Geek', 'computing'::stat_property);

-- Raciste
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Raciste', 'raceDamage'::stat_property);

-- Urgentiste
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Urgentiste', 'medicine'::stat_property);

-- Prestidigitateur
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Prestidigitateur', 'agility'::stat_property);

-- Flash Gordon
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Flash Gordon', 'speed'::stat_property);

-- Inépuisable
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Inépuisable', 'stamina'::stat_property);

-- Peau d'argent
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Peau d''argent', 'robustness'::stat_property);

-- Ingénieur
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Ingénieur', 'engineering'::stat_property);

-- Brute
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Brute', 'strength'::stat_property);

-- Rôdeur
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Rôdeur', 'stealth'::stat_property);

-- Peau d'acier
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Peau d''acier', 'health'::stat_property);

-- Éclaireur
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Éclaireur', 'hitRating'::stat_property);

-- Je te vois
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Je te vois', 'perception'::stat_property);

-- Scientifique (3 attributs)
INSERT INTO implant_attribute (implant_name, attribute) VALUES 
  ('Scientifique', 'medicine'::stat_property),
  ('Scientifique', 'computing'::stat_property),
  ('Scientifique', 'engineering'::stat_property);

-- Félin (2 attributs)
INSERT INTO implant_attribute (implant_name, attribute) VALUES 
  ('Félin', 'perception'::stat_property),
  ('Félin', 'stealth'::stat_property);

-- Aide de camp
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Aide de camp', 'teamHeal'::stat_property);

-- Commando
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Commando', 'criticalCacChance'::stat_property);

-- Ninja
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Ninja', 'cacDamage'::stat_property);

-- Polyvalent (8 attributs)
INSERT INTO implant_attribute (implant_name, attribute) VALUES 
  ('Polyvalent', 'strength'::stat_property),
  ('Polyvalent', 'agility'::stat_property),
  ('Polyvalent', 'robustness'::stat_property),
  ('Polyvalent', 'perception'::stat_property),
  ('Polyvalent', 'stealth'::stat_property),
  ('Polyvalent', 'computing'::stat_property),
  ('Polyvalent', 'medicine'::stat_property),
  ('Polyvalent', 'engineering'::stat_property);

-- Tireur d'élite
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Tireur d''élite', 'criticalHitDamage'::stat_property);

-- Oeil de lynx
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Oeil de lynx', 'hitDamages'::stat_property);

-- Enragé
INSERT INTO implant_attribute (implant_name, attribute) VALUES ('Enragé', 'criticalCacDamage'::stat_property);
