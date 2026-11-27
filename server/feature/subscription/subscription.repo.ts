import type { SubscriptionDateRange } from './subscription.rules.js';
import type { Subscription, SubscriptionPlan } from './subscription.schema.js';

/** Subscriptions of one user. */
export interface SubscriptionRepo {
  readonly activePlans: () => Promise<ReadonlyArray<SubscriptionPlan>>;
  /** Fails with PGRST116 when no active plan has this code. */
  readonly activePlan: (code: string) => Promise<SubscriptionPlan>;
  /** Most recent first. */
  readonly listMine: () => Promise<ReadonlyArray<Subscription>>;
  /**
   * Same rule as private.has_active_subscription(): validated and not
   * expired.
   */
  readonly hasActive: () => Promise<boolean>;
  /** Creates a pending subscription, validated later by an admin. */
  readonly create: (
    plan: SubscriptionPlan,
    range: SubscriptionDateRange,
  ) => Promise<Subscription>;
}
