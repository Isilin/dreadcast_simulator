-- Suppression des liens de partage /shared/:id : le partage passe par les
-- publications de la Communaute (/communaute/:id, apercu public via 039).
--
-- Destructif : a appliquer APRES le deploiement de l'API qui ne sert plus
-- /api/shared, et apres une sauvegarde des donnees.
BEGIN;

DROP FUNCTION IF EXISTS public.get_shared_build(UUID);
DROP TABLE IF EXISTS public.shared_build;

COMMIT;
