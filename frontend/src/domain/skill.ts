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
