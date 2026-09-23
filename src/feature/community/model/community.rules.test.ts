import { describe, expect, it } from 'vitest';

import {
  computeSnapshotStats,
  findMissingSnapshotIds,
  getWeaponSummary,
  type BuildCatalogs,
} from './build-stats.rules';
import { SpecializationValues } from './community.types';
import { buildStatComparison } from './compare.rules';
import {
  buildPublishPayload,
  buildRefreshPayload,
  roundStats,
  validatePublicationDescription,
  validatePublicationTitle,
} from './publish-payload.rules';
import {
  publishPayloadSchema,
  RACE_TYPES,
  SPECIALIZATION_CODES,
  STAT_KEYS,
} from '../../../../lib/community.validation';

import { ItemSpotValue, StatValues, type Stat } from '@/domain';
import type { Item, ItemsState } from '@/feature/item';
import type { BuildSnapshot } from '@/feature/persistence';
import { RaceTypeValues } from '@/feature/profile';

const zeroStats = () =>
  Object.fromEntries(
    Object.keys(StatValues).map((stat) => [stat, 0]),
  ) as Record<Stat, number>;

const createSnapshot = (
  overrides: Partial<BuildSnapshot> = {},
): BuildSnapshot => ({
  profile: { race: 'Humain', gender: 'male' },
  implants: {} as BuildSnapshot['implants'],
  items: Object.fromEntries(
    ItemSpotValue.map((spot) => [spot, null]),
  ) as BuildSnapshot['items'],
  kits: Object.fromEntries(
    ItemSpotValue.map((spot) => [spot, []]),
  ) as unknown as BuildSnapshot['kits'],
  drug: null,
  ...overrides,
});

const staff: Item = {
  id: '606',
  name: 'Cobra F-750',
  image: '',
  tech: 100,
  integrity: 40,
  type: '2handsMelee',
  hands: 2,
  minHeal: 50,
  maxHeal: 150,
  effects: [{ property: 'medicine', value: 5 }],
};

const catalogs: BuildCatalogs = {
  items: [staff],
  kits: [
    {
      id: 'k1',
      name: 'Kit',
      tech: 10,
      type: 'head',
      effects: [{ property: 'health', value: 20 }],
    },
  ],
  implants: [
    {
      id: 8,
      name: 'Urgentiste',
      levelMax: 10,
      attributes: ['medicine'],
      valuePerLevel: [10, 20, 30],
    },
  ],
  drugs: [
    {
      id: 'd1',
      name: 'Drogue',
      image: '',
      sideEffects: [{ property: 'stamina', value: -10 }],
    },
  ],
  races: [{ type: 'Humain', medicine: 100, health: 480, stamina: 100 }],
};

describe('publication payload', () => {
  it('trims texts and rounds the 20 stats', () => {
    const payload = buildPublishPayload('3', {
      title: '  Médecin de guerre  ',
      description: '   ',
      specialization: 'medecin',
      detectedSpecialization: 'soutien',
      stats: { medicine: 212.3456 },
    });

    expect(payload.slot).toBe('3');
    expect(payload.title).toBe('Médecin de guerre');
    expect(payload.description).toBeNull();
    expect(payload.stats.medicine).toBe(212.35);
    expect(Object.keys(payload.stats)).toHaveLength(20);
    expect(payload.stats.health).toBe(0);
  });

  it('builds a refresh payload', () => {
    const payload = buildRefreshPayload({
      title: 'Tank',
      description: 'Solide',
      specialization: 'tank',
      detectedSpecialization: 'tank',
      stats: zeroStats(),
    });

    expect(payload.refresh).toBe(true);
    expect(payload.description).toBe('Solide');
  });

  it('validates title and description lengths', () => {
    expect(validatePublicationTitle('ab')).not.toBeNull();
    expect(validatePublicationTitle('  abc  ')).toBeNull();
    expect(validatePublicationTitle('a'.repeat(65))).not.toBeNull();
    expect(validatePublicationDescription('a'.repeat(1001))).not.toBeNull();
    expect(validatePublicationDescription('')).toBeNull();
  });

  it('produces a payload accepted by the API validation', () => {
    const payload = buildPublishPayload('1', {
      title: 'Build',
      description: '',
      specialization: 'polyvalent',
      detectedSpecialization: 'polyvalent',
      stats: roundStats({ strength: 101.5 }),
    });

    const parsed = publishPayloadSchema.safeParse({
      slot: Number(payload.slot),
      title: payload.title,
      description: payload.description,
      specialization: payload.specialization,
      detected_specialization: payload.detectedSpecialization,
      stats: payload.stats,
    });

    expect(parsed.success).toBe(true);
  });
});

describe('snapshot stats', () => {
  it('computes the stats of a snapshot from the catalogs', () => {
    const snapshot = createSnapshot({
      implants: { Urgentiste: 2 } as BuildSnapshot['implants'],
      items: {
        ...createSnapshot().items,
        leftArm: { id: '606' },
        rightArm: { id: '606' },
      },
      kits: { ...createSnapshot().kits, head: [{ id: 'k1', number: 2 }] },
      drug: 'd1',
    });

    const stats = computeSnapshotStats(snapshot, catalogs);

    // race 100 + implant level 2 (20) + staff once (5)
    expect(stats.medicine).toBe(125);
    // race 480 + base 116 + 2 kits x 20
    expect(stats.health).toBe(636);
    // race 100 + base 116 - drug 10
    expect(stats.stamina).toBe(206);
  });

  it('lists ids missing from the current catalogs', () => {
    const snapshot = createSnapshot({
      items: { ...createSnapshot().items, head: { id: 'removed-item' } },
      kits: {
        ...createSnapshot().kits,
        chest: [{ id: 'removed-kit', number: 1 }],
      },
      drug: 'removed-drug',
    });

    expect(findMissingSnapshotIds(snapshot, catalogs)).toEqual([
      'removed-item',
      'removed-kit',
      'removed-drug',
    ]);
  });

  it('summarizes the weapons held', () => {
    const items = {
      ...(Object.fromEntries(
        ItemSpotValue.map((spot) => [spot, null]),
      ) as ItemsState),
      leftArm: staff,
      rightArm: staff,
    };

    expect(getWeaponSummary(items)).toEqual({
      types: ['2handsMelee', '2handsMelee'],
      hasHealWeapon: true,
    });
  });
});

describe('stat comparison', () => {
  it('computes the difference for each stat', () => {
    const rows = buildStatComparison(
      { ...zeroStats(), medicine: 250.004 },
      { ...zeroStats(), medicine: 200 },
    );

    expect(rows).toHaveLength(20);
    expect(rows.find((row) => row.stat === 'medicine')).toMatchObject({
      tag: 'MED',
      published: 250,
      mine: 200,
      delta: 50,
    });
  });
});

describe('frontend and API constants', () => {
  it('share the stat order', () => {
    expect([...STAT_KEYS]).toEqual(Object.keys(StatValues));
  });

  it('share the specialization codes', () => {
    expect([...SPECIALIZATION_CODES]).toEqual([...SpecializationValues]);
  });

  it('share the race list', () => {
    expect([...RACE_TYPES]).toEqual([...RaceTypeValues]);
  });
});
