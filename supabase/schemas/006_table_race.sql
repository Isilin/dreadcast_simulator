-- Table des races
CREATE TABLE IF NOT EXISTS race (
  type race_type PRIMARY KEY,
  strength INTEGER NOT NULL DEFAULT 100,
  agility INTEGER NOT NULL DEFAULT 100,
  robustness INTEGER NOT NULL DEFAULT 100,
  perception INTEGER NOT NULL DEFAULT 100,
  stealth INTEGER NOT NULL DEFAULT 100,
  computing INTEGER NOT NULL DEFAULT 100,
  medicine INTEGER NOT NULL DEFAULT 100,
  engineering INTEGER NOT NULL DEFAULT 100,
  health INTEGER NOT NULL DEFAULT 100,
  stamina INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Politique de sécurité (RLS)
ALTER TABLE race ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read race to authenticated users" ON race
  FOR SELECT
  USING (true);
