-- Table des effets de kits
CREATE TABLE IF NOT EXISTS kit_effect (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value != 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_kit_effect_kit_id ON kit_effect(kit_id);
CREATE INDEX IF NOT EXISTS idx_kit_effect_property ON kit_effect(property);

-- Politique de sécurité (RLS)
ALTER TABLE kit_effect ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read kit_effect to authenticated users" ON kit_effect
  FOR SELECT
  USING (true);
