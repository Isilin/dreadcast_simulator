-- Statut des abonnements: pending a la creation, validated apres confirmation admin
ALTER TABLE subscription
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS validated_by UUID NULL REFERENCES auth.users(id);

ALTER TABLE subscription
  DROP CONSTRAINT IF EXISTS valid_subscription_status;

ALTER TABLE subscription
  ADD CONSTRAINT valid_subscription_status CHECK (status IN ('pending', 'validated'));

ALTER TABLE subscription
  DROP CONSTRAINT IF EXISTS valid_subscription_validation_fields;

ALTER TABLE subscription
  ADD CONSTRAINT valid_subscription_validation_fields CHECK (
    (status = 'pending' AND validated_at IS NULL AND validated_by IS NULL)
    OR (status = 'validated' AND validated_at IS NOT NULL)
  );

-- Les abonnements existants avant cette migration sont consideres valides
UPDATE subscription
SET
  status = 'validated',
  validated_at = COALESCE(validated_at, updated_at, created_at)
WHERE status IS DISTINCT FROM 'validated';

DROP POLICY IF EXISTS "Allow admin validate subscriptions" ON subscription;

CREATE POLICY "Allow admin validate subscriptions" ON subscription
  FOR UPDATE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
