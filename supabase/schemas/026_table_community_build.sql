-- Publications de la Communaute.
--
-- Les donnees sont separees par audience :
--   community_build          metadonnees, lisibles par tout utilisateur connecte
--                            (apercu non-abonne : titre, spe, note, stats cles)
--   community_build_content  snapshot fige, 20 stats, facettes detaillees,
--                            lisibles uniquement par un abonne actif ou l'auteur
--
-- Aucune policy INSERT/UPDATE : les ecritures passent exclusivement par les
-- RPC community_publish / community_update_publication (029), qui copient le
-- snapshot depuis la table build et derivent les facettes cote serveur.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS community_build (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_build_id UUID NULL REFERENCES build(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NULL,
  specialization TEXT NOT NULL,
  detected_specialization TEXT NOT NULL,
  game_version TEXT NOT NULL REFERENCES game_version(code),
  race race_type NOT NULL,
  gender TEXT NOT NULL,
  weapon_types item_type[] NOT NULL DEFAULT '{}',
  has_heal_weapon BOOLEAN NOT NULL DEFAULT false,
  key_stats JSONB NOT NULL DEFAULT '[]',
  rating_count INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_avg NUMERIC(3, 2) GENERATED ALWAYS AS (
    CASE
      WHEN rating_count > 0 THEN round(rating_sum::NUMERIC / rating_count, 2)
    END
  ) STORED,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT community_build_source_unique UNIQUE (source_build_id),
  CONSTRAINT valid_community_build_title CHECK (
    char_length(btrim(title)) BETWEEN 3 AND 64
  ),
  CONSTRAINT valid_community_build_description CHECK (
    description IS NULL OR char_length(description) <= 1000
  ),
  CONSTRAINT valid_community_build_specialization CHECK (
    specialization IN (
      'medecin', 'informaticien', 'ingenieur', 'combattant_cac',
      'tireur', 'furtif', 'tank', 'soutien', 'polyvalent'
    )
  ),
  CONSTRAINT valid_community_build_detected_specialization CHECK (
    detected_specialization IN (
      'medecin', 'informaticien', 'ingenieur', 'combattant_cac',
      'tireur', 'furtif', 'tank', 'soutien', 'polyvalent'
    )
  ),
  CONSTRAINT valid_community_build_gender CHECK (gender IN ('male', 'female')),
  CONSTRAINT valid_community_build_rating CHECK (
    rating_count >= 0 AND rating_sum >= 0
  )
);

CREATE INDEX IF NOT EXISTS idx_community_build_version_published
  ON community_build(game_version, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_build_version_updated
  ON community_build(game_version, content_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_build_version_specialization
  ON community_build(game_version, specialization);
CREATE INDEX IF NOT EXISTS idx_community_build_author
  ON community_build(author_id);
CREATE INDEX IF NOT EXISTS idx_community_build_weapon_types
  ON community_build USING GIN (weapon_types);
CREATE INDEX IF NOT EXISTS idx_community_build_title_trgm
  ON community_build USING GIN (lower(title) extensions.gin_trgm_ops);

DROP TRIGGER IF EXISTS trg_community_build_updated_at ON community_build;
CREATE TRIGGER trg_community_build_updated_at
  BEFORE UPDATE ON community_build
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TABLE IF NOT EXISTS community_build_content (
  publication_id UUID PRIMARY KEY REFERENCES community_build(id) ON DELETE CASCADE,
  -- Denormalise pour une policy sans jointure.
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  stats JSONB NOT NULL,
  -- 20 stats dans l'ordre canonique de private.community_stat_keys().
  stat_vec DOUBLE PRECISION[] NOT NULL,
  item_ids TEXT[] NOT NULL DEFAULT '{}',
  kit_ids TEXT[] NOT NULL DEFAULT '{}',
  implant_names TEXT[] NOT NULL DEFAULT '{}',
  drug_id TEXT NULL,
  CONSTRAINT valid_community_build_content_stat_vec CHECK (
    array_length(stat_vec, 1) = 20
  )
);

CREATE INDEX IF NOT EXISTS idx_community_build_content_items
  ON community_build_content USING GIN (item_ids);
CREATE INDEX IF NOT EXISTS idx_community_build_content_implants
  ON community_build_content USING GIN (implant_names);
CREATE INDEX IF NOT EXISTS idx_community_build_content_drug
  ON community_build_content(drug_id);

ALTER TABLE community_build ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_build_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read community builds" ON community_build;
DROP POLICY IF EXISTS "Allow author delete community builds" ON community_build;
DROP POLICY IF EXISTS "Allow subscriber or author read community content" ON community_build_content;

CREATE POLICY "Allow authenticated read community builds" ON community_build
  FOR SELECT
  TO authenticated
  USING (true);

-- Depublier reste possible apres expiration de l'abonnement.
CREATE POLICY "Allow author delete community builds" ON community_build
  FOR DELETE
  TO authenticated
  USING (author_id = (SELECT auth.uid()));

CREATE POLICY "Allow subscriber or author read community content" ON community_build_content
  FOR SELECT
  TO authenticated
  USING (
    author_id = (SELECT auth.uid())
    OR (SELECT private.has_active_subscription())
  );

REVOKE ALL ON community_build FROM anon;
REVOKE INSERT, UPDATE, TRUNCATE, REFERENCES, TRIGGER ON community_build FROM authenticated;
REVOKE ALL ON community_build_content FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON community_build_content FROM authenticated;

COMMIT;
