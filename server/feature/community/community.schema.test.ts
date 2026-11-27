import { describe, expect, it } from 'vitest';

import {
  PublishPayload,
  SearchQuery,
  STAT_KEYS,
  UpdatePayload,
} from './community.schema.js';

const decodeQuery = (input: unknown) => SearchQuery.safeParse(input);
const decodeQuerySync = (input: unknown) => SearchQuery.parse(input);

const isFailure = (result: { success: boolean }) => !result.success;
const isSuccess = (result: { success: boolean }) => result.success;

const zeroStats = () =>
  Object.fromEntries(STAT_KEYS.map((key) => [key, 0])) as Record<
    string,
    number
  >;

describe('SearchQuery', () => {
  it('applies the defaults', () => {
    expect(decodeQuerySync({})).toEqual({
      spec: [],
      race: [],
      gender: [],
      weapon: [],
      heal: false,
      minStats: {},
      implants: [],
      drugs: [],
      items: [],
      favorites: false,
      sort: 'trending',
      page: 1,
      pageSize: 24,
    });
  });

  it('parses lists, flags, numbers and stat thresholds', () => {
    expect(
      decodeQuerySync({
        q: '  tank ',
        spec: 'tank, medecin,,',
        race: 'Elfe',
        heal: '1',
        favorites: 'true',
        minRating: '4',
        minStats: 'strength:100,medicine:50',
        page: '3',
        pageSize: '12',
        sort: 'top',
      }),
    ).toMatchObject({
      q: 'tank',
      spec: ['tank', 'medecin'],
      race: ['Elfe'],
      heal: true,
      favorites: true,
      minRating: 4,
      minStats: { strength: 100, medicine: 50 },
      page: 3,
      pageSize: 12,
      sort: 'top',
    });
  });

  it.each([
    { spec: 'wizard' },
    { race: 'Dragon' },
    { minStats: 'luck:10' },
    { minStats: 'strength:abc' },
    { page: '0' },
    { page: '1.5' },
    { pageSize: '49' },
    { minRating: '6' },
    { sort: 'random' },
    { items: Array.from({ length: 31 }, (_, i) => `i${i}`).join(',') },
  ])('rejects %o', (query) => {
    expect(isFailure(decodeQuery(query))).toBe(true);
  });
});

describe('PublishPayload', () => {
  const valid = {
    slot: 1,
    title: '  Mon build  ',
    description: '',
    specialization: 'tank',
    detected_specialization: 'polyvalent',
    stats: zeroStats(),
  };

  it('trims the title', () => {
    expect(PublishPayload.parse(valid).title).toBe('Mon build');
  });

  it('requires every stat and nothing else', () => {
    const { strength: _, ...missing } = zeroStats();
    const decode = (input: unknown) => PublishPayload.safeParse(input);

    expect(isFailure(decode({ ...valid, stats: missing }))).toBe(true);
    expect(
      isFailure(decode({ ...valid, stats: { ...zeroStats(), luck: 1 } })),
    ).toBe(true);
    expect(
      isFailure(
        decode({ ...valid, stats: { ...zeroStats(), strength: 20000 } }),
      ),
    ).toBe(true);
  });
});

describe('UpdatePayload', () => {
  it('requires stats and detected specialization to refresh', () => {
    const decode = (input: unknown) => UpdatePayload.safeParse(input);
    const base = { title: 'Build', specialization: 'tank' };

    expect(isSuccess(decode(base))).toBe(true);
    expect(isFailure(decode({ ...base, refresh: true }))).toBe(true);
    expect(
      isSuccess(
        decode({
          ...base,
          refresh: true,
          stats: zeroStats(),
          detected_specialization: 'tank',
        }),
      ),
    ).toBe(true);
  });
});
