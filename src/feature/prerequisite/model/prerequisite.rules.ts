import type { Prerequisite, PrerequisiteContext } from './prerequisite.types';

import { StatValues, type Stat } from '@/domain';
import { createEmptyStats } from '@/utils/stats';

/**
 * Stats a prerequisite is checked against: race plus implants, without the
 * equipment, the kits or the drug.
 */
export const computePureStats = (
  raceStats: Partial<Record<Stat, number>> | undefined,
  implantsEffects: Record<Stat, number>,
): Record<Stat, number> => {
  const stats = createEmptyStats();
  (Object.keys(stats) as Stat[]).forEach((stat) => {
    stats[stat] = (raceStats?.[stat] ?? 0) + (implantsEffects[stat] ?? 0);
  });
  return stats;
};

export const isPrerequisiteMet = (
  prerequisite: Prerequisite,
  context: PrerequisiteContext,
): boolean => {
  switch (prerequisite.kind) {
    case 'stat':
      return context.pureStats[prerequisite.property] >= prerequisite.value;
    case 'title':
      return context.titles.includes(prerequisite.titleId);
    case 'implant':
      return (context.implants[prerequisite.implant] ?? 0) >= 1;
  }
};

export const findUnmetPrerequisites = (
  prerequisites: Prerequisite[] | undefined,
  context: PrerequisiteContext,
): Prerequisite[] =>
  (prerequisites ?? []).filter(
    (prerequisite) => !isPrerequisiteMet(prerequisite, context),
  );

export const arePrerequisitesMet = (
  prerequisites: Prerequisite[] | undefined,
  context: PrerequisiteContext,
): boolean => findUnmetPrerequisites(prerequisites, context).length === 0;

/**
 * Human readable prerequisite, with the current value of a stat, e.g.
 * "Agilité 50 (actuel 32)".
 */
export const formatPrerequisite = (
  prerequisite: Prerequisite,
  context: PrerequisiteContext,
  titleNames: Record<string, string>,
): string => {
  switch (prerequisite.kind) {
    case 'stat':
      return `${StatValues[prerequisite.property].label} ${prerequisite.value} (actuel ${context.pureStats[prerequisite.property]})`;
    case 'title':
      return `Titre : ${titleNames[prerequisite.titleId] ?? prerequisite.titleId}`;
    case 'implant':
      return `Implant : ${prerequisite.implant} (non installé)`;
  }
};

/** Stable React key of a prerequisite. */
export const prerequisiteKey = (prerequisite: Prerequisite): string => {
  switch (prerequisite.kind) {
    case 'stat':
      return `stat-${prerequisite.property}`;
    case 'title':
      return `title-${prerequisite.titleId}`;
    case 'implant':
      return `implant-${prerequisite.implant}`;
  }
};
