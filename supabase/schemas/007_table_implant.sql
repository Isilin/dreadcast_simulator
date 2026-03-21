-- Table des implants
CREATE TABLE IF NOT EXISTS implant (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  level_max INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_implant_id CHECK (id >= 0),
  CONSTRAINT valid_level_max CHECK (level_max > 0 AND level_max <= 10)
);

-- Politique de sécurité (RLS)
ALTER TABLE implant ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read implant to authenticated users" ON implant
  FOR SELECT
  USING (true);
