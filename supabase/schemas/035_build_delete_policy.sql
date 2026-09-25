-- Suppression d'un build par son proprietaire (bouton de l'atelier, via
-- DELETE /api/builds). Les slots suivants remontent d'un rang : ils sont
-- derives de l'ordre de creation.
-- En cascade : les liens de partage du build (shared_build) sont supprimes ;
-- une publication Communaute garde son contenu, source_build_id passe a NULL.
BEGIN;

CREATE POLICY "Allow user delete own builds" ON build
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

COMMIT;
