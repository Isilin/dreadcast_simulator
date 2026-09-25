-- Seed data pour les items de type weapons

-- Insertion des items
INSERT INTO item (id, name, image, tech, integrity, type, min_heal, max_heal, damage_bonus, hands, reach, hits_per_round) VALUES
  ('606', 'Cobra F-750', '/assets/items/Cobra_F-750.webp', 100, 40, '2handsMelee'::item_type, 50, 150, NULL, 2, 9, 1)

ON CONFLICT (id) DO NOTHING;

-- Insertion des prérequis
INSERT INTO item_prerequisite (item_id, property, value) VALUES
  ('606', 'medicine'::stat_property, 150)
ON CONFLICT (item_id, property) DO NOTHING;

-- Insertion des effets
-- INSERT INTO item_effect (item_id, property, value) VALUES
--   ('500', 'medicine'::stat_property, 10),
-- ON CONFLICT (item_id, property) DO NOTHING;


INSERT INTO kit (id, name, tech, type) VALUES
  ('232', 'du Libérateur', 90, 'head'::item_type),
  ('233', 'des Sentinelles', 90, 'head'::item_type),
  ('234', 'des Bas-fonds', 90, 'head'::item_type),
  ('235', 'du Nettoyeur', 90, 'head'::item_type),
  ('32', 'du Libérateur', 90, 'chest'::item_type),
  ('33', 'des Sentinelles', 90, 'chest'::item_type),
  ('34', 'des Bas-fonds', 90, 'chest'::item_type),
  ('35', 'du Nettoyeur', 90, 'chest'::item_type),
  ('332', 'du Libérateur', 90, 'legs'::item_type),
  ('333', 'des Sentinelles', 90, 'legs'::item_type),
  ('334', 'des Bas-fonds', 90, 'legs'::item_type),
  ('335', 'du Nettoyeur', 90, 'legs'::item_type),
  ('132', 'du Libérateur', 90, 'feet'::item_type),
  ('133', 'des Sentinelles', 90, 'feet'::item_type),
  ('134', 'des Bas-fonds', 90, 'feet'::item_type),
  ('135', 'du Nettoyeur', 90, 'feet'::item_type),
  ('432', 'du Libérateur', 60, 'secondary'::item_type),
  ('433', 'des Sentinelles', 60, 'secondary'::item_type),
  ('434', 'des Bas-fonds', 60, 'secondary'::item_type),
  ('435', 'du Nettoyeur', 60, 'secondary'::item_type)
ON CONFLICT DO NOTHING;

INSERT INTO kit_effect (kit_id, property, value) VALUES
  ('232', 'strength'::stat_property, 7),
  ('232', 'agility'::stat_property, 2),
  ('232', 'robustness'::stat_property, -2),
  ('32', 'strength'::stat_property, 6),
  ('32', 'agility'::stat_property, 2),
  ('32', 'robustness'::stat_property, -2),
  ('332', 'strength'::stat_property, 6),
  ('332', 'agility'::stat_property, 2),
  ('332', 'robustness'::stat_property, -2),
  ('132', 'strength'::stat_property, 6),
  ('132', 'agility'::stat_property, 2),
  ('132', 'robustness'::stat_property, -2),
  ('432', 'strength'::stat_property, 3),
  ('432', 'agility'::stat_property, 2),
  ('233', 'perception'::stat_property, 6),
  ('233', 'agility'::stat_property, 2),
  ('233', 'robustness'::stat_property, -2),
  ('33', 'perception'::stat_property, 6),
  ('33', 'agility'::stat_property, 2),
  ('33', 'robustness'::stat_property, -2),
  ('333', 'perception'::stat_property, 6),
  ('333', 'agility'::stat_property, 2),
  ('333', 'robustness'::stat_property, -2),
  ('133', 'perception'::stat_property, 6),
  ('133', 'agility'::stat_property, 2),
  ('133', 'robustness'::stat_property, -2),
  ('433', 'perception'::stat_property, 2),
  ('433', 'agility'::stat_property, 3),
  ('234', 'strength'::stat_property, 7),
  ('234', 'agility'::stat_property, 2),
  ('234', 'robustness'::stat_property, -3),
  ('34', 'strength'::stat_property, 6),
  ('34', 'agility'::stat_property, 2),
  ('34', 'robustness'::stat_property, -3),
  ('334', 'strength'::stat_property, 6),
  ('334', 'agility'::stat_property, 2),
  ('334', 'robustness'::stat_property, -3),
  ('134', 'strength'::stat_property, 6),
  ('134', 'agility'::stat_property, 2),
  ('134', 'robustness'::stat_property, -3),
  ('434', 'strength'::stat_property, 3),
  ('434', 'agility'::stat_property, 2),
  ('235', 'perception'::stat_property, 6),
  ('235', 'agility'::stat_property, 2),
  ('235', 'robustness'::stat_property, -3),
  ('35', 'perception'::stat_property, 6),
  ('35', 'agility'::stat_property, 2),
  ('35', 'robustness'::stat_property, -3),
  ('335', 'perception'::stat_property, 6),
  ('335', 'agility'::stat_property, 2),
  ('335', 'robustness'::stat_property, -3),
  ('135', 'perception'::stat_property, 6),
  ('135', 'agility'::stat_property, 2),
  ('135', 'robustness'::stat_property, -3),
  ('435', 'perception'::stat_property, 2),
  ('435', 'agility'::stat_property, 3)
ON CONFLICT (kit_id, property) DO NOTHING;

-- Renommage du kit "À canon lourd" en "instable" (id 539)
UPDATE kit SET name = 'instable' WHERE id = '539';

-- Ajout de +380 PV à toutes les races
UPDATE race
SET health = health + 380;

-- Ajustement des dégâts du Gant Hydro (armes)
UPDATE item
SET min_damage = 19,
    max_damage = 35
WHERE id = '506';

-- Ajustement des dégâts de la batte
UPDATE item
SET tech = 180
WHERE id = '534';

-- Ajustement des dégâts des Poings américains
UPDATE item
SET tech = 180
WHERE id = '503';

-- Ajustement des dégâts des Bouclier
UPDATE item
SET min_damage = 23,
    max_damage = 33
WHERE id = '532';

-- Ajustement des dégâts des Boucliers énergétiques
UPDATE item
SET min_damage = 25,
    max_damage = 35
WHERE id = '533';

-- Ajustement des dégâts des tronçolame
UPDATE item
SET min_damage = 37,
    max_damage = 69
WHERE id = '548';

-- Ajustement des dégâts des épées énergétiques
UPDATE item
SET min_damage = 42,
    max_damage = 80
WHERE id = '524';

-- Ajustement des dégâts des wolfers
UPDATE item
SET min_damage = 24,
    max_damage = 80
WHERE id = '510';

-- Ajustement des arbalètes automatique
UPDATE item
SET min_damage = 11,
    max_damage = 29
WHERE id = '581';