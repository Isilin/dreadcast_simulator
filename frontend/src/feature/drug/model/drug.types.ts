import type { StatModifier } from '@/domain';

export interface Drug {
  id: string;
  name: string;
  image: string;
  sideEffects: StatModifier[];
}
