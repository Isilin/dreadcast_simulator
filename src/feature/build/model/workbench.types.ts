import type { ItemSpot } from '@/domain';

/** Tabs of the catalogue panel. */
export type CatalogueTab = 'equipment' | 'drugs';
/** What the catalogue lists: kits are reached from an equipment slot. */
export type CatalogueFilter = 'equipment' | 'kits' | 'drugs';

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

export const getCatalogueTab = (filter: CatalogueFilter): CatalogueTab =>
  filter === 'drugs' ? 'drugs' : 'equipment';

export const getWorkspaceTitle = (catalogueFilter: CatalogueFilter): string =>
  catalogueFilter === 'kits' ? 'Gestion des kits' : "Poste d'équipement";
