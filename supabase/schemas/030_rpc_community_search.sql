-- Recherche de la Communaute (SECURITY INVOKER : la RLS decide de ce que
-- l'appelant voit). Pour un non-abonne, community_build_content est
-- invisible : "stats" vaut NULL et les filtres avances ne renvoient rien.
--
-- Tris :
--   trending       (defaut) notes recentes ponderees dans le temps
--   top            moyenne bayesienne
--   recent         date de publication
--   most_reviewed  nombre d'avis
--   updated        date de derniere mise a jour du contenu
BEGIN;

CREATE OR REPLACE FUNCTION private.escape_like(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT replace(replace(replace(p_value, '\', '\\'), '%', '\%'), '_', '\_');
$$;

-- Score de tendance par publication. SECURITY DEFINER : les avis ne sont
-- lisibles que par les abonnes, mais le score agrege (un nombre) sert aussi
-- au tri par defaut des non-abonnes.
--   Somme sur les avis des 30 derniers jours de (etoiles - 2) * 0.5^(age_j / 7)
--   + bonus de fraicheur 1.5 * 0.5^(jours depuis publication / 3)
CREATE OR REPLACE FUNCTION private.community_trend_scores()
RETURNS TABLE (publication_id UUID, score DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    cb.id,
    (
      coalesce(r.score, 0)
      + 1.5 * power(
        0.5,
        extract(EPOCH FROM (now() - cb.published_at)) / 86400.0 / 3
      )
    )::DOUBLE PRECISION
  FROM public.community_build cb
  LEFT JOIN (
    SELECT
      rv.publication_id,
      sum(
        (rv.stars - 2) * power(
          0.5,
          extract(EPOCH FROM (now() - rv.updated_at)) / 86400.0 / 7
        )
      ) AS score
    FROM public.community_review rv
    WHERE rv.updated_at >= now() - INTERVAL '30 days'
    GROUP BY rv.publication_id
  ) r ON r.publication_id = cb.id;
$$;

REVOKE ALL ON FUNCTION private.escape_like(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_trend_scores() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.escape_like(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_trend_scores() TO authenticated;

DROP FUNCTION IF EXISTS public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
);

-- p_game_version : NULL = version courante, '*' = toutes les versions.
-- p_stat_min     : { "medicine": 200, "health": 900 }.
-- p_ids          : restreint aux publications donnees (hydratation des
--                  recommandations).
CREATE FUNCTION public.community_search(
  p_query TEXT DEFAULT NULL,
  p_specializations TEXT[] DEFAULT NULL,
  p_min_rating NUMERIC DEFAULT NULL,
  p_races public.race_type[] DEFAULT NULL,
  p_genders TEXT[] DEFAULT NULL,
  p_weapon_types public.item_type[] DEFAULT NULL,
  p_heal_only BOOLEAN DEFAULT false,
  p_game_version TEXT DEFAULT NULL,
  p_stat_min JSONB DEFAULT NULL,
  p_implants TEXT[] DEFAULT NULL,
  p_drug_ids TEXT[] DEFAULT NULL,
  p_item_ids TEXT[] DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_favorites_only BOOLEAN DEFAULT false,
  p_ids UUID[] DEFAULT NULL,
  p_sort TEXT DEFAULT 'trending',
  p_limit INTEGER DEFAULT 24,
  p_offset INTEGER DEFAULT 0
)
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
  author_id UUID,
  author_pseudo TEXT,
  stats JSONB,
  is_mine BOOLEAN,
  is_favorite BOOLEAN,
  bayes_score NUMERIC,
  trend_score DOUBLE PRECISION,
  total_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH params AS (
    SELECT
      CASE
        WHEN p_game_version = '*' THEN NULL
        ELSE coalesce(p_game_version, private.current_game_version())
      END AS version,
      nullif(btrim(lower(coalesce(p_query, ''))), '') AS query,
      least(greatest(coalesce(p_limit, 24), 1), 50) AS page_limit,
      greatest(coalesce(p_offset, 0), 0) AS page_offset,
      coalesce(p_sort, 'trending') AS sort
  ),
  filtered AS (
    SELECT
      cb.*,
      up.pseudo AS author_pseudo,
      c.stats AS content_stats,
      (cb.author_id = auth.uid()) AS is_mine,
      EXISTS (
        SELECT 1
        FROM public.community_favorite f
        WHERE f.publication_id = cb.id
          AND f.user_id = auth.uid()
      ) AS is_favorite,
      -- Moyenne bayesienne : 5 votes fictifs a 3 etoiles (a priori neutre).
      -- Un a priori egal a la moyenne globale classerait un build jamais
      -- note au niveau des mieux notes tant que les notes sont rares.
      round((5 * 3 + cb.rating_sum)::NUMERIC / (5 + cb.rating_count), 4)
        AS bayes_score,
      coalesce(t.score, 0) AS trend_score
    FROM public.community_build cb
    CROSS JOIN params p
    JOIN public.user_profile up ON up.user_id = cb.author_id
    LEFT JOIN public.community_build_content c ON c.publication_id = cb.id
    LEFT JOIN private.community_trend_scores() t ON t.publication_id = cb.id
    WHERE (p.version IS NULL OR cb.game_version = p.version)
      AND (p_ids IS NULL OR cb.id = ANY (p_ids))
      AND (
        p.query IS NULL
        OR lower(cb.title) LIKE '%' || private.escape_like(p.query) || '%'
        OR lower(up.pseudo) LIKE '%' || private.escape_like(p.query) || '%'
      )
      AND (
        p_specializations IS NULL
        OR cardinality(p_specializations) = 0
        OR cb.specialization = ANY (p_specializations)
      )
      AND (p_min_rating IS NULL OR cb.rating_avg >= p_min_rating)
      AND (
        p_races IS NULL
        OR cardinality(p_races) = 0
        OR cb.race = ANY (p_races)
      )
      AND (
        p_genders IS NULL
        OR cardinality(p_genders) = 0
        OR cb.gender = ANY (p_genders)
      )
      AND (
        p_weapon_types IS NULL
        OR cardinality(p_weapon_types) = 0
        OR cb.weapon_types && p_weapon_types
      )
      AND (NOT coalesce(p_heal_only, false) OR cb.has_heal_weapon)
      AND (p_author_id IS NULL OR cb.author_id = p_author_id)
      AND (
        NOT coalesce(p_favorites_only, false)
        OR EXISTS (
          SELECT 1
          FROM public.community_favorite f
          WHERE f.publication_id = cb.id
            AND f.user_id = auth.uid()
        )
      )
      -- Filtres avances : exigent le contenu (abonne ou auteur).
      AND (
        p_stat_min IS NULL
        OR NOT EXISTS (
          SELECT 1
          FROM jsonb_each_text(p_stat_min) AS m(key, value)
          WHERE coalesce((c.stats ->> m.key)::NUMERIC, -1e9) < m.value::NUMERIC
        )
      )
      AND (
        p_implants IS NULL
        OR cardinality(p_implants) = 0
        OR c.implant_names @> p_implants
      )
      AND (
        p_drug_ids IS NULL
        OR cardinality(p_drug_ids) = 0
        OR c.drug_id = ANY (p_drug_ids)
      )
      AND (
        p_item_ids IS NULL
        OR cardinality(p_item_ids) = 0
        OR c.item_ids @> p_item_ids
      )
  )
  SELECT
    f.id,
    f.title,
    f.description,
    f.specialization,
    f.detected_specialization,
    f.game_version,
    f.race,
    f.gender,
    f.weapon_types,
    f.has_heal_weapon,
    f.key_stats,
    f.rating_count,
    f.rating_avg,
    f.published_at,
    f.content_updated_at,
    f.author_id,
    f.author_pseudo,
    f.content_stats,
    f.is_mine,
    f.is_favorite,
    f.bayes_score,
    f.trend_score,
    count(*) OVER () AS total_count
  FROM filtered f
  CROSS JOIN params p
  ORDER BY
    CASE WHEN p.sort = 'top' THEN f.bayes_score END DESC NULLS LAST,
    CASE WHEN p.sort = 'top' THEN f.rating_count END DESC NULLS LAST,
    CASE WHEN p.sort = 'most_reviewed' THEN f.rating_count END DESC NULLS LAST,
    CASE WHEN p.sort = 'recent' THEN f.published_at END DESC NULLS LAST,
    CASE WHEN p.sort = 'updated' THEN f.content_updated_at END DESC NULLS LAST,
    CASE
      WHEN p.sort NOT IN ('top', 'most_reviewed', 'recent', 'updated')
        THEN f.trend_score
    END DESC NULLS LAST,
    f.published_at DESC,
    f.id
  LIMIT (SELECT page_limit FROM params)
  OFFSET (SELECT page_offset FROM params);
$$;

REVOKE ALL ON FUNCTION public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
) TO authenticated;

COMMIT;
