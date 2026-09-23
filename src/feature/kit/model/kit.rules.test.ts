import { describe, expect, it } from 'vitest';

import {
  SPARE_TECH_THRESHOLD,
  computeRemainingTech,
  getTechBudgetStatus,
} from './kit.rules';
import type { KitSelection } from './kit.types';

const selection = (tech: number, number: number): KitSelection => ({
  kit: { id: `kit-${tech}`, name: 'Kit', tech, type: 'head', effects: [] },
  number,
});

describe('computeRemainingTech', () => {
  it('subtracts the cost of every installed kit copy', () => {
    expect(computeRemainingTech(300, [])).toBe(300);
    expect(
      computeRemainingTech(300, [selection(40, 2), selection(100, 1)]),
    ).toBe(120);
  });

  it('goes negative when the kits exceed the item tech', () => {
    expect(computeRemainingTech(100, [selection(60, 2)])).toBe(-20);
  });
});

describe('getTechBudgetStatus', () => {
  it('classifies the remaining tech', () => {
    expect(getTechBudgetStatus(-1)).toBe('over');
    expect(getTechBudgetStatus(0)).toBe('full');
    expect(getTechBudgetStatus(SPARE_TECH_THRESHOLD)).toBe('low');
    expect(getTechBudgetStatus(SPARE_TECH_THRESHOLD + 1)).toBe('spare');
  });
});
