-- Seed data pour les races

INSERT INTO race (type, strength, agility, robustness, perception, stealth, computing, medicine, engineering, health, stamina) VALUES
  ('Humain'::race_type, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100),
  ('Elfe'::race_type, 60, 120, 70, 130, 110, 100, 100, 100, 100, 100),
  ('Nain'::race_type, 125, 100, 115, 75, 75, 100, 100, 100, 115, 80),
  ('Orc'::race_type, 150, 75, 125, 100, 75, 60, 100, 90, 120, 105),
  ('Troll'::race_type, 125, 80, 150, 100, 75, 65, 90, 90, 110, 110),
  ('Outrilien'::race_type, 80, 110, 100, 100, 100, 85, 150, 95, 90, 90),
  ('Vautour'::race_type, 100, 100, 90, 100, 90, 150, 85, 95, 80, 100),
  ('Gobelin'::race_type, 65, 120, 70, 100, 95, 90, 90, 150, 90, 150),
  ('Kobold'::race_type, 75, 135, 90, 115, 125, 60, 100, 100, 100, 100),
  ('Gnoll'::race_type, 120, 120, 90, 110, 90, 80, 80, 100, 120, 90),
  ('Androide'::race_type, 105, 95, 105, 100, 80, 120, 80, 105, 110, 110)
ON CONFLICT (type) DO NOTHING;
