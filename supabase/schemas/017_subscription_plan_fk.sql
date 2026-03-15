-- Liaison de subscription.plan_code vers subscription_plan.code
ALTER TABLE subscription
  DROP CONSTRAINT IF EXISTS valid_subscription_plan_code;

ALTER TABLE subscription
  ADD CONSTRAINT subscription_plan_code_fk
  FOREIGN KEY (plan_code)
  REFERENCES subscription_plan(code)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;
