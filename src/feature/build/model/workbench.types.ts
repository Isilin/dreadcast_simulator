import type { ItemSpot } from '@/domain';

export type WorkbenchMode = 'equipment' | 'implants';
export type CatalogueFilter = 'equipment' | 'kits' | 'implants' | 'drugs';

export const workbenchSlotLabels: Record<ItemSpot, string> = {
  head: 'Tête',
  chest: 'Torse',
  legs: 'Jambes',
  feet: 'Pieds',
  leftArm: 'Main gauche',
  rightArm: 'Main droite',
  secondary: 'Secondaire',
};

export const bodySlots: ItemSpot[] = ['head', 'chest', 'legs', 'feet'];
export const weaponSlots: ItemSpot[] = ['leftArm', 'rightArm', 'secondary'];

export const getModeTitle = (
  mode: WorkbenchMode,
  catalogueFilter: CatalogueFilter,
): string => {
  if (mode === 'implants') return "Baie d'implants";
  if (catalogueFilter === 'kits') return 'Gestion des kits';
  return "Poste d'équipement";
};

export const getModeTarget = (
  mode: WorkbenchMode,
  catalogueFilter: CatalogueFilter,
  spot: ItemSpot,
): string => {
  if (mode === 'implants') return 'Build actif';
  if (catalogueFilter === 'drugs') return 'Emplacement drogue';
  return workbenchSlotLabels[spot];
};
