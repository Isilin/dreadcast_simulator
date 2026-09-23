import { describe, expect, it } from 'vitest';

import {
  createEmptyStats,
  statRecordToModifiers,
  sumStatModifiers,
} from './stats';

describe('statRecordToModifiers', () => {
  it('keeps non-zero stats in the stat order', () => {
    const stats = { ...createEmptyStats(), agility: -2, strength: 3 };
    expect(statRecordToModifiers(stats)).toEqual([
      { property: 'strength', value: 3 },
      { property: 'agility', value: -2 },
    ]);
  });
});

describe('sumStatModifiers', () => {
  it('adds up the same stat and drops stats that cancel out', () => {
    expect(
      sumStatModifiers([
        { property: 'perception', value: 4 },
        { property: 'robustness', value: -1 },
        { property: 'perception', value: 4 },
        { property: 'robustness', value: 1 },
      ]),
    ).toEqual([{ property: 'perception', value: 8 }]);
  });

  it('returns nothing without modifiers', () => {
    expect(sumStatModifiers([])).toEqual([]);
  });
});
