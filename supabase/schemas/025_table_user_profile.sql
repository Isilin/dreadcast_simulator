-- Pseudo public du compte, affiche sur les publications et avis de la
-- Communaute. Choisi une fois, definitif (pas d'UPDATE ni de DELETE cote
-- utilisateur ; correction possible uniquement via l'editeur SQL).
BEGIN;

CREATE TABLE IF NOT EXISTS user_profile (
  user_id UUID PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Meme regle que src/feature/account/model/account.rules.ts
  CONSTRAINT valid_user_profile_pseudo CHECK (
    pseudo ~ '^[A-Za-zÀ-ÖØ-öø-ÿ0-9_.-]{3,24}$'
  ),
  CONSTRAINT reserved_user_profile_pseudo CHECK (
    lower(pseudo) NOT IN (
      'admin',
      'administrateur',
      'administrator',
      'anonyme',
      'dreadcast',
      'moderateur',
      'modérateur',
      'moderator',
      'modo',
      'root',
      'staff',
      'support',
      'system',
      'systeme',
      'système'
    )
    AND lower(pseudo) !~ '^(admin|mod[eé]rat)'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_pseudo_lower
  ON user_profile (lower(pseudo));

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read user profiles" ON user_profile;
DROP POLICY IF EXISTS "Allow user create own profile" ON user_profile;

CREATE POLICY "Allow authenticated read user profiles" ON user_profile
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow user create own profile" ON user_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE ALL ON user_profile FROM anon;
REVOKE UPDATE, DELETE, TRUNCATE ON user_profile FROM authenticated;

CREATE OR REPLACE FUNCTION private.has_pseudo()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profile up
    WHERE up.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.has_pseudo() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_pseudo() TO authenticated;

COMMIT;
