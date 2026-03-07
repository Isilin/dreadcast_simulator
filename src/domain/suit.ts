export const ItemSpotValue = [
  'head',
  'chest',
  'legs',
  'feet',
  'secondary',
  'leftArm',
  'rightArm',
] as const;
export type ItemSpot = (typeof ItemSpotValue)[number];
