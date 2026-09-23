import type { Specialization } from './community.types';

import { SkillValues, type Skill, type Stat } from '@/domain';
import type { ItemType } from '@/feature/item';

/** Below this total skill gain, a build has no marked specialization. */
export const MIN_TOTAL_SCORE = 30;
/** Minimal share of the best specialization among all scores. */
export const MIN_BEST_SHARE = 0.35;
/** Minimal lead of the best specialization over the second one. */
export const MIN_LEAD_SHARE = 0.08;
/** Weight of a mismatching weapon (e.g. perception with a melee weapon). */
export const WEAPON_MISMATCH_FACTOR = 0.4;
/** Health points counting as one skill point for the tank score. */
export const HEALTH_POINTS_PER_SCORE = 10;
/** Secondary damage stats are small numbers: weight them up. */
export const SECONDARY_STAT_WEIGHT = 2;
export const TEAM_HEAL_WEIGHT = 3;

export interface SpecializationWeapons {
  types: ItemType[];
  hasHealWeapon: boolean;
}

export interface DetectSpecializationInput {
  stats: Record<Stat, number>;
  /** Race base values (skills and health), used to measure the build gains. */
  raceBase: Partial<Record<Stat, number>> | undefined;
  /** Base health added to every character (see BASE_HEALTH_STAMINA). */
  baseHealth: number;
  weapons: SpecializationWeapons;
}

export interface SpecializationDetection {
  code: Specialization;
  scores: Record<Exclude<Specialization, 'polyvalent'>, number>;
}

const MELEE_TYPES: readonly ItemType[] = ['1handMelee', '2handsMelee'];
const SHOT_TYPES: readonly ItemType[] = ['1handShot', '2handsShot'];

const positive = (value: number) => (value > 0 ? value : 0);

const weaponFactor = (weapons: ItemType[], expected: readonly ItemType[]) => {
  const handWeapons = weapons.filter(
    (type) => MELEE_TYPES.includes(type) || SHOT_TYPES.includes(type),
  );
  if (handWeapons.length === 0) return 1;
  return handWeapons.some((type) => expected.includes(type))
    ? 1
    : WEAPON_MISMATCH_FACTOR;
};

/**
 * Suggests a specialization from the final stats of a build. The author can
 * override it when publishing; the detected value is stored alongside.
 */
export const detectSpecialization = ({
  stats,
  raceBase,
  baseHealth,
  weapons,
}: DetectSpecializationInput): SpecializationDetection => {
  const gain = Object.fromEntries(
    SkillValues.map((skill) => [
      skill,
      positive(stats[skill] - (raceBase?.[skill] ?? 100)),
    ]),
  ) as Record<Skill, number>;

  const healthGain = positive(
    stats.health - (raceBase?.health ?? 0) - baseHealth,
  );

  const scores: SpecializationDetection['scores'] = {
    medecin: gain.medicine,
    informaticien: gain.computing,
    ingenieur: gain.engineering,
    furtif: gain.stealth + 0.25 * gain.agility,
    tank: gain.robustness + healthGain / HEALTH_POINTS_PER_SCORE,
    combattant_cac:
      (gain.strength + positive(stats.cacDamage) * SECONDARY_STAT_WEIGHT) *
      weaponFactor(weapons.types, MELEE_TYPES),
    tireur:
      (gain.perception + positive(stats.hitDamages) * SECONDARY_STAT_WEIGHT) *
      weaponFactor(weapons.types, SHOT_TYPES),
    soutien: positive(stats.teamHeal) * TEAM_HEAL_WEIGHT,
  };

  if (weapons.hasHealWeapon) {
    return { code: 'soutien', scores };
  }

  const ranked = (
    Object.entries(scores) as Array<[keyof typeof scores, number]>
  ).sort((a, b) => b[1] - a[1]);
  const total = ranked.reduce((sum, [, score]) => sum + score, 0);

  if (total < MIN_TOTAL_SCORE) {
    return { code: 'polyvalent', scores };
  }

  const [best, second] = ranked;
  const bestShare = best[1] / total;
  const lead = (best[1] - (second?.[1] ?? 0)) / total;

  if (bestShare < MIN_BEST_SHARE || lead < MIN_LEAD_SHARE) {
    return { code: 'polyvalent', scores };
  }

  return { code: best[0], scores };
};
