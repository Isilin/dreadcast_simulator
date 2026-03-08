-- Table des effets d'items
CREATE TABLE IF NOT EXISTS item_effect (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value != 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_item_effect_item_id ON item_effect(item_id);
CREATE INDEX IF NOT EXISTS idx_item_effect_property ON item_effect(property);

-- Politique de sécurité (RLS)
ALTER TABLE item_effect ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read item_effect to authenticated users" ON item_effect
  FOR SELECT
  USING (true);
