-- Table des valeurs par niveau d'implant
CREATE TABLE IF NOT EXISTS implant_value (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  value DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_level CHECK (level >= 1 AND level <= 10),
  UNIQUE(implant_id, level)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_implant_value_implant_id ON implant_value(implant_id);
CREATE INDEX IF NOT EXISTS idx_implant_value_level ON implant_value(level);

-- Politique de sécurité (RLS)
ALTER TABLE implant_value ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read implant_value to authenticated users" ON implant_value
  FOR SELECT
  USING (true);
