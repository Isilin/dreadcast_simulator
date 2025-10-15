import type { Kit } from '../model';
import { MOCK_CHEST_KITS } from './chest-kits.mock';
import { MOCK_FEET_KITS } from './feet-kits.mock';
import { MOCK_HEAD_KITS } from './head-kits.mock';
import { toDomain } from './kit.mapper';
import { kitArrayResponseSchema } from './kit.schema';
import { MOCK_LEGS_KITS } from './legs-kits.mock';
import { MOCK_SECONDARY_KITS } from './secondary-kits.mock';
import { MOCK_WEAPONS_KITS } from './weapons-kits.mock';

import { sleep } from '@/utils/sleep';

export async function fetchKitsMock(type?: Kit['type'] | Array<Kit['type']>): Promise<Kit[]> {
  await sleep(1000);
  const MOCK_KITS = [
    ...MOCK_HEAD_KITS,
    ...MOCK_CHEST_KITS,
    ...MOCK_LEGS_KITS,
    ...MOCK_FEET_KITS,
    ...MOCK_SECONDARY_KITS,
    ...MOCK_WEAPONS_KITS,
  ];
  const validated = kitArrayResponseSchema.parse(MOCK_KITS);

  let filtered = [];

  if (Array.isArray(type)) {
    filtered = validated.filter((item) => type.includes(item.type));
  } else if (type) {
    filtered = validated.filter((item) => item.type === type);
  } else {
    filtered = validated;
  }

  const ordered = filtered.sort((a, b) => a.tech - b.tech);

  const kits = ordered.map(toDomain);
  return kits;
}
