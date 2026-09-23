-- Notes (1 a 5 etoiles) et avis courts sur les publications.
-- Une note par abonne et par publication, modifiable et supprimable par son
-- auteur. Pas d'auto-notation. Aucune moderation.
BEGIN;

CREATE TABLE IF NOT EXISTS community_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES community_build(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  stars SMALLINT NOT NULL,
  body TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT community_review_unique_reviewer UNIQUE (publication_id, reviewer_id),
  CONSTRAINT valid_community_review_stars CHECK (stars BETWEEN 1 AND 5),
  CONSTRAINT valid_community_review_body CHECK (
    body IS NULL OR char_length(body) BETWEEN 1 AND 280
  )
);

CREATE INDEX IF NOT EXISTS idx_community_review_publication_updated
  ON community_review(publication_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_review_updated
  ON community_review(updated_at);
CREATE INDEX IF NOT EXISTS idx_community_review_reviewer
  ON community_review(reviewer_id);

DROP TRIGGER IF EXISTS trg_community_review_updated_at ON community_review;
CREATE TRIGGER trg_community_review_updated_at
  BEFORE UPDATE ON community_review
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE OR REPLACE FUNCTION private.is_publication_author(p_publication_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.community_build cb
    WHERE cb.id = p_publication_id
      AND cb.author_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.is_publication_author(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_publication_author(UUID) TO authenticated;

-- Recalcule (sans incrementer) les agregats de note de la publication.
-- SECURITY DEFINER : un votant ne peut pas modifier community_build lui-meme.
CREATE OR REPLACE FUNCTION private.community_review_refresh_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_publication_id UUID;
  v_count INTEGER;
  v_sum INTEGER;
BEGIN
  v_publication_id := CASE
    WHEN TG_OP = 'DELETE' THEN OLD.publication_id
    ELSE NEW.publication_id
  END;

  -- Verrouille la ligne avant d'agreger : deux votes concurrents ne peuvent
  -- pas ecraser mutuellement leurs totaux.
  PERFORM 1
  FROM public.community_build cb
  WHERE cb.id = v_publication_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT count(*)::INTEGER, coalesce(sum(r.stars), 0)::INTEGER
  INTO v_count, v_sum
  FROM public.community_review r
  WHERE r.publication_id = v_publication_id;

  UPDATE public.community_build cb
  SET rating_count = v_count,
      rating_sum = v_sum
  WHERE cb.id = v_publication_id;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION private.community_review_refresh_rating() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_community_review_refresh_rating ON community_review;
CREATE TRIGGER trg_community_review_refresh_rating
  AFTER INSERT OR DELETE OR UPDATE OF stars ON community_review
  FOR EACH ROW
  EXECUTE FUNCTION private.community_review_refresh_rating();

ALTER TABLE community_review ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow subscriber read community reviews" ON community_review;
DROP POLICY IF EXISTS "Allow subscriber create community reviews" ON community_review;
DROP POLICY IF EXISTS "Allow reviewer update community reviews" ON community_review;
DROP POLICY IF EXISTS "Allow reviewer delete community reviews" ON community_review;

CREATE POLICY "Allow subscriber read community reviews" ON community_review
  FOR SELECT
  TO authenticated
  USING (
    (SELECT private.has_active_subscription())
    OR reviewer_id = (SELECT auth.uid())
    OR private.is_publication_author(publication_id)
  );

CREATE POLICY "Allow subscriber create community reviews" ON community_review
  FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = (SELECT auth.uid())
    AND (SELECT private.has_active_subscription())
    AND (SELECT private.has_pseudo())
    AND NOT private.is_publication_author(publication_id)
  );

CREATE POLICY "Allow reviewer update community reviews" ON community_review
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (
    reviewer_id = (SELECT auth.uid())
    AND (SELECT private.has_active_subscription())
  );

-- Supprimer son avis reste possible apres expiration de l'abonnement.
CREATE POLICY "Allow reviewer delete community reviews" ON community_review
  FOR DELETE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()));

REVOKE ALL ON community_review FROM anon;
REVOKE UPDATE, TRUNCATE, REFERENCES, TRIGGER ON community_review FROM authenticated;
GRANT UPDATE (stars, body) ON community_review TO authenticated;

COMMIT;
