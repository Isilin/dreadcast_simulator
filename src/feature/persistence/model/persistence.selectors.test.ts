import { describe, expect, it } from 'vitest';

import {
  areBuildsEqual,
  getBuildNameForSlot,
  getBuildSlots,
  hasValidSubscription,
} from './persistence.selectors';
import type { BuildSnapshot } from '../services/persistence.service';

import { ItemSpotValue } from '@/domain';
import { ImplantNameValues } from '@/feature/implant';

const createSnapshot = (
  overrides: Partial<BuildSnapshot> = {},
): BuildSnapshot => ({
  profile: { race: 'Humain', gender: 'male' },
  implants: Object.fromEntries(
    ImplantNameValues.map((name) => [name, 0]),
  ) as unknown as BuildSnapshot['implants'],
  items: Object.fromEntries(
    ItemSpotValue.map((spot) => [spot, null]),
  ) as unknown as BuildSnapshot['items'],
  kits: Object.fromEntries(
    ItemSpotValue.map((spot) => [spot, []]),
  ) as unknown as BuildSnapshot['kits'],
  drug: null,
  ...overrides,
});

describe('persistence selectors', () => {
  it('accepts only validated subscriptions that have not ended', () => {
    const now = Date.parse('2026-01-01T00:00:00.000Z');

    expect(
      hasValidSubscription(
        [{ status: 'validated', endsAt: '2026-01-01T00:00:00.000Z' }],
        now,
      ),
    ).toBe(true);
    expect(
      hasValidSubscription(
        [{ status: 'pending', endsAt: '2026-12-31T00:00:00.000Z' }],
        now,
      ),
    ).toBe(false);
    expect(
      hasValidSubscription(
        [{ status: 'validated', endsAt: '2025-12-31T23:59:59.000Z' }],
        now,
      ),
    ).toBe(false);
    expect(
      hasValidSubscription(
        [{ status: 'validated', endsAt: 'not-a-date' }],
        now,
      ),
    ).toBe(false);
  });

  it('returns fixed guest and free authenticated slots', () => {
    expect(
      getBuildSlots({ mode: 'local', hasUnlimitedSlots: false, builds: {} }),
    ).toEqual(['1']);
    expect(
      getBuildSlots({ mode: 'remote', hasUnlimitedSlots: false, builds: {} }),
    ).toEqual(['1', '2', '3', '4', '5']);
  });

  it('keeps one empty slot after the highest unlimited build', () => {
    expect(
      getBuildSlots({
        mode: 'remote',
        hasUnlimitedSlots: true,
        builds: { '7': createSnapshot() },
      }),
    ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });

  it('normalizes persisted names and falls back to slot names', () => {
    expect(getBuildNameForSlot({}, '2')).toBe('Build 2');
    expect(
      getBuildNameForSlot({ '2': createSnapshot({ name: '  Combat  ' }) }, '2'),
    ).toBe('Combat');
    expect(
      getBuildNameForSlot({ '2': createSnapshot({ name: '   ' }) }, '2'),
    ).toBe('Build 2');
  });

  it('ignores build name and save date when comparing builds', () => {
    const previousBuild = createSnapshot({ name: 'Ancien nom', savedAt: 1 });
    const nextBuild = createSnapshot({ name: 'Nouveau nom', savedAt: 2 });

    expect(areBuildsEqual(previousBuild, nextBuild)).toBe(true);
  });

  it('detects changes in persisted build content', () => {
    const previousBuild = createSnapshot();

    expect(
      areBuildsEqual(
        previousBuild,
        createSnapshot({ profile: { race: 'Orc', gender: 'male' } }),
      ),
    ).toBe(false);
    expect(
      areBuildsEqual(previousBuild, createSnapshot({ drug: 'drug-1' })),
    ).toBe(false);
  });

  it('compares missing builds safely', () => {
    const snapshot = createSnapshot();

    expect(areBuildsEqual(null, undefined)).toBe(false);
    expect(areBuildsEqual(snapshot, null)).toBe(false);
    expect(areBuildsEqual(null, null)).toBe(true);
  });
});
