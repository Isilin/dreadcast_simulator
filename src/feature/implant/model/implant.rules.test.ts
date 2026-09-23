import { describe, expect, it } from 'vitest';

import {
  MAX_IMPLANTS,
  computeImplantLevelCap,
  computeImplantsCount,
} from './implant.rules';

const genie = { name: 'Génie' as const, levelMax: 3 };

describe('computeImplantLevelCap', () => {
  it('is the implant level max while the total limit is far away', () => {
    expect(computeImplantLevelCap({ Génie: 1 }, genie)).toBe(3);
    expect(computeImplantLevelCap({}, genie)).toBe(3);
  });

  it('stops at the remaining room below the total limit', () => {
    const state = { Génie: 1, Brute: MAX_IMPLANTS - 2 };
    expect(computeImplantsCount(state)).toBe(MAX_IMPLANTS - 1);
    expect(computeImplantLevelCap(state, genie)).toBe(2);
  });

  it('never goes below the current level when the limit is already exceeded', () => {
    const state = { Génie: 2, Brute: MAX_IMPLANTS };
    expect(computeImplantLevelCap(state, genie)).toBe(2);
  });
});
