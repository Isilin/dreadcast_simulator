-- RPC d'ecriture de la Communaute (seul chemin d'ecriture des publications).
--
-- Erreurs levees (message = code, lu par lib/community.api.ts) :
--   NOT_AUTHENTICATED, SUBSCRIPTION_REQUIRED, PSEUDO_REQUIRED,
--   BUILD_NOT_FOUND, ALREADY_PUBLISHED, PUBLICATION_NOT_FOUND, FROZEN,
--   SOURCE_BUILD_MISSING, INVALID_TITLE, INVALID_DESCRIPTION,
--   INVALID_SPECIALIZATION, INVALID_STATS, INVALID_SNAPSHOT
BEGIN;

-- Ordre canonique des stats : identique a src/domain/stats.ts,
-- lib/community.validation.ts et a l'enum stat_property.
CREATE OR REPLACE FUNCTION private.community_stat_keys()
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT ARRAY[
    'strength', 'agility', 'robustness', 'perception', 'stealth',
    'computing', 'medicine', 'engineering', 'health', 'stamina',
    'integrity', 'speed', 'raceDamage', 'hitRating', 'teamHeal',
    'cacDamage', 'criticalCacChance', 'criticalCacDamage', 'hitDamages',
    'criticalHitDamage'
  ]::TEXT[];
$$;

CREATE OR REPLACE FUNCTION private.community_specializations()
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT ARRAY[
    'medecin', 'informaticien', 'ingenieur', 'combattant_cac',
    'tireur', 'furtif', 'tank', 'soutien', 'polyvalent'
  ]::TEXT[];
$$;

-- Verifie les 20 stats (cles exactes, nombres finis, bornes larges) et les
-- arrondit a 2 decimales. Les stats viennent du client : ce controle ne
-- garantit que leur coherence, pas leur exactitude.
CREATE OR REPLACE FUNCTION private.community_validate_stats(p_stats JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_keys TEXT[] := private.community_stat_keys();
  v_key TEXT;
  v_value JSONB;
  v_number NUMERIC;
  v_result JSONB := '{}'::JSONB;
BEGIN
  IF p_stats IS NULL OR jsonb_typeof(p_stats) <> 'object' THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
  END IF;

  IF (SELECT count(*) FROM jsonb_object_keys(p_stats)) <> array_length(v_keys, 1) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
  END IF;

  FOREACH v_key IN ARRAY v_keys LOOP
    v_value := p_stats -> v_key;

    IF v_value IS NULL OR jsonb_typeof(v_value) <> 'number' THEN
      RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
    END IF;

    v_number := round((v_value #>> '{}')::NUMERIC, 2);

    IF v_number < -1000 OR v_number > 10000 THEN
      RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
    END IF;

    v_result := v_result || jsonb_build_object(v_key, v_number);
  END LOOP;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION private.community_stats_to_vec(p_stats JSONB)
RETURNS DOUBLE PRECISION[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT array_agg(
    coalesce((p_stats ->> k.key)::DOUBLE PRECISION, 0)
    ORDER BY k.ord
  )
  FROM unnest(private.community_stat_keys()) WITH ORDINALITY AS k(key, ord);
$$;

-- Stats mises en avant sur les cartes (visibles des non-abonnes), sous forme
-- de tableau ordonne [{ "stat": ..., "value": ... }].
CREATE OR REPLACE FUNCTION private.community_key_stats(
  p_specialization TEXT,
  p_stats JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_keys TEXT[];
BEGIN
  v_keys := CASE p_specialization
    WHEN 'medecin' THEN ARRAY['medicine', 'health', 'stamina', 'teamHeal']
    WHEN 'informaticien' THEN ARRAY['computing', 'health', 'stamina', 'stealth']
    WHEN 'ingenieur' THEN ARRAY['engineering', 'health', 'stamina', 'integrity']
    WHEN 'combattant_cac' THEN ARRAY['strength', 'cacDamage', 'criticalCacChance', 'health']
    WHEN 'tireur' THEN ARRAY['perception', 'hitDamages', 'criticalHitDamage', 'hitRating']
    WHEN 'furtif' THEN ARRAY['stealth', 'agility', 'perception', 'health']
    WHEN 'tank' THEN ARRAY['robustness', 'health', 'integrity', 'stamina']
    WHEN 'soutien' THEN ARRAY['teamHeal', 'medicine', 'health', 'stamina']
    ELSE NULL
  END;

  -- Polyvalent : les 3 meilleures competences + la sante.
  IF v_keys IS NULL THEN
    SELECT array_agg(s.key ORDER BY s.value DESC, s.ord)
    INTO v_keys
    FROM (
      SELECT k.key, k.ord, coalesce((p_stats ->> k.key)::NUMERIC, 0) AS value
      FROM unnest((private.community_stat_keys())[1:8]) WITH ORDINALITY AS k(key, ord)
      ORDER BY value DESC, k.ord
      LIMIT 3
    ) s;

    v_keys := v_keys || ARRAY['health'];
  END IF;

  RETURN (
    SELECT coalesce(
      jsonb_agg(
        jsonb_build_object(
          'stat', k.key,
          'value', coalesce((p_stats ->> k.key)::NUMERIC, 0)
        )
        ORDER BY k.ord
      ),
      '[]'::JSONB
    )
    FROM unnest(v_keys) WITH ORDINALITY AS k(key, ord)
  );
END;
$$;

-- Lit et valide un snapshot de build (JSON non fiable) et en derive les
-- facettes de recherche a partir des tables du jeu.
CREATE OR REPLACE FUNCTION private.community_derive_facets(
  p_snapshot JSONB,
  OUT race public.race_type,
  OUT gender TEXT,
  OUT weapon_types public.item_type[],
  OUT has_heal_weapon BOOLEAN,
  OUT item_ids TEXT[],
  OUT kit_ids TEXT[],
  OUT implant_names TEXT[],
  OUT drug_id TEXT
)
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  v_items JSONB := coalesce(p_snapshot -> 'items', '{}'::JSONB);
  v_kits JSONB := coalesce(p_snapshot -> 'kits', '{}'::JSONB);
  v_implants JSONB := coalesce(p_snapshot -> 'implants', '{}'::JSONB);
  v_drug JSONB := p_snapshot -> 'drug';
  v_arm_ids TEXT[];
BEGIN
  IF p_snapshot IS NULL
    OR jsonb_typeof(p_snapshot) <> 'object'
    OR jsonb_typeof(p_snapshot -> 'profile') IS DISTINCT FROM 'object'
    OR jsonb_typeof(v_items) <> 'object'
    OR jsonb_typeof(v_kits) <> 'object'
    OR jsonb_typeof(v_implants) <> 'object'
  THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  race := (p_snapshot #>> '{profile,race}')::public.race_type;
  gender := p_snapshot #>> '{profile,gender}';

  IF race IS NULL OR gender IS NULL OR gender NOT IN ('male', 'female') THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  -- Equipements : { spot: { id, damageBonus? } | null }
  SELECT coalesce(array_agg(DISTINCT e.value ->> 'id'), '{}')
  INTO item_ids
  FROM jsonb_each(v_items) AS e(spot, value)
  WHERE jsonb_typeof(e.value) = 'object'
    AND e.value ->> 'id' IS NOT NULL;

  IF EXISTS (
    SELECT 1
    FROM unnest(item_ids) AS i(id)
    WHERE NOT EXISTS (SELECT 1 FROM public.item it WHERE it.id = i.id)
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  v_arm_ids := ARRAY[
    v_items #>> '{leftArm,id}',
    v_items #>> '{rightArm,id}'
  ];

  SELECT
    coalesce(array_agg(DISTINCT it.type ORDER BY it.type), '{}'),
    coalesce(bool_or(it.min_heal IS NOT NULL), false)
  INTO weapon_types, has_heal_weapon
  FROM public.item it
  WHERE it.id = ANY (v_arm_ids);

  -- Kits : { spot: [{ id, number }] }
  SELECT coalesce(array_agg(DISTINCT k.value ->> 'id'), '{}')
  INTO kit_ids
  FROM jsonb_each(v_kits) AS e(spot, value)
  CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(e.value) = 'array' THEN e.value ELSE '[]'::JSONB END
  ) AS k(value)
  WHERE jsonb_typeof(k.value) = 'object'
    AND k.value ->> 'id' IS NOT NULL;

  IF EXISTS (
    SELECT 1
    FROM unnest(kit_ids) AS i(id)
    WHERE NOT EXISTS (SELECT 1 FROM public.kit kt WHERE kt.id = i.id)
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  -- Implants : { nom: niveau }
  IF EXISTS (
    SELECT 1
    FROM jsonb_each(v_implants) AS e(name, value)
    WHERE jsonb_typeof(e.value) <> 'number'
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  SELECT coalesce(array_agg(e.name ORDER BY e.name), '{}')
  INTO implant_names
  FROM jsonb_each(v_implants) AS e(name, value)
  WHERE (e.value #>> '{}')::NUMERIC > 0;

  IF EXISTS (
    SELECT 1
    FROM jsonb_each(v_implants) AS e(name, value)
    WHERE (e.value #>> '{}')::NUMERIC <> 0
      AND NOT EXISTS (
        SELECT 1
        FROM public.implant im
        WHERE im.name = e.name
          AND (e.value #>> '{}')::NUMERIC BETWEEN 0 AND im.level_max
          AND (e.value #>> '{}')::NUMERIC = trunc((e.value #>> '{}')::NUMERIC)
      )
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  -- Drogue : id | null
  IF v_drug IS NULL OR jsonb_typeof(v_drug) = 'null' THEN
    drug_id := NULL;
  ELSIF jsonb_typeof(v_drug) = 'string' THEN
    drug_id := v_drug #>> '{}';
    IF NOT EXISTS (SELECT 1 FROM public.drug d WHERE d.id = drug_id) THEN
      RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
    END IF;
  ELSE
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;
EXCEPTION
  WHEN data_exception THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
END;
$$;

-- Snapshot stocke tel quel ou, pour d'anciennes lignes, sous forme de chaine
-- JSON. savedAt est retire de la copie figee.
CREATE OR REPLACE FUNCTION private.community_normalize_snapshot(p_snapshot JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_snapshot JSONB := p_snapshot;
BEGIN
  IF jsonb_typeof(v_snapshot) = 'string' THEN
    v_snapshot := (v_snapshot #>> '{}')::JSONB;
  END IF;

  IF jsonb_typeof(v_snapshot) <> 'object' THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  RETURN v_snapshot - 'savedAt';
EXCEPTION
  WHEN data_exception THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
END;
$$;

CREATE OR REPLACE FUNCTION private.community_normalize_title(p_title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_title TEXT := btrim(coalesce(p_title, ''));
BEGIN
  IF char_length(v_title) NOT BETWEEN 3 AND 64 THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_TITLE';
  END IF;

  RETURN v_title;
END;
$$;

CREATE OR REPLACE FUNCTION private.community_normalize_description(p_description TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_description TEXT := nullif(btrim(coalesce(p_description, '')), '');
BEGIN
  IF v_description IS NOT NULL AND char_length(v_description) > 1000 THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_DESCRIPTION';
  END IF;

  RETURN v_description;
END;
$$;

CREATE OR REPLACE FUNCTION private.community_check_specialization(p_specialization TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF p_specialization IS NULL
    OR NOT (p_specialization = ANY (private.community_specializations()))
  THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SPECIALIZATION';
  END IF;

  RETURN p_specialization;
END;
$$;

-- Publie une copie figee du build du slot p_slot (1-based, meme ordre que
-- api/builds). Retourne l'identifiant de la publication.
CREATE OR REPLACE FUNCTION public.community_publish(
  p_slot INTEGER,
  p_title TEXT,
  p_description TEXT,
  p_specialization TEXT,
  p_detected_specialization TEXT,
  p_stats JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_build_id UUID;
  v_build_snapshot JSONB;
  v_snapshot JSONB;
  v_stats JSONB;
  v_facets RECORD;
  v_title TEXT;
  v_description TEXT;
  v_specialization TEXT;
  v_detected TEXT;
  v_publication_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'NOT_AUTHENTICATED';
  END IF;

  IF NOT private.has_active_subscription() THEN
    RAISE EXCEPTION USING MESSAGE = 'SUBSCRIPTION_REQUIRED';
  END IF;

  IF NOT private.has_pseudo() THEN
    RAISE EXCEPTION USING MESSAGE = 'PSEUDO_REQUIRED';
  END IF;

  v_title := private.community_normalize_title(p_title);
  v_description := private.community_normalize_description(p_description);
  v_specialization := private.community_check_specialization(p_specialization);
  v_detected := private.community_check_specialization(p_detected_specialization);
  v_stats := private.community_validate_stats(p_stats);

  IF p_slot IS NULL OR p_slot < 1 THEN
    RAISE EXCEPTION USING MESSAGE = 'BUILD_NOT_FOUND';
  END IF;

  SELECT b.id, b.snapshot
  INTO v_build_id, v_build_snapshot
  FROM public.build b
  WHERE b.user_id = v_user_id
  ORDER BY b.created_at ASC, b.id ASC
  OFFSET p_slot - 1
  LIMIT 1;

  IF v_build_id IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'BUILD_NOT_FOUND';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.community_build cb WHERE cb.source_build_id = v_build_id
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'ALREADY_PUBLISHED';
  END IF;

  v_snapshot := private.community_normalize_snapshot(v_build_snapshot);
  SELECT * INTO v_facets FROM private.community_derive_facets(v_snapshot);

  BEGIN
    INSERT INTO public.community_build (
      author_id,
      source_build_id,
      title,
      description,
      specialization,
      detected_specialization,
      game_version,
      race,
      gender,
      weapon_types,
      has_heal_weapon,
      key_stats
    )
    VALUES (
      v_user_id,
      v_build_id,
      v_title,
      v_description,
      v_specialization,
      v_detected,
      private.current_game_version(),
      v_facets.race,
      v_facets.gender,
      v_facets.weapon_types,
      v_facets.has_heal_weapon,
      private.community_key_stats(v_specialization, v_stats)
    )
    RETURNING id INTO v_publication_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION USING MESSAGE = 'ALREADY_PUBLISHED';
  END;

  INSERT INTO public.community_build_content (
    publication_id,
    author_id,
    snapshot,
    stats,
    stat_vec,
    item_ids,
    kit_ids,
    implant_names,
    drug_id
  )
  VALUES (
    v_publication_id,
    v_user_id,
    v_snapshot,
    v_stats,
    private.community_stats_to_vec(v_stats),
    v_facets.item_ids,
    v_facets.kit_ids,
    v_facets.implant_names,
    v_facets.drug_id
  );

  RETURN v_publication_id;
END;
$$;

-- Met a jour une publication. p_refresh = true recopie le build source
-- (« Mettre a jour la publication ») et exige p_stats ; sinon seules les
-- metadonnees changent. Les notes sont conservees dans les deux cas.
CREATE OR REPLACE FUNCTION public.community_update_publication(
  p_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_specialization TEXT,
  p_refresh BOOLEAN,
  p_detected_specialization TEXT DEFAULT NULL,
  p_stats JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_publication public.community_build%ROWTYPE;
  v_build_snapshot JSONB;
  v_snapshot JSONB;
  v_stats JSONB;
  v_facets RECORD;
  v_title TEXT;
  v_description TEXT;
  v_specialization TEXT;
  v_detected TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'NOT_AUTHENTICATED';
  END IF;

  SELECT *
  INTO v_publication
  FROM public.community_build cb
  WHERE cb.id = p_id
  FOR UPDATE;

  IF NOT FOUND OR v_publication.author_id <> v_user_id THEN
    RAISE EXCEPTION USING MESSAGE = 'PUBLICATION_NOT_FOUND';
  END IF;

  -- Abonnement expire : publication gelee (visible, notable, depubliable).
  IF NOT private.has_active_subscription() THEN
    RAISE EXCEPTION USING MESSAGE = 'FROZEN';
  END IF;

  v_title := private.community_normalize_title(p_title);
  v_description := private.community_normalize_description(p_description);
  v_specialization := private.community_check_specialization(p_specialization);

  IF coalesce(p_refresh, false) THEN
    v_detected := private.community_check_specialization(p_detected_specialization);
    v_stats := private.community_validate_stats(p_stats);

    IF v_publication.source_build_id IS NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'SOURCE_BUILD_MISSING';
    END IF;

    SELECT b.snapshot
    INTO v_build_snapshot
    FROM public.build b
    WHERE b.id = v_publication.source_build_id
      AND b.user_id = v_user_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION USING MESSAGE = 'SOURCE_BUILD_MISSING';
    END IF;

    v_snapshot := private.community_normalize_snapshot(v_build_snapshot);
    SELECT * INTO v_facets FROM private.community_derive_facets(v_snapshot);

    UPDATE public.community_build_content c
    SET snapshot = v_snapshot,
        stats = v_stats,
        stat_vec = private.community_stats_to_vec(v_stats),
        item_ids = v_facets.item_ids,
        kit_ids = v_facets.kit_ids,
        implant_names = v_facets.implant_names,
        drug_id = v_facets.drug_id
    WHERE c.publication_id = p_id;

    UPDATE public.community_build cb
    SET title = v_title,
        description = v_description,
        specialization = v_specialization,
        detected_specialization = v_detected,
        game_version = private.current_game_version(),
        race = v_facets.race,
        gender = v_facets.gender,
        weapon_types = v_facets.weapon_types,
        has_heal_weapon = v_facets.has_heal_weapon,
        key_stats = private.community_key_stats(v_specialization, v_stats),
        content_updated_at = now()
    WHERE cb.id = p_id;

    RETURN;
  END IF;

  SELECT c.stats
  INTO v_stats
  FROM public.community_build_content c
  WHERE c.publication_id = p_id;

  UPDATE public.community_build cb
  SET title = v_title,
      description = v_description,
      specialization = v_specialization,
      key_stats = private.community_key_stats(v_specialization, v_stats)
  WHERE cb.id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION private.community_stat_keys() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_specializations() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_validate_stats(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_stats_to_vec(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_key_stats(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_derive_facets(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_normalize_snapshot(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_normalize_title(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_normalize_description(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_check_specialization(TEXT) FROM PUBLIC;

-- Utilisees par les RPC de lecture (SECURITY INVOKER, 030/031).
GRANT EXECUTE ON FUNCTION private.community_stat_keys() TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_validate_stats(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_stats_to_vec(JSONB) TO authenticated;

REVOKE ALL ON FUNCTION public.community_publish(INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.community_update_publication(UUID, TEXT, TEXT, TEXT, BOOLEAN, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.community_publish(INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.community_update_publication(UUID, TEXT, TEXT, TEXT, BOOLEAN, TEXT, JSONB) TO authenticated;

COMMIT;
