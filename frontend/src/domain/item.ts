import { getTagFromSkill, type Skill } from './skill';

export type ItemType =
  | 'head'
  | 'chest'
  | 'legs'
  | 'feet'
  | 'secondary'
  | 'left_arm'
  | 'right_arm';

export interface Prerequisite {
  skill: Skill;
  value: number;
}

export type Property = Skill | 'health' | 'stamina' | 'integrity' | 'speed';

export const getTagFromProperty = (property: Property): string => {
  switch (property) {
    case 'health':
      return 'SANTE';
    case 'stamina':
      return 'FORME';
    case 'integrity':
      return 'Etat max';
    case 'speed':
      return 'Vitesse';
    default:
      return getTagFromSkill(property as Skill);
  }
};

export interface Effect {
  property: Property;
  value: number;
}

export interface Item {
  id: string;
  name: string;
  image: string;
  tech: number;
  integrity: number;
  type: ItemType;
  prerequisites?: Prerequisite[];
  effects?: Effect[];
}
