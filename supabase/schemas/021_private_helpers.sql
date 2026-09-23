-- Helpers internes utilises par les policies RLS et les RPC.
-- Le schema "private" n'est pas expose par PostgREST : ces fonctions ne sont
-- appelables que depuis SQL (policies, triggers, autres fonctions).
BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

-- Trigger generique de mise a jour de updated_at.
CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Role admin porte par le JWT (app_metadata.role), comme la policy 018.
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Abonnement actif de l'utilisateur courant. Sans parametre : impossible de
-- sonder l'abonnement d'un autre utilisateur.
CREATE OR REPLACE FUNCTION private.has_active_subscription()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscription s
    WHERE s.user_id = auth.uid()
      AND s.status = 'validated'
      AND s.ends_at >= now()
  );
$$;

-- Propriete d'un build par l'utilisateur courant. SECURITY DEFINER : lit la
-- table build sans passer par ses policies, ce qui evite la recursion RLS
-- entre build et shared_build.
CREATE OR REPLACE FUNCTION private.owns_build(p_build_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.build b
    WHERE b.id = p_build_id
      AND b.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.has_active_subscription() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.owns_build(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_active_subscription() TO authenticated;
GRANT EXECUTE ON FUNCTION private.owns_build(UUID) TO authenticated;

COMMIT;
