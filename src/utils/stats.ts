import { StatValues, type Stat, type StatModifier } from '@/domain';

/**
 * Creates an object with all stats initialized to 0
 */
export const createEmptyStats = (): Record<Stat, number> => {
  return Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;
};

/**
 * Keeps the non-zero stats of a stats object, in the StatValues order.
 */
export const statRecordToModifiers = (
  stats: Record<Stat, number>,
): StatModifier[] =>
  (Object.keys(StatValues) as Stat[])
    .filter((property) => stats[property] !== 0)
    .map((property) => ({ property, value: stats[property] }));

/**
 * Adds up modifiers of the same stat, e.g. an item effect and its kits.
 */
export const sumStatModifiers = (modifiers: StatModifier[]): StatModifier[] => {
  const stats = createEmptyStats();
  modifiers.forEach(({ property, value }) => {
    stats[property] += value;
  });
  return statRecordToModifiers(stats);
};
