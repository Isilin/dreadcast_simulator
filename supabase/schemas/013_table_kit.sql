-- Table des kits
CREATE TABLE IF NOT EXISTS kit (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tech INTEGER NOT NULL,
  type item_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_tech CHECK (tech >= 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_kit_type ON kit(type);
CREATE INDEX IF NOT EXISTS idx_kit_tech ON kit(tech);

-- Politique de sécurité (RLS)
ALTER TABLE kit ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read kit to authenticated users" ON kit
  FOR SELECT
  USING (true);
