import { describe, expect, it } from 'vitest';

import {
  getActiveSubscription,
  hasActiveSubscription,
} from './subscription.rules';

describe('subscription rules', () => {
  const now = Date.parse('2026-01-01T00:00:00.000Z');

  it('accepts only validated subscriptions that have not ended', () => {
    expect(
      hasActiveSubscription(
        [{ status: 'validated', endsAt: '2026-01-01T00:00:00.000Z' }],
        now,
      ),
    ).toBe(true);
    expect(
      hasActiveSubscription(
        [{ status: 'pending', endsAt: '2026-12-31T00:00:00.000Z' }],
        now,
      ),
    ).toBe(false);
    expect(
      hasActiveSubscription(
        [{ status: 'validated', endsAt: '2025-12-31T23:59:59.000Z' }],
        now,
      ),
    ).toBe(false);
    expect(
      hasActiveSubscription(
        [{ status: 'validated', endsAt: 'not-a-date' }],
        now,
      ),
    ).toBe(false);
  });

  it('returns the first active subscription', () => {
    const expired = {
      id: 'expired',
      status: 'validated' as const,
      endsAt: '2025-06-01T00:00:00.000Z',
    };
    const active = {
      id: 'active',
      status: 'validated' as const,
      endsAt: '9999-12-31T23:59:59.999Z',
    };

    expect(getActiveSubscription([expired, active], now)?.id).toBe('active');
    expect(getActiveSubscription([expired], now)).toBeUndefined();
  });
});
