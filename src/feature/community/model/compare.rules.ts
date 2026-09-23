import { StatValues, type Stat } from '@/domain';

export interface StatComparisonRow {
  stat: Stat;
  label: string;
  tag: string;
  published: number;
  mine: number;
  /** published - mine: positive when the published build is higher. */
  delta: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Stat by stat comparison between a published build and one of mine.
 */
export const buildStatComparison = (
  published: Record<Stat, number>,
  mine: Record<Stat, number>,
): StatComparisonRow[] =>
  (Object.keys(StatValues) as Stat[]).map((stat) => ({
    stat,
    label: StatValues[stat].label,
    tag: StatValues[stat].tag,
    published: round(published[stat] ?? 0),
    mine: round(mine[stat] ?? 0),
    delta: round((published[stat] ?? 0) - (mine[stat] ?? 0)),
  }));
