-- Table des prérequis d'items
CREATE TABLE IF NOT EXISTS item_prerequisite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value > 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_item_id ON item_prerequisite(item_id);
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_property ON item_prerequisite(property);

-- Politique de sécurité (RLS)
ALTER TABLE item_prerequisite ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read item_prerequisite to authenticated users" ON item_prerequisite
  FOR SELECT
  USING (true);
