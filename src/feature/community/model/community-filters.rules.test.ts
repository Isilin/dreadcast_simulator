import { describe, expect, it } from 'vitest';

import {
  DEFAULT_COMMUNITY_FILTERS,
  filtersToApiQuery,
  filtersToSearch,
  hasAdvancedFilters,
  parseCommunitySearch,
  weaponFilterToItemTypes,
} from './community-filters.rules';
import type { CommunityFilters } from './community.types';
import {
  searchQuerySchema,
  hasAdvancedFilters as apiHasAdvancedFilters,
} from '../../../../lib/community.validation';

const fullFilters: CommunityFilters = {
  query: 'soigneur',
  specializations: ['medecin', 'soutien'],
  minRating: 4,
  races: ['Outrilien'],
  genders: ['female'],
  weaponKind: 'melee',
  weaponHands: 2,
  healOnly: true,
  gameVersion: 'v15',
  minStats: { medicine: 200, health: 900 },
  implants: ['Urgentiste', "Peau d'acier"],
  drugs: ['12'],
  items: ['606'],
  favoritesOnly: true,
  sort: 'top',
  page: 3,
};

describe('community filters', () => {
  it('uses defaults for an empty search', () => {
    expect(parseCommunitySearch({})).toEqual(DEFAULT_COMMUNITY_FILTERS);
    expect(filtersToSearch(DEFAULT_COMMUNITY_FILTERS)).toEqual({});
  });

  it('round-trips filters through the URL', () => {
    const search = filtersToSearch(fullFilters);
    expect(parseCommunitySearch({ ...search })).toEqual(fullFilters);
  });

  it('drops invalid URL values', () => {
    const filters = parseCommunitySearch({
      spec: 'medecin,pirate',
      minRating: 9,
      race: 'Orc,Martien',
      gender: 'robot',
      weapon: 'laser',
      hands: 3,
      minStats: 'medicine:150,unknown:3,health:abc',
      sort: 'random',
      page: -2,
    });

    expect(filters.specializations).toEqual(['medecin']);
    expect(filters.minRating).toBeNull();
    expect(filters.races).toEqual(['Orc']);
    expect(filters.genders).toEqual([]);
    expect(filters.weaponKind).toBeNull();
    expect(filters.weaponHands).toBeNull();
    expect(filters.minStats).toEqual({ medicine: 150 });
    expect(filters.sort).toBe('trending');
    expect(filters.page).toBe(1);
  });

  it('accepts values parsed as numbers by the router', () => {
    expect(parseCommunitySearch({ q: 1234 }).query).toBe('1234');
  });

  it('maps weapon filters to item types', () => {
    expect(weaponFilterToItemTypes(null, null)).toEqual([]);
    expect(weaponFilterToItemTypes('melee', 2)).toEqual(['2handsMelee']);
    expect(weaponFilterToItemTypes('shot', null)).toEqual([
      '1handShot',
      '2handsShot',
    ]);
    expect(weaponFilterToItemTypes(null, 1)).toEqual([
      '1handMelee',
      '1handShot',
    ]);
  });

  it('builds a query accepted by the API validation', () => {
    const query = Object.fromEntries(filtersToApiQuery(fullFilters));
    const parsed = searchQuerySchema.safeParse(query);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(parsed.data.spec).toEqual(['medecin', 'soutien']);
    expect(parsed.data.weapon).toEqual(['2handsMelee']);
    expect(parsed.data.minStats).toEqual({ medicine: 200, health: 900 });
    expect(parsed.data.implants).toEqual(['Urgentiste', "Peau d'acier"]);
    expect(parsed.data.page).toBe(3);
    expect(apiHasAdvancedFilters(parsed.data)).toBe(
      hasAdvancedFilters(fullFilters),
    );
  });

  it('flags subscriber-only filters', () => {
    expect(hasAdvancedFilters(DEFAULT_COMMUNITY_FILTERS)).toBe(false);
    expect(
      hasAdvancedFilters({
        ...DEFAULT_COMMUNITY_FILTERS,
        minStats: { medicine: 100 },
      }),
    ).toBe(true);
  });
});
