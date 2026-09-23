-- Durcissement des liens de partage — etape B.
-- A appliquer UNIQUEMENT apres le deploiement de l'API qui lit les partages
-- via public.get_shared_build() (voir 023a).
BEGIN;

DROP POLICY IF EXISTS "Allow public read shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow user insert own shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow user update own shared builds" ON shared_build;

-- Les snapshots partages ne sont plus lisibles directement : la lecture
-- publique passe par get_shared_build(), qui ne renvoie pas user_id.
DROP POLICY IF EXISTS "Allow public read shared snapshots" ON build;

COMMIT;
