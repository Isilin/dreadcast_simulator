-- Recommandations par similitude de stats (SECURITY INVOKER : seules les
-- publications dont le contenu est lisible, donc abonne ou auteur, servent
-- de base de comparaison).
--
-- Chaque stat est centree-reduite (z-score) sur les publications de la
-- version, puis on compare par cosinus. Sans centrage, toutes les stats
-- etant positives (~100+), le cosinus brut vaut ~0.95 pour toutes les paires.
-- L'ecart-type est borne par un plancher par stat pour les petits
-- echantillons et les stats presque toujours nulles.
BEGIN;

CREATE OR REPLACE FUNCTION private.community_stat_scale_floors()
RETURNS DOUBLE PRECISION[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  -- Meme ordre que private.community_stat_keys().
  SELECT ARRAY[
    15, 15, 15, 15, 15, 15, 15, 15, -- competences
    50, 50,                         -- sante, forme
    10, 5,                          -- etat max, vitesse
    5, 5, 5,                        -- degats races, score de toucher, soin equipe
    5, 5, 5, 5, 5                   -- degats et critiques CaC / tir
  ]::DOUBLE PRECISION[];
$$;

-- Publications les plus proches d'un vecteur de stats, hors publications de
-- l'appelant et hors p_exclude_ids.
CREATE OR REPLACE FUNCTION private.community_similar_to_vec(
  p_vec DOUBLE PRECISION[],
  p_exclude_ids UUID[],
  p_game_version TEXT,
  p_limit INTEGER
)
RETURNS TABLE (publication_id UUID, similarity DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH version AS (
    SELECT CASE
      WHEN p_game_version = '*' THEN NULL
      ELSE coalesce(p_game_version, private.current_game_version())
    END AS code
  ),
  pool AS (
    SELECT c.publication_id, c.stat_vec, cb.author_id
    FROM public.community_build_content c
    JOIN public.community_build cb ON cb.id = c.publication_id
    CROSS JOIN version v
    WHERE v.code IS NULL OR cb.game_version = v.code
  ),
  floors AS (
    SELECT f.value AS floor_value, f.ord::INTEGER AS dim
    FROM unnest(private.community_stat_scale_floors()) WITH ORDINALITY AS f(value, ord)
  ),
  dims AS (
    SELECT
      fl.dim,
      avg(p.stat_vec[fl.dim]) AS mu,
      greatest(coalesce(stddev_pop(p.stat_vec[fl.dim]), 0), fl.floor_value) AS sigma
    FROM pool p
    CROSS JOIN floors fl
    GROUP BY fl.dim, fl.floor_value
  ),
  scored AS (
    SELECT
      p.publication_id,
      sum(
        ((p.stat_vec[d.dim] - d.mu) / d.sigma)
        * ((p_vec[d.dim] - d.mu) / d.sigma)
      ) AS dot,
      sqrt(sum(power((p.stat_vec[d.dim] - d.mu) / d.sigma, 2))) AS pool_norm,
      sqrt(sum(power((p_vec[d.dim] - d.mu) / d.sigma, 2))) AS target_norm
    FROM pool p
    CROSS JOIN dims d
    WHERE p.author_id <> auth.uid()
      AND NOT (p.publication_id = ANY (coalesce(p_exclude_ids, '{}'::UUID[])))
    GROUP BY p.publication_id
  )
  SELECT
    s.publication_id,
    CASE
      WHEN s.pool_norm = 0 OR s.target_norm = 0 THEN 0
      ELSE s.dot / (s.pool_norm * s.target_norm)
    END AS similarity
  FROM scored s
  WHERE p_vec IS NOT NULL
    AND array_length(p_vec, 1) = 20
  ORDER BY similarity DESC, s.publication_id
  LIMIT least(greatest(coalesce(p_limit, 12), 1), 50);
$$;

-- « Builds proches du mien » : p_stats = stats calculees du build de l'atelier.
CREATE OR REPLACE FUNCTION public.community_similar(
  p_stats JSONB,
  p_exclude_ids UUID[] DEFAULT NULL,
  p_game_version TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE (publication_id UUID, similarity DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT s.publication_id, s.similarity
  FROM private.community_similar_to_vec(
    private.community_stats_to_vec(private.community_validate_stats(p_stats)),
    p_exclude_ids,
    p_game_version,
    p_limit
  ) s;
$$;

-- « Pour vous » : centroide des publications de l'appelant, de ses favoris et
-- des builds qu'il a notes 4 etoiles ou plus. Vide sans signal (l'API se
-- rabat alors sur le tri Tendance).
CREATE OR REPLACE FUNCTION public.community_for_you(
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE (publication_id UUID, similarity DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH signals AS (
    SELECT c.publication_id, c.stat_vec
    FROM public.community_build_content c
    WHERE c.author_id = auth.uid()
    UNION
    SELECT c.publication_id, c.stat_vec
    FROM public.community_favorite f
    JOIN public.community_build_content c ON c.publication_id = f.publication_id
    WHERE f.user_id = auth.uid()
    UNION
    SELECT c.publication_id, c.stat_vec
    FROM public.community_review r
    JOIN public.community_build_content c ON c.publication_id = r.publication_id
    WHERE r.reviewer_id = auth.uid()
      AND r.stars >= 4
  ),
  centroid AS (
    SELECT array_agg(x.mean ORDER BY x.dim) AS vec
    FROM (
      SELECT d.dim, avg(s.stat_vec[d.dim]) AS mean
      FROM signals s
      CROSS JOIN generate_series(1, 20) AS d(dim)
      GROUP BY d.dim
    ) x
  )
  SELECT s.publication_id, s.similarity
  FROM centroid ce
  CROSS JOIN LATERAL private.community_similar_to_vec(
    ce.vec,
    (SELECT array_agg(sg.publication_id) FROM signals sg),
    NULL,
    p_limit
  ) s
  WHERE ce.vec IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION private.community_stat_scale_floors() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_similar_to_vec(DOUBLE PRECISION[], UUID[], TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.community_stat_scale_floors() TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_similar_to_vec(DOUBLE PRECISION[], UUID[], TEXT, INTEGER) TO authenticated;

REVOKE ALL ON FUNCTION public.community_similar(JSONB, UUID[], TEXT, INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.community_for_you(INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.community_similar(JSONB, UUID[], TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.community_for_you(INTEGER) TO authenticated;

COMMIT;
