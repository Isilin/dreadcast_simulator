-- Table des abonnements utilisateur
CREATE TABLE IF NOT EXISTS subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_subscription_dates CHECK (ends_at > starts_at),
  CONSTRAINT valid_subscription_plan_code CHECK (
    plan_code IN ('annual_1', 'annual_6', 'annual_12', 'lifetime')
  ),
  CONSTRAINT valid_subscription_price CHECK (price_cents > 0)
);

-- Index pour l'historique utilisateur et la recherche d'abonnement actif
CREATE INDEX IF NOT EXISTS idx_subscription_user_id ON subscription(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_ends_at ON subscription(ends_at);

-- Politique de securite (RLS)
ALTER TABLE subscription ENABLE ROW LEVEL SECURITY;

-- Un utilisateur authentifie peut lire uniquement ses abonnements
CREATE POLICY "Allow user read own subscriptions" ON subscription
  FOR SELECT
  USING (auth.uid() = user_id);

-- Un utilisateur authentifie peut creer uniquement ses abonnements
CREATE POLICY "Allow user create own subscriptions" ON subscription
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
