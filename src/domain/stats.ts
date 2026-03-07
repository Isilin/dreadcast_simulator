export const StatValues = {
  strength: { tag: 'FOR', label: 'Force' },
  agility: { tag: 'AGI', label: 'Agilité' },
  robustness: { tag: 'RES', label: 'Résistance' },
  perception: { tag: 'PER', label: 'Perception' },
  stealth: { tag: 'FUR', label: 'Furtivité' },
  computing: { tag: 'INF', label: 'Informatique' },
  medicine: { tag: 'MED', label: 'Médecine' },
  engineering: { tag: 'ING', label: 'Ingénierie' },
  health: { tag: 'SANT', label: 'Santé' },
  stamina: { tag: 'FORM', label: 'Forme' },
  integrity: { tag: 'ETAT', label: 'Etat max' },
  speed: { tag: 'VIT', label: 'Vitesse' },
  raceDamage: { tag: 'RD', label: 'Dégâts aux autres races' },
  hitRating: { tag: 'HR', label: 'Score de toucher' },
  teamHeal: { tag: 'TH', label: 'Soin équipe' },
  cacDamage: { tag: 'CD', label: 'Dégâts au CaC' },
  criticalCacChance: { tag: 'CCC', label: 'Chance de coup critique au CaC' },
  criticalCacDamage: { tag: 'CCD', label: 'Dégâts des coups critiques au CaC' },
  hitDamages: { tag: 'HD', label: 'Dégâts au Tir' },
  criticalHitDamage: { tag: 'CHD', label: 'Dégâts des coups critiques au Tir' },
};
export type Stat = keyof typeof StatValues;

export interface StatModifier {
  property: Stat;
  value: number;
}
