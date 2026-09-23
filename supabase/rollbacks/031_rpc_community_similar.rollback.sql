-- Rollback de 031_rpc_community_similar.sql
BEGIN;

DROP FUNCTION IF EXISTS public.community_for_you(INTEGER);
DROP FUNCTION IF EXISTS public.community_similar(JSONB, UUID[], TEXT, INTEGER);
DROP FUNCTION IF EXISTS private.community_similar_to_vec(DOUBLE PRECISION[], UUID[], TEXT, INTEGER);
DROP FUNCTION IF EXISTS private.community_stat_scale_floors();

COMMIT;
