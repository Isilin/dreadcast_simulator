-- Prerequis de race des equipements et des kits (ex. les kits a son nom
-- sont exclusifs a une race). Plusieurs lignes pour un meme element se
-- lisent "une de ces races" : ce prerequis est rempli par l'une d'elles.
-- Requiert 037_table_prerequisites.sql.
BEGIN;

CREATE TABLE IF NOT EXISTS item_prerequisite_race (
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  race race_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, race)
);

CREATE TABLE IF NOT EXISTS kit_prerequisite_race (
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  race race_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kit_id, race)
);

-- Politique de sécurité (RLS) : lecture publique, comme les autres prerequis
ALTER TABLE item_prerequisite_race ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite_race ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read item_prerequisite_race" ON item_prerequisite_race
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite_race" ON kit_prerequisite_race
  FOR SELECT
  USING (true);

COMMIT;
