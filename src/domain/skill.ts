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
