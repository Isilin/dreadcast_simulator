-- Rollback de 027_table_community_review.sql
-- ATTENTION : supprime toutes les notes. Les agregats rating_count/rating_sum
-- de community_build sont remis a zero.
BEGIN;

DROP TABLE IF EXISTS community_review;
DROP FUNCTION IF EXISTS private.community_review_refresh_rating();
DROP FUNCTION IF EXISTS private.is_publication_author(UUID);

UPDATE community_build SET rating_count = 0, rating_sum = 0;

COMMIT;
