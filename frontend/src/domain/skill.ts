export const SkillValues = [
  'strength',
  'agility',
  'robustness',
  'perception',
  'stealth',
  'computing',
  'medicine',
  'engineering',
] as const;
export type Skill = (typeof SkillValues)[number];

export const StatValues = [
  'strength',
  'agility',
  'robustness',
  'perception',
  'stealth',
  'computing',
  'medicine',
  'engineering',
  'health',
  'stamina',
  'speed',
  'race_damage',
  'hit_rating',
  'team_heal',
  'cac_damage',
  'critical_cac_chance',
  'critical_cac_damages',
  'hit_damages',
  'critical_hit_damages',
] as const;
export type Stat = (typeof StatValues)[number];

export const getNameFromSkill = (skill: Skill): string => {
  switch (skill) {
    case 'strength':
      return 'Force';
    case 'agility':
      return 'Agilité';
    case 'robustness':
      return 'Résistance';
    case 'perception':
      return 'Perception';
    case 'stealth':
      return 'Furtivité';
    case 'computing':
      return 'Informatique';
    case 'medicine':
      return 'Médecine';
    case 'engineering':
      return 'Ingénierie';
    default:
      throw new Error('Unknown skill.');
  }
};

export const getTagFromSkill = (skill: Skill): string => {
  switch (skill) {
    case 'strength':
      return 'FOR';
    case 'agility':
      return 'AGI';
    case 'robustness':
      return 'RES';
    case 'perception':
      return 'PER';
    case 'stealth':
      return 'FUR';
    case 'computing':
      return 'INF';
    case 'medicine':
      return 'MED';
    case 'engineering':
      return 'ING';
    default:
      throw new Error('Unknown skill.');
  }
};

export const getNameFromStat = (stat: Stat): string => {
  switch (stat) {
    case 'strength':
      return 'Force';
    case 'agility':
      return 'Agilité';
    case 'robustness':
      return 'Résistance';
    case 'perception':
      return 'Perception';
    case 'stealth':
      return 'Furtivité';
    case 'computing':
      return 'Informatique';
    case 'medicine':
      return 'Médecine';
    case 'engineering':
      return 'Ingénierie';
    case 'health':
      return 'Santé';
    case 'stamina':
      return 'Forme';
    case 'race_damage':
      return 'Dégâts aux autres races';
    case 'speed':
      return 'Vitesse';
    case 'hit_rating':
      return 'Score de toucher';
    case 'team_heal':
      return 'Soin équipe';
    case 'cac_damage':
      return 'Dégâts au CaC';
    case 'critical_cac_chance':
      return 'Chance de coup critique au CaC';
    case 'critical_cac_damages':
      return 'Dégâts des coups critiques au CaC';
    case 'hit_damages':
      return 'Dégâts au Tir';
    case 'critical_hit_damages':
      return 'Dégâts des coups critiques au Tir';
    default:
      throw new Error('Unknown stat.');
  }
};
