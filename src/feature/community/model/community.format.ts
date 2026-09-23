import type { ItemSpot } from '@/domain';
import type { ItemType } from '@/feature/item';
import type { Gender } from '@/feature/profile';

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Homme',
  female: 'Femme',
};

export const SPOT_LABELS: Record<ItemSpot, string> = {
  head: 'Tête',
  chest: 'Torse',
  legs: 'Jambes',
  feet: 'Pieds',
  leftArm: 'Main gauche',
  rightArm: 'Main droite',
  secondary: 'Secondaire',
};

const WEAPON_TYPE_LABELS: Partial<Record<ItemType, string>> = {
  '1handMelee': 'CaC 1 main',
  '2handsMelee': 'CaC 2 mains',
  '1handShot': 'Tir 1 main',
  '2handsShot': 'Tir 2 mains',
};

/**
 * "CaC 2 mains · Soin" style summary of the weapons of a build.
 */
export const describeWeapons = (
  weaponTypes: readonly ItemType[],
  hasHealWeapon: boolean,
): string => {
  const labels = [...new Set(weaponTypes)].flatMap((type) =>
    WEAPON_TYPE_LABELS[type] ? [WEAPON_TYPE_LABELS[type]] : [],
  );
  if (hasHealWeapon) labels.push('Soin');
  return labels.length > 0 ? labels.join(' · ') : 'Sans arme';
};

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });
const statFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 2,
});

export const formatCommunityDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
};

export const formatStatValue = (value: number): string =>
  statFormatter.format(value);

export const formatSignedStatValue = (value: number): string =>
  value > 0 ? `+${formatStatValue(value)}` : formatStatValue(value);

/** Updates within a minute of the publication are not worth mentioning. */
export const wasUpdatedAfterPublication = (
  publishedAt: string,
  contentUpdatedAt: string,
): boolean =>
  new Date(contentUpdatedAt).getTime() - new Date(publishedAt).getTime() >
  60 * 1000;
