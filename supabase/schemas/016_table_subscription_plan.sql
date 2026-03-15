-- Table des plans d'abonnement
CREATE TABLE IF NOT EXISTS subscription_plan (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  duration_ingame_years INTEGER NULL,
  price_cents INTEGER NOT NULL,
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_subscription_plan_price CHECK (price_cents > 0),
  CONSTRAINT valid_subscription_plan_duration CHECK (duration_ingame_years IS NULL OR duration_ingame_years > 0)
);

CREATE INDEX IF NOT EXISTS idx_subscription_plan_sort_order ON subscription_plan(sort_order);

ALTER TABLE subscription_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read subscription_plan to authenticated users" ON subscription_plan
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
