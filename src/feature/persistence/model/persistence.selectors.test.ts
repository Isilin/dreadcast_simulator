import { describe, expect, it } from 'vitest';

import {
  areBuildsEqual,
  getBuildNameForSlot,
  getBuildSlots,
  parseSlot,
  resolveInitialSlot,
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
  it('parses only positive integer slots', () => {
    expect(parseSlot('3')).toBe('3');
    expect(parseSlot(12)).toBe('12');
    expect(parseSlot('0')).toBeNull();
    expect(parseSlot('1.5')).toBeNull();
    expect(parseSlot('abc')).toBeNull();
    expect(parseSlot(null)).toBeNull();
  });

  it('prefers the explicit slot, then the last active slot', () => {
    expect(resolveInitialSlot(7, '3')).toBe('7');
    expect(resolveInitialSlot(undefined, '3')).toBe('3');
    expect(resolveInitialSlot(undefined, 'broken')).toBe('1');
    expect(resolveInitialSlot(undefined, null)).toBe('1');
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
    expect(
      areBuildsEqual(previousBuild, createSnapshot({ titles: ['sentinelle'] })),
    ).toBe(false);
  });

  it('treats a build saved before the titles as having none', () => {
    expect(
      areBuildsEqual(createSnapshot(), createSnapshot({ titles: [] })),
    ).toBe(true);
  });

  it('compares missing builds safely', () => {
    const snapshot = createSnapshot();

    expect(areBuildsEqual(null, undefined)).toBe(false);
    expect(areBuildsEqual(snapshot, null)).toBe(false);
    expect(areBuildsEqual(null, null)).toBe(true);
  });
});
