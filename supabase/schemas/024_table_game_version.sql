-- Versions du jeu. Chaque publication de la Communaute est rattachee a la
-- version courante au moment de sa publication ou de sa mise a jour.
--
-- Passage a une nouvelle version :
--   UPDATE game_version SET is_current = false WHERE is_current;
--   INSERT INTO game_version (code, label, released_at, is_current)
--   VALUES ('v16', 'Version 16', CURRENT_DATE, true);
BEGIN;

CREATE TABLE IF NOT EXISTS game_version (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  released_at DATE NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_game_version_code CHECK (code ~ '^[a-z0-9._-]{1,16}$')
);

-- Une seule version courante.
CREATE UNIQUE INDEX IF NOT EXISTS idx_game_version_single_current
  ON game_version(is_current)
  WHERE is_current;

ALTER TABLE game_version ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read game_version" ON game_version;
CREATE POLICY "Allow read game_version" ON game_version
  FOR SELECT
  USING (true);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON game_version FROM anon, authenticated;

INSERT INTO game_version (code, label, released_at, is_current)
VALUES ('v15', 'Version 15', NULL, true)
ON CONFLICT (code) DO NOTHING;

CREATE OR REPLACE FUNCTION private.current_game_version()
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT gv.code
  FROM public.game_version gv
  WHERE gv.is_current
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION private.current_game_version() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.current_game_version() TO authenticated;

COMMIT;
