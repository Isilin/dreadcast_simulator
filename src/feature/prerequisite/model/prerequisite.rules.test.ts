import { describe, expect, it } from 'vitest';

import {
  arePrerequisitesMet,
  computePureStats,
  findUnmetPrerequisites,
  formatPrerequisite,
  isPrerequisiteMet,
} from './prerequisite.rules';
import type { Prerequisite, PrerequisiteContext } from './prerequisite.types';

import { initialState as implantsInitialState } from '@/feature/implant/model/implant.store';
import { createEmptyStats } from '@/utils/stats';

const buildContext = (
  overrides: Partial<PrerequisiteContext> = {},
): PrerequisiteContext => ({
  pureStats: { ...createEmptyStats(), agility: 32 },
  titles: ['sentinelle'],
  implants: { ...implantsInitialState, Génie: 1 },
  ...overrides,
});

const agility50: Prerequisite = {
  kind: 'stat',
  property: 'agility',
  value: 50,
};
const agility30: Prerequisite = {
  kind: 'stat',
  property: 'agility',
  value: 30,
};
const sentinelle: Prerequisite = { kind: 'title', titleId: 'sentinelle' };
const liberateur: Prerequisite = { kind: 'title', titleId: 'liberateur' };
const genie: Prerequisite = { kind: 'implant', implant: 'Génie' };
const enrage: Prerequisite = { kind: 'implant', implant: 'Enragé' };

describe('computePureStats', () => {
  it('adds the race and the implants', () => {
    const implants = { ...createEmptyStats(), agility: 7 };
    const stats = computePureStats({ agility: 25, strength: 10 }, implants);

    expect(stats.agility).toBe(32);
    expect(stats.strength).toBe(10);
    expect(stats.medicine).toBe(0);
  });

  it('counts no race while the races load', () => {
    const stats = computePureStats(undefined, {
      ...createEmptyStats(),
      agility: 7,
    });

    expect(stats.agility).toBe(7);
  });
});

describe('isPrerequisiteMet', () => {
  const context = buildContext();

  it('checks a minimum stat', () => {
    expect(isPrerequisiteMet(agility30, context)).toBe(true);
    expect(isPrerequisiteMet(agility50, context)).toBe(false);
    expect(
      isPrerequisiteMet(
        { kind: 'stat', property: 'agility', value: 32 },
        context,
      ),
    ).toBe(true);
  });

  it('checks an unlocked title', () => {
    expect(isPrerequisiteMet(sentinelle, context)).toBe(true);
    expect(isPrerequisiteMet(liberateur, context)).toBe(false);
  });

  it('needs at least one implant level', () => {
    expect(isPrerequisiteMet(genie, context)).toBe(true);
    expect(isPrerequisiteMet(enrage, context)).toBe(false);
  });
});

describe('findUnmetPrerequisites', () => {
  it('keeps only the unmet prerequisites of a mixed list', () => {
    const context = buildContext();

    expect(
      findUnmetPrerequisites(
        [agility30, agility50, sentinelle, liberateur, genie, enrage],
        context,
      ),
    ).toEqual([agility50, liberateur, enrage]);
  });

  it('meets an empty or missing list', () => {
    const context = buildContext();

    expect(findUnmetPrerequisites([], context)).toEqual([]);
    expect(arePrerequisitesMet(undefined, context)).toBe(true);
  });
});

describe('formatPrerequisite', () => {
  const context = buildContext();

  it('shows the required and the current stat', () => {
    expect(formatPrerequisite(agility50, context, {})).toBe(
      'Agilité 50 (actuel 32)',
    );
  });

  it('shows the title name, or its id when unknown', () => {
    expect(
      formatPrerequisite(liberateur, context, { liberateur: 'Libérateur' }),
    ).toBe('Titre : Libérateur');
    expect(formatPrerequisite(liberateur, context, {})).toBe(
      'Titre : liberateur',
    );
  });

  it('shows the missing implant', () => {
    expect(formatPrerequisite(enrage, context, {})).toBe(
      'Implant : Enragé (non installé)',
    );
  });
});
