import { describe, expect, it } from 'vitest';

import {
  detectSpecialization,
  type DetectSpecializationInput,
} from './specialization.rules';

import { StatValues, type Stat } from '@/domain';
import type { ItemType } from '@/feature/item';

const BASE_HEALTH = 116;
const raceBase = {
  strength: 100,
  agility: 100,
  robustness: 100,
  perception: 100,
  stealth: 100,
  computing: 100,
  medicine: 100,
  engineering: 100,
  health: 480,
};

const createStats = (
  overrides: Partial<Record<Stat, number>> = {},
): Record<Stat, number> => ({
  ...(Object.fromEntries(
    Object.keys(StatValues).map((stat) => [stat, 0]),
  ) as Record<Stat, number>),
  ...raceBase,
  health: raceBase.health + BASE_HEALTH,
  stamina: 100 + BASE_HEALTH,
  ...overrides,
});

const detect = (
  overrides: Partial<Record<Stat, number>>,
  weaponTypes: ItemType[] = [],
  hasHealWeapon = false,
) => {
  const input: DetectSpecializationInput = {
    stats: createStats(overrides),
    raceBase,
    baseHealth: BASE_HEALTH,
    weapons: { types: weaponTypes, hasHealWeapon },
  };
  return detectSpecialization(input).code;
};

describe('detectSpecialization', () => {
  it('returns polyvalent for a build without gains', () => {
    expect(detect({})).toBe('polyvalent');
  });

  it('detects the knowledge specializations', () => {
    expect(detect({ medicine: 250 })).toBe('medecin');
    expect(detect({ computing: 240 })).toBe('informaticien');
    expect(detect({ engineering: 230 })).toBe('ingenieur');
  });

  it('detects a stealth build', () => {
    expect(detect({ stealth: 220, agility: 140 })).toBe('furtif');
  });

  it('detects a tank from robustness and health', () => {
    expect(detect({ robustness: 190, health: 480 + BASE_HEALTH + 600 })).toBe(
      'tank',
    );
  });

  it('detects fighters according to their weapon', () => {
    expect(detect({ strength: 200, cacDamage: 10 }, ['2handsMelee'])).toBe(
      'combattant_cac',
    );
    expect(detect({ perception: 200, hitDamages: 10 }, ['1handShot'])).toBe(
      'tireur',
    );
  });

  it('does not call a melee build with perception a shooter', () => {
    expect(
      detect({ perception: 180, strength: 160 }, ['1handMelee', '1handMelee']),
    ).toBe('combattant_cac');
  });

  it('prefers support when a heal weapon is equipped', () => {
    expect(detect({ medicine: 300 }, ['2handsMelee'], true)).toBe('soutien');
  });

  it('detects support from team heal', () => {
    expect(detect({ teamHeal: 30 })).toBe('soutien');
  });

  it('returns polyvalent for balanced builds', () => {
    expect(detect({ medicine: 180, computing: 180, engineering: 175 })).toBe(
      'polyvalent',
    );
  });
});
