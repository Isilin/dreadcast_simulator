import { describe, expect, it } from 'vitest';

import { buildSubscriptionDateRange } from './subscription.rules.js';

describe('buildSubscriptionDateRange', () => {
  const now = new Date('2026-01-31T10:00:00.000Z');

  it('adds one real month per in-game year', () => {
    expect(buildSubscriptionDateRange(2, now)).toEqual({
      startsAt: '2026-01-31T10:00:00.000Z',
      endsAt: '2026-03-31T10:00:00.000Z',
    });
  });

  it('never ends without duration', () => {
    expect(buildSubscriptionDateRange(null, now).endsAt).toBe(
      '9999-12-31T23:59:59.999Z',
    );
  });
});
