import {
  ALL_GAME_VERSIONS,
  CommunitySortValues,
  SpecializationValues,
  WeaponHandsValues,
  WeaponKindValues,
  type CommunityFilters,
  type CommunitySort,
  type Specialization,
  type WeaponHands,
  type WeaponKind,
} from './community.types';

import { StatValues, type Stat } from '@/domain';
import type { ItemType } from '@/feature/item';
import { RaceTypeValues, type Gender, type RaceType } from '@/feature/profile';

export const COMMUNITY_PAGE_SIZE = 24;
const MAX_LIST_ENTRIES = 30;
const MAX_QUERY_LENGTH = 64;

export const DEFAULT_COMMUNITY_FILTERS: CommunityFilters = {
  query: '',
  specializations: [],
  minRating: null,
  races: [],
  genders: [],
  weaponKind: null,
  weaponHands: null,
  healOnly: false,
  gameVersion: null,
  minStats: {},
  implants: [],
  drugs: [],
  items: [],
  favoritesOnly: false,
  sort: 'trending',
  page: 1,
};

/**
 * Filters as stored in the /communaute URL (short, shareable, csv lists).
 */
export interface CommunityUrlSearch {
  q?: string;
  spec?: string;
  minRating?: number;
  race?: string;
  gender?: string;
  weapon?: WeaponKind;
  hands?: WeaponHands;
  heal?: boolean;
  version?: string;
  minStats?: string;
  implants?: string;
  drugs?: string;
  items?: string;
  favorites?: boolean;
  sort?: CommunitySort;
  page?: number;
}

const GENDERS: readonly Gender[] = ['male', 'female'];
const STAT_KEYS = Object.keys(StatValues) as Stat[];

const includes = <T>(values: readonly T[], value: unknown): value is T =>
  values.includes(value as T);

/** TanStack Router JSON-parses search values: accept strings and numbers. */
const asString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
};

const asBoolean = (value: unknown): boolean =>
  value === true || value === 'true' || value === 1 || value === '1';

const splitCsv = (value: unknown): string[] =>
  (asString(value) ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .slice(0, MAX_LIST_ENTRIES);

const joinCsv = (values: readonly string[]): string | undefined =>
  values.length > 0 ? values.join(',') : undefined;

const parseMinStats = (value: unknown): Partial<Record<Stat, number>> => {
  const entries = splitCsv(value).flatMap((part) => {
    const [stat, raw] = part.split(':');
    const threshold = Number(raw);
    return includes(STAT_KEYS, stat) && Number.isFinite(threshold)
      ? [[stat, threshold] as const]
      : [];
  });
  return Object.fromEntries(entries);
};

const serializeMinStats = (
  minStats: Partial<Record<Stat, number>>,
): string | undefined =>
  joinCsv(
    STAT_KEYS.flatMap((stat) =>
      minStats[stat] !== undefined ? [`${stat}:${minStats[stat]}`] : [],
    ),
  );

const parsePage = (value: unknown): number => {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= 1000 ? page : 1;
};

const parseMinRating = (value: unknown): number | null => {
  const rating = Number(value);
  return Number.isFinite(rating) && rating >= 1 && rating <= 5 ? rating : null;
};

/**
 * Converts raw URL search values to filters, dropping invalid entries.
 */
export const parseCommunitySearch = (
  raw: Record<string, unknown>,
): CommunityFilters => {
  const version = asString(raw.version);
  const hands = Number(raw.hands);

  return {
    query: (asString(raw.q) ?? '').slice(0, MAX_QUERY_LENGTH),
    specializations: splitCsv(raw.spec).filter(
      (entry): entry is Specialization => includes(SpecializationValues, entry),
    ),
    minRating: parseMinRating(raw.minRating),
    races: splitCsv(raw.race).filter((entry): entry is RaceType =>
      includes(RaceTypeValues, entry),
    ),
    genders: splitCsv(raw.gender).filter((entry): entry is Gender =>
      includes(GENDERS, entry),
    ),
    weaponKind: includes(WeaponKindValues, raw.weapon) ? raw.weapon : null,
    weaponHands: includes(WeaponHandsValues, hands) ? hands : null,
    healOnly: asBoolean(raw.heal),
    gameVersion:
      version && /^[a-z0-9._*-]{1,16}$/.test(version) ? version : null,
    minStats: parseMinStats(raw.minStats),
    implants: splitCsv(raw.implants),
    drugs: splitCsv(raw.drugs),
    items: splitCsv(raw.items),
    favoritesOnly: asBoolean(raw.favorites),
    sort: includes(CommunitySortValues, raw.sort) ? raw.sort : 'trending',
    page: parsePage(raw.page),
  };
};

/**
 * Filters to URL search, omitting default values.
 */
export const filtersToSearch = (
  filters: CommunityFilters,
): CommunityUrlSearch => {
  const search: CommunityUrlSearch = {
    q: filters.query.trim() || undefined,
    spec: joinCsv(filters.specializations),
    minRating: filters.minRating ?? undefined,
    race: joinCsv(filters.races),
    gender: joinCsv(filters.genders),
    weapon: filters.weaponKind ?? undefined,
    hands: filters.weaponHands ?? undefined,
    heal: filters.healOnly || undefined,
    version: filters.gameVersion ?? undefined,
    minStats: serializeMinStats(filters.minStats),
    implants: joinCsv(filters.implants),
    drugs: joinCsv(filters.drugs),
    items: joinCsv(filters.items),
    favorites: filters.favoritesOnly || undefined,
    sort: filters.sort === 'trending' ? undefined : filters.sort,
    page: filters.page > 1 ? filters.page : undefined,
  };

  return Object.fromEntries(
    Object.entries(search).filter(([, value]) => value !== undefined),
  ) as CommunityUrlSearch;
};

/**
 * Weapon kind and hands to the weapon item types to match (any of them).
 */
export const weaponFilterToItemTypes = (
  kind: WeaponKind | null,
  hands: WeaponHands | null,
): ItemType[] => {
  if (!kind && !hands) return [];

  const kinds: WeaponKind[] = kind ? [kind] : ['melee', 'shot'];
  const handCounts: WeaponHands[] = hands ? [hands] : [1, 2];

  return kinds.flatMap((weaponKind) =>
    handCounts.map((count): ItemType => {
      const prefix = count === 1 ? '1hand' : '2hands';
      return `${prefix}${weaponKind === 'melee' ? 'Melee' : 'Shot'}` as ItemType;
    }),
  );
};

/** Filters reading the publication content: subscribers only. */
export const hasAdvancedFilters = (filters: CommunityFilters): boolean =>
  Object.keys(filters.minStats).length > 0 ||
  filters.implants.length > 0 ||
  filters.drugs.length > 0 ||
  filters.items.length > 0 ||
  filters.favoritesOnly;

export const countActiveFilters = (filters: CommunityFilters): number =>
  [
    filters.query.trim().length > 0,
    filters.specializations.length > 0,
    filters.minRating !== null,
    filters.races.length > 0,
    filters.genders.length > 0,
    filters.weaponKind !== null || filters.weaponHands !== null,
    filters.healOnly,
    filters.gameVersion !== null,
    Object.keys(filters.minStats).length > 0,
    filters.implants.length > 0,
    filters.drugs.length > 0,
    filters.items.length > 0,
    filters.favoritesOnly,
  ].filter(Boolean).length;

/**
 * Query string of GET /api/community/builds (see lib/community.validation.ts).
 */
export const filtersToApiQuery = (
  filters: CommunityFilters,
  pageSize = COMMUNITY_PAGE_SIZE,
): URLSearchParams => {
  const params = new URLSearchParams();
  const set = (key: string, value: string | undefined) => {
    if (value !== undefined && value !== '') params.set(key, value);
  };

  set('q', filters.query.trim() || undefined);
  set('spec', joinCsv(filters.specializations));
  set('minRating', filters.minRating?.toString());
  set('race', joinCsv(filters.races));
  set('gender', joinCsv(filters.genders));
  set(
    'weapon',
    joinCsv(weaponFilterToItemTypes(filters.weaponKind, filters.weaponHands)),
  );
  set('heal', filters.healOnly ? '1' : undefined);
  set('version', filters.gameVersion ?? undefined);
  set('minStats', serializeMinStats(filters.minStats));
  set('implants', joinCsv(filters.implants));
  set('drugs', joinCsv(filters.drugs));
  set('items', joinCsv(filters.items));
  set('favorites', filters.favoritesOnly ? '1' : undefined);
  set('sort', filters.sort);
  set('page', String(filters.page));
  set('pageSize', String(pageSize));

  return params;
};

export const isAllVersions = (gameVersion: string | null) =>
  gameVersion === ALL_GAME_VERSIONS;
