-- Correctif securite : un utilisateur ne peut plus s'inserer un abonnement
-- deja valide, ni choisir son prix ou sa date de fin.
--
-- Avant : la policy INSERT ne verifiait que user_id, donc un appel REST direct
-- (anon key + JWT) pouvait creer status = 'validated' avec ends_at en 9999.
BEGIN;

DROP POLICY IF EXISTS "Allow user create own subscriptions" ON subscription;
DROP POLICY IF EXISTS "Allow user create own pending subscriptions" ON subscription;

-- Defense en profondeur : un visiteur non connecte n'ecrit jamais.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON subscription FROM anon;

CREATE POLICY "Allow user create own pending subscriptions" ON subscription
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND status = 'pending'
    AND validated_at IS NULL
    AND validated_by IS NULL
  );

-- Recalcule nom, prix et dates depuis subscription_plan pour toute insertion
-- faite par un utilisateur. Meme regle que lib/subscription.api.ts
-- (buildSubscriptionDateRange) : 1 an en jeu = 1 mois reel, NULL = illimite.
-- Les insertions depuis l'editeur SQL (pas de JWT) et par un admin sont
-- laissees telles quelles.
CREATE OR REPLACE FUNCTION private.subscription_normalize_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_plan public.subscription_plan%ROWTYPE;
BEGIN
  IF coalesce(auth.role(), '') <> 'authenticated' OR private.is_admin() THEN
    RETURN NEW;
  END IF;

  SELECT *
  INTO v_plan
  FROM public.subscription_plan p
  WHERE p.code = NEW.plan_code
    AND p.is_active;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan abonnement introuvable.' USING ERRCODE = '22023';
  END IF;

  NEW.plan_name := v_plan.label;
  NEW.price_cents := v_plan.price_cents;
  NEW.starts_at := now();
  NEW.ends_at := CASE
    WHEN v_plan.duration_ingame_years IS NULL
      THEN '9999-12-31T23:59:59.999Z'::TIMESTAMPTZ
    ELSE now() + make_interval(months => v_plan.duration_ingame_years)
  END;
  NEW.status := 'pending';
  NEW.validated_at := NULL;
  NEW.validated_by := NULL;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.subscription_normalize_insert() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_subscription_normalize_insert ON subscription;
CREATE TRIGGER trg_subscription_normalize_insert
  BEFORE INSERT ON subscription
  FOR EACH ROW
  EXECUTE FUNCTION private.subscription_normalize_insert();

COMMIT;

-- ---------------------------------------------------------------------------
-- Audit a executer une fois apres application (lecture seule).
-- Abonnements valides sans validateur : candidats a une auto-validation.
-- La migration 018 a valide sans validateur les abonnements anterieurs :
-- remplacer <date_018> par la date d'application de 018 pour les exclure.
--
-- SELECT id, user_id, plan_code, price_cents, starts_at, ends_at, created_at
-- FROM subscription
-- WHERE status = 'validated'
--   AND validated_by IS NULL
--   AND created_at > '<date_018>'
-- ORDER BY created_at DESC;
--
-- Abonnements dont la duree ne correspond pas au plan.
--
-- SELECT s.id, s.user_id, s.plan_code, s.starts_at, s.ends_at,
--        p.duration_ingame_years, s.price_cents, p.price_cents AS plan_price
-- FROM subscription s
-- JOIN subscription_plan p ON p.code = s.plan_code
-- WHERE s.price_cents <> p.price_cents
--    OR (p.duration_ingame_years IS NULL AND s.ends_at < '9999-01-01')
--    OR (p.duration_ingame_years IS NOT NULL
--        AND s.ends_at > s.starts_at
--          + make_interval(months => p.duration_ingame_years)
--          + INTERVAL '1 day');
-- ---------------------------------------------------------------------------
