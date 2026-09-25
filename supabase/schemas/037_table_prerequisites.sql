-- Prerequis complets des equipements et des kits. Un prerequis est :
-- - une stat minimum (item_prerequisite existant, kit_prerequisite) ;
-- - un titre debloque (*_prerequisite_title) ;
-- - un implant installe, au moins un niveau (*_prerequisite_implant).
-- Tables additives : item_prerequisite et les seeds existants ne changent pas.
-- Requiert 036_table_title.sql.
BEGIN;

-- Equipements : titre debloque
CREATE TABLE IF NOT EXISTS item_prerequisite_title (
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  title_id TEXT NOT NULL REFERENCES title(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, title_id)
);
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_title_title_id
  ON item_prerequisite_title(title_id);

-- Equipements : implant installe
CREATE TABLE IF NOT EXISTS item_prerequisite_implant (
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, implant_id)
);
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_implant_implant_id
  ON item_prerequisite_implant(implant_id);

-- Kits : stat minimum (calque de item_prerequisite)
CREATE TABLE IF NOT EXISTS kit_prerequisite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT kit_prerequisite_valid_value CHECK (value > 0),
  CONSTRAINT kit_prerequisite_kit_id_property_key UNIQUE (kit_id, property)
);
CREATE INDEX IF NOT EXISTS idx_kit_prerequisite_property
  ON kit_prerequisite(property);

-- Kits : titre debloque
CREATE TABLE IF NOT EXISTS kit_prerequisite_title (
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  title_id TEXT NOT NULL REFERENCES title(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kit_id, title_id)
);
CREATE INDEX IF NOT EXISTS idx_kit_prerequisite_title_title_id
  ON kit_prerequisite_title(title_id);

-- Kits : implant installe
CREATE TABLE IF NOT EXISTS kit_prerequisite_implant (
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kit_id, implant_id)
);
CREATE INDEX IF NOT EXISTS idx_kit_prerequisite_implant_implant_id
  ON kit_prerequisite_implant(implant_id);

-- Politique de sécurité (RLS) : lecture publique, comme item_prerequisite
ALTER TABLE item_prerequisite_title ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prerequisite_implant ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite_title ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite_implant ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read item_prerequisite_title" ON item_prerequisite_title
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read item_prerequisite_implant" ON item_prerequisite_implant
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite" ON kit_prerequisite
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite_title" ON kit_prerequisite_title
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite_implant" ON kit_prerequisite_implant
  FOR SELECT
  USING (true);

COMMIT;
