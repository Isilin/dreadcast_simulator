-- Apercu public d'une publication de la Communaute : un lien de partage
-- /communaute/:id s'ouvre aussi pour un visiteur non connecte.
--
-- SECURITY DEFINER : community_build et user_profile ne sont pas lisibles par
-- anon. Seules les metadonnees de l'apercu non-abonne sont renvoyees : ni
-- author_id, ni contenu (snapshot, stats completes), ni avis.
--
-- Additif : a appliquer AVANT le deploiement de l'API qui l'appelle.
BEGIN;

CREATE OR REPLACE FUNCTION public.community_get_preview(p_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  specialization TEXT,
  detected_specialization TEXT,
  game_version TEXT,
  race public.race_type,
  gender TEXT,
  weapon_types public.item_type[],
  has_heal_weapon BOOLEAN,
  key_stats JSONB,
  rating_count INTEGER,
  rating_avg NUMERIC,
  published_at TIMESTAMPTZ,
  content_updated_at TIMESTAMPTZ,
  author_pseudo TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    cb.id,
    cb.title,
    cb.description,
    cb.specialization,
    cb.detected_specialization,
    cb.game_version,
    cb.race,
    cb.gender,
    cb.weapon_types,
    cb.has_heal_weapon,
    cb.key_stats,
    cb.rating_count,
    cb.rating_avg,
    cb.published_at,
    cb.content_updated_at,
    up.pseudo
  FROM public.community_build cb
  JOIN public.user_profile up ON up.user_id = cb.author_id
  WHERE cb.id = p_id;
$$;

REVOKE ALL ON FUNCTION public.community_get_preview(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.community_get_preview(UUID) TO anon, authenticated;

COMMIT;
