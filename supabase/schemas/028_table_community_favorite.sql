-- Favoris de la Communaute (abonnes uniquement).
BEGIN;

CREATE TABLE IF NOT EXISTS community_favorite (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES community_build(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, publication_id)
);

CREATE INDEX IF NOT EXISTS idx_community_favorite_publication
  ON community_favorite(publication_id);

ALTER TABLE community_favorite ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user read own favorites" ON community_favorite;
DROP POLICY IF EXISTS "Allow subscriber create own favorites" ON community_favorite;
DROP POLICY IF EXISTS "Allow user delete own favorites" ON community_favorite;

CREATE POLICY "Allow user read own favorites" ON community_favorite
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Allow subscriber create own favorites" ON community_favorite
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (SELECT private.has_active_subscription())
  );

CREATE POLICY "Allow user delete own favorites" ON community_favorite
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON community_favorite FROM anon;
REVOKE UPDATE, TRUNCATE, REFERENCES, TRIGGER ON community_favorite FROM authenticated;

COMMIT;
