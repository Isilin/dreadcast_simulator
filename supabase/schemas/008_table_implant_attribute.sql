-- Table des attributs d'implants (relation many-to-many)
CREATE TABLE IF NOT EXISTS implant_attribute (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  attribute stat_property NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(implant_id, attribute)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_implant_attribute_implant_id ON implant_attribute(implant_id);

-- Politique de sécurité (RLS)
ALTER TABLE implant_attribute ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read implant_attribute to authenticated users" ON implant_attribute
  FOR SELECT
  USING (true);
