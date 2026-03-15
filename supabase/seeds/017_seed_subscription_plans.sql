-- Seed des plans d'abonnement
INSERT INTO subscription_plan (
  code,
  label,
  duration_ingame_years,
  price_cents,
  sort_order,
  is_active
)
VALUES
  ('annual_1', '1 an', 1, 50000, 1, true),
  ('annual_6', '6 ans', 6, 250000, 2, true),
  ('annual_12', '12 ans', 12, 450000, 3, true),
  ('lifetime', 'Illimite', NULL, 800000, 4, true)
ON CONFLICT (code) DO UPDATE
SET
  label = EXCLUDED.label,
  duration_ingame_years = EXCLUDED.duration_ingame_years,
  price_cents = EXCLUDED.price_cents,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
