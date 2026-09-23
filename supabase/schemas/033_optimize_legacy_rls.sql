-- Performance des policies anterieures a la Communaute : auth.uid() et
-- auth.jwt() sont evalues une seule fois par requete via (SELECT ...) au lieu
-- d'une fois par ligne. Memes noms, roles et regles d'acces.
-- Ajoute aussi les index des cles etrangeres de subscription.
-- Signales par les advisors Supabase "auth_rls_initplan" et
-- "unindexed_foreign_keys".
BEGIN;

ALTER POLICY "Allow user read own builds" ON build
  USING ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow user update own builds" ON build
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow user upsert own builds" ON build
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow user read own subscriptions" ON subscription
  USING ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow admin validate subscriptions" ON subscription
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

ALTER POLICY "Allow read subscription_plan to authenticated users" ON subscription_plan
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_subscription_plan_code ON subscription(plan_code);
CREATE INDEX IF NOT EXISTS idx_subscription_validated_by ON subscription(validated_by);

COMMIT;
