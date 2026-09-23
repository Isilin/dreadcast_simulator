-- Rollback de 022_fix_subscription_insert.sql
-- Restaure la policy d'origine (015). ATTENTION : rouvre la faille
-- d'auto-validation des abonnements.
BEGIN;

DROP TRIGGER IF EXISTS trg_subscription_normalize_insert ON subscription;
DROP FUNCTION IF EXISTS private.subscription_normalize_insert();

DROP POLICY IF EXISTS "Allow user create own pending subscriptions" ON subscription;
DROP POLICY IF EXISTS "Allow user create own subscriptions" ON subscription;

CREATE POLICY "Allow user create own subscriptions" ON subscription
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Droits par defaut de Supabase avant 022.
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON subscription TO anon;

COMMIT;
