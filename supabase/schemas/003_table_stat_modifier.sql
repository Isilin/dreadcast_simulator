-- Table des modificateurs de stats pour les drugs
CREATE TABLE IF NOT EXISTS stat_modifier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id TEXT NOT NULL REFERENCES drug(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value != 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_stat_modifier_drug_id ON stat_modifier(drug_id);
CREATE INDEX IF NOT EXISTS idx_stat_modifier_property ON stat_modifier(property);

-- Politique de sécurité (RLS)
ALTER TABLE stat_modifier ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read stat_modifier to authenticated users" ON stat_modifier
  FOR SELECT
  USING (true);
