-- Index de la cle etrangere author_id de community_build_content : utilisee
-- par la policy de lecture (auteur) et par community_for_you (signaux).
-- Signale par l'advisor Supabase "unindexed_foreign_keys".
BEGIN;

CREATE INDEX IF NOT EXISTS idx_community_build_content_author
  ON community_build_content(author_id);

COMMIT;
