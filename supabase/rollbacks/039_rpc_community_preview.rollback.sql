-- Rollback de 039_rpc_community_preview.sql
BEGIN;

DROP FUNCTION IF EXISTS public.community_get_preview(UUID);

COMMIT;
