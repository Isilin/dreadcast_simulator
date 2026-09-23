-- Rollback de 033_optimize_legacy_rls.sql
BEGIN;

ALTER POLICY "Allow user read own builds" ON build
  USING (auth.uid() = user_id);

ALTER POLICY "Allow user update own builds" ON build
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Allow user upsert own builds" ON build
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Allow user read own subscriptions" ON subscription
  USING (auth.uid() = user_id);

ALTER POLICY "Allow admin validate subscriptions" ON subscription
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

ALTER POLICY "Allow read subscription_plan to authenticated users" ON subscription_plan
  USING (auth.uid() IS NOT NULL);

DROP INDEX IF EXISTS idx_subscription_plan_code;
DROP INDEX IF EXISTS idx_subscription_validated_by;

COMMIT;
