-- Table des items
CREATE TABLE IF NOT EXISTS item (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  tech INTEGER NOT NULL,
  integrity INTEGER NOT NULL,
  type item_type NOT NULL,
  min_damage INTEGER,
  max_damage INTEGER,
  damage_bonus INTEGER,
  hands INTEGER,
  reach INTEGER,
  hits_per_round INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_tech CHECK (tech >= 0),
  CONSTRAINT valid_integrity CHECK (integrity >= 0),
  CONSTRAINT valid_damage_bonus CHECK (damage_bonus IS NULL OR (damage_bonus >= 0 AND damage_bonus <= 5)),
  CONSTRAINT valid_hands CHECK (hands IS NULL OR hands IN (1, 2)),
  CONSTRAINT valid_reach CHECK (reach IS NULL OR reach >= 0),
  CONSTRAINT valid_hits_per_round CHECK (hits_per_round IS NULL OR hits_per_round > 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_item_type ON item(type);
CREATE INDEX IF NOT EXISTS idx_item_tech ON item(tech);

-- Politique de sécurité (RLS)
ALTER TABLE item ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read item to authenticated users" ON item
  FOR SELECT
  USING (true);
