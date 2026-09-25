-- Titres du jeu (debloques par le personnage). Un titre ne donne aucune stat :
-- il sert de prerequis a des equipements et des kits (037).
-- Table vide a la creation : les titres seront ajoutes par seed.
BEGIN;

CREATE TABLE IF NOT EXISTS title (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Politique de sécurité (RLS)
ALTER TABLE title ENABLE ROW LEVEL SECURITY;

-- Lecture publique, comme les autres catalogues (item, kit, implant)
CREATE POLICY "Allow read title to authenticated users" ON title
  FOR SELECT
  USING (true);

COMMIT;
