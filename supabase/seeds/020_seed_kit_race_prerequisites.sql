-- Kits exclusifs a une race : les kits a son nom, plus quelques kits
-- nommes autrement. Rejouable (ON CONFLICT). Requiert 038.
INSERT INTO kit_prerequisite_race (kit_id, race)
SELECT kit.id, exclusive.race::race_type
FROM kit
JOIN (VALUES
  -- Kits au nom de la race
  ('Androïde', 'Androide'),
  ('Gnoll', 'Gnoll'),
  ('Gobelin', 'Gobelin'),
  ('Kobold', 'Kobold'),
  ('Nain', 'Nain'),
  ('Orc', 'Orc'),
  ('Outrilien', 'Outrilien'),
  ('Troll', 'Troll'),
  ('Vautour', 'Vautour'),
  -- Kits exclusifs nommes autrement
  ('Eugéniste', 'Humain'),
  ('Elfique', 'Elfe'),
  ('De facture naine', 'Nain'),
  ('Carnassier', 'Gnoll'),
  ('Interfacé', 'Androide')
) AS exclusive (kit_name, race) ON kit.name = exclusive.kit_name
ON CONFLICT (kit_id, race) DO NOTHING;
