-- Seed data pour les implants, leurs attributs et valeurs par niveau

-- Insertion des implants
INSERT INTO implant (id, name, level_max) VALUES
  (0, 'Génie', 10),
  (1, 'Réplicateur', 10),
  (2, 'Sain et sauf', 10),
  (3, 'Chameau', 10),
  (4, 'Monsieur Clone', 10),
  (5, 'Geek', 10),
  (6, 'Chanceux', 10),
  (7, 'Raciste', 5),
  (8, 'Urgentiste', 10),
  (9, 'Prestidigitateur', 10),
  (10, 'Flash Gordon', 2),
  (11, 'Inépuisable', 10),
  (12, 'Peau d''argent', 10),
  (13, 'Ingénieur', 10),
  (14, 'Brute', 10),
  (15, 'Rôdeur', 10),
  (16, 'Peau d''acier', 10),
  (17, 'La Main Bleue', 10),
  (18, 'Éclaireur', 10),
  (19, 'Je te vois', 10),
  (20, 'Scientifique', 10),
  (21, 'Économe', 10),
  (22, 'Félin', 10),
  (23, 'Aide de camp', 10),
  (24, 'Commando', 10),
  (25, 'Ninja', 9),
  (26, 'Polyvalent', 9),
  (27, 'Tireur d''élite', 9),
  (28, 'Oeil de lynx', 9),
  (29, 'Enragé', 9)
ON CONFLICT (id) DO NOTHING;

-- Insertion des attributs pour chaque implant
-- Geek
INSERT INTO implant_attribute (implant_id, attribute) VALUES (5, 'computing'::stat_property);

-- Raciste
INSERT INTO implant_attribute (implant_id, attribute) VALUES (7, 'raceDamage'::stat_property);

-- Urgentiste
INSERT INTO implant_attribute (implant_id, attribute) VALUES (8, 'medicine'::stat_property);

-- Prestidigitateur
INSERT INTO implant_attribute (implant_id, attribute) VALUES (9, 'agility'::stat_property);

-- Flash Gordon
INSERT INTO implant_attribute (implant_id, attribute) VALUES (10, 'speed'::stat_property);

-- Inépuisable
INSERT INTO implant_attribute (implant_id, attribute) VALUES (11, 'stamina'::stat_property);

-- Peau d'argent
INSERT INTO implant_attribute (implant_id, attribute) VALUES (12, 'robustness'::stat_property);

-- Ingénieur
INSERT INTO implant_attribute (implant_id, attribute) VALUES (13, 'engineering'::stat_property);

-- Brute
INSERT INTO implant_attribute (implant_id, attribute) VALUES (14, 'strength'::stat_property);

-- Rôdeur
INSERT INTO implant_attribute (implant_id, attribute) VALUES (15, 'stealth'::stat_property);

-- Peau d'acier
INSERT INTO implant_attribute (implant_id, attribute) VALUES (16, 'health'::stat_property);

-- Éclaireur
INSERT INTO implant_attribute (implant_id, attribute) VALUES (18, 'hitRating'::stat_property);

-- Je te vois
INSERT INTO implant_attribute (implant_id, attribute) VALUES (19, 'perception'::stat_property);

-- Scientifique (3 attributs)
INSERT INTO implant_attribute (implant_id, attribute) VALUES 
  (20, 'medicine'::stat_property),
  (20, 'computing'::stat_property),
  (20, 'engineering'::stat_property);

-- Félin (2 attributs)
INSERT INTO implant_attribute (implant_id, attribute) VALUES 
  (22, 'perception'::stat_property),
  (22, 'stealth'::stat_property);

-- Aide de camp
INSERT INTO implant_attribute (implant_id, attribute) VALUES (23, 'teamHeal'::stat_property);

-- Commando
INSERT INTO implant_attribute (implant_id, attribute) VALUES (24, 'criticalCacChance'::stat_property);

-- Ninja
INSERT INTO implant_attribute (implant_id, attribute) VALUES (25, 'cacDamage'::stat_property);

-- Polyvalent (8 attributs)
INSERT INTO implant_attribute (implant_id, attribute) VALUES 
  (26, 'strength'::stat_property),
  (26, 'agility'::stat_property),
  (26, 'robustness'::stat_property),
  (26, 'perception'::stat_property),
  (26, 'stealth'::stat_property),
  (26, 'computing'::stat_property),
  (26, 'medicine'::stat_property),
  (26, 'engineering'::stat_property);

-- Tireur d'élite
INSERT INTO implant_attribute (implant_id, attribute) VALUES (27, 'criticalHitDamage'::stat_property);

-- Oeil de lynx
INSERT INTO implant_attribute (implant_id, attribute) VALUES (28, 'hitDamages'::stat_property);

-- Enragé
INSERT INTO implant_attribute (implant_id, attribute) VALUES (29, 'criticalCacDamage'::stat_property);
