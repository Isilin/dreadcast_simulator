-- Rollback de 029_rpc_community_write.sql
-- Exige que 030 et 031 soient deja annules (ils utilisent ces helpers).
BEGIN;

DROP FUNCTION IF EXISTS public.community_update_publication(UUID, TEXT, TEXT, TEXT, BOOLEAN, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.community_publish(INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS private.community_check_specialization(TEXT);
DROP FUNCTION IF EXISTS private.community_normalize_description(TEXT);
DROP FUNCTION IF EXISTS private.community_normalize_title(TEXT);
DROP FUNCTION IF EXISTS private.community_normalize_snapshot(JSONB);
DROP FUNCTION IF EXISTS private.community_derive_facets(JSONB);
DROP FUNCTION IF EXISTS private.community_key_stats(TEXT, JSONB);
DROP FUNCTION IF EXISTS private.community_stats_to_vec(JSONB);
DROP FUNCTION IF EXISTS private.community_validate_stats(JSONB);
DROP FUNCTION IF EXISTS private.community_specializations();
DROP FUNCTION IF EXISTS private.community_stat_keys();

COMMIT;
