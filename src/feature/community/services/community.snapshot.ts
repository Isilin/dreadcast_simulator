import type { BuildDetail } from '@server/feature/community/community.schema';

import type { DecodedBuildDetail } from './community.mapper';

import { ItemSpotValue } from '@/domain';
import { ImplantNameValues } from '@/feature/implant';
import type { BuildSnapshot } from '@/feature/persistence';
import { RaceTypeValues } from '@/feature/profile';

/** Shape accepted from a published snapshot (the API keeps it opaque). */
interface PublishedSnapshot {
  name?: string;
  profile: BuildSnapshot['profile'];
  implants?: Record<string, number>;
  items?: Record<string, { id: string; damageBonus?: number } | null>;
  kits?: Record<string, Array<{ id: string; number: number }>>;
  drug?: string | null;
  titles?: string[];
}

type Json = Record<string, unknown>;

const isRecord = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIntBetween = (value: unknown, min: number, max: number) =>
  Number.isInteger(value) &&
  (value as number) >= min &&
  (value as number) <= max;

/** Validates every value of a record; null when one is invalid. */
const mapRecord = <T>(
  value: unknown,
  parse: (entry: unknown) => T | undefined,
): Record<string, T> | undefined | null => {
  if (value === undefined) return undefined;
  if (!isRecord(value)) return null;
  const parsed: Record<string, T> = {};
  for (const [key, entry] of Object.entries(value)) {
    const result = parse(entry);
    if (result === undefined) return null;
    parsed[key] = result;
  }
  return parsed;
};

/** Item of a spot: `{ id, damageBonus? }` (other keys dropped) or null. */
const parseItem = (value: unknown) => {
  if (value === null) return null;
  if (!isRecord(value) || typeof value.id !== 'string') return undefined;
  if (value.damageBonus === undefined) return { id: value.id };
  return isIntBetween(value.damageBonus, 0, 5)
    ? { id: value.id, damageBonus: value.damageBonus as number }
    : undefined;
};

const parseKits = (value: unknown) => {
  if (!Array.isArray(value)) return undefined;
  const kits: Array<{ id: string; number: number }> = [];
  for (const kit of value) {
    if (
      !isRecord(kit) ||
      typeof kit.id !== 'string' ||
      !isIntBetween(kit.number, 0, Number.MAX_SAFE_INTEGER)
    ) {
      return undefined;
    }
    kits.push({ id: kit.id, number: kit.number as number });
  }
  return kits;
};

const parseNumber = (value: unknown) =>
  typeof value === 'number' ? value : undefined;

const parsePublished = (value: unknown): PublishedSnapshot | null => {
  if (!isRecord(value)) return null;
  const { name, profile, drug, titles } = value;

  if (name !== undefined && typeof name !== 'string') return null;
  if (
    !isRecord(profile) ||
    !(RaceTypeValues as readonly unknown[]).includes(profile.race) ||
    (profile.gender !== 'male' && profile.gender !== 'female')
  ) {
    return null;
  }
  if (drug !== undefined && drug !== null && typeof drug !== 'string') {
    return null;
  }
  if (
    titles !== undefined &&
    !(
      Array.isArray(titles) &&
      titles.every((title) => typeof title === 'string')
    )
  ) {
    return null;
  }

  const implants = mapRecord(value.implants, parseNumber);
  const items = mapRecord(value.items, parseItem);
  const kits = mapRecord(value.kits, parseKits);
  if (implants === null || items === null || kits === null) return null;

  return {
    name,
    profile: {
      race: profile.race as BuildSnapshot['profile']['race'],
      gender: profile.gender,
    },
    implants,
    items,
    kits,
    drug: drug as string | null | undefined,
    titles: titles as string[] | undefined,
  };
};

/**
 * Community snapshots are untrusted JSON: validate them, then normalize them
 * to a complete BuildSnapshot (every spot and implant present) instead of
 * casting. Null when the snapshot is invalid.
 */
export const toBuildSnapshot = (snapshot: unknown): BuildSnapshot | null => {
  const published = parsePublished(snapshot);
  if (!published) return null;

  return {
    name: published.name,
    profile: published.profile,
    implants: Object.fromEntries(
      ImplantNameValues.map((name) => [name, published.implants?.[name] ?? 0]),
    ) as BuildSnapshot['implants'],
    items: Object.fromEntries(
      ItemSpotValue.map((spot) => [spot, published.items?.[spot] ?? null]),
    ) as BuildSnapshot['items'],
    kits: Object.fromEntries(
      ItemSpotValue.map((spot) => [spot, published.kits?.[spot] ?? []]),
    ) as BuildSnapshot['kits'],
    drug: published.drug ?? null,
    titles: [...new Set(published.titles ?? [])].sort(),
  };
};

/**
 * Build detail with its snapshot decoded (null content when locked); null
 * when the snapshot is invalid.
 */
export const decodeDetailSnapshot = (
  dto: BuildDetail,
): DecodedBuildDetail | null => {
  if (!dto.content) {
    return { ...dto, content: null };
  }
  const snapshot = toBuildSnapshot(dto.content.snapshot);
  return snapshot
    ? { ...dto, content: { snapshot, stats: dto.content.stats } }
    : null;
};
