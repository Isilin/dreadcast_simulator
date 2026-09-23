-- Rollback de 030_rpc_community_search.sql
BEGIN;

DROP FUNCTION IF EXISTS public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
);
DROP FUNCTION IF EXISTS private.community_trend_scores();
DROP FUNCTION IF EXISTS private.escape_like(TEXT);

COMMIT;
