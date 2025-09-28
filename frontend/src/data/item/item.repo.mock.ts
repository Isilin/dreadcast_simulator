import { MOCK_CHEST_ITEMS } from './chest-items.mock';
import { MOCK_FEET_ITEMS } from './feet-items.mock';
import { MOCK_HEAD_ITEMS } from './head-items.mock';
import { toDomain } from './item.mapper';
import { itemArrayResponseSchema } from './item.schema';
import { MOCK_LEGS_ITEMS } from './legs-items.mock';
import { MOCK_SECONDARY_ITEMS } from './secondary-items.mock';
import { MOCK_WEAPONS_ITEMS } from './weapons-items.mock';

import type { Item } from '@/domain';
import { sleep } from '@/utils/sleep';

export async function fetchItemsMock(type?: Item['type']): Promise<Item[]> {
  await sleep(1000);
  const MOCK_ITEMS = [
    ...MOCK_HEAD_ITEMS,
    ...MOCK_CHEST_ITEMS,
    ...MOCK_LEGS_ITEMS,
    ...MOCK_FEET_ITEMS,
    ...MOCK_SECONDARY_ITEMS,
    ...MOCK_WEAPONS_ITEMS,
  ];
  const validated = itemArrayResponseSchema.parse(MOCK_ITEMS);

  const filtered = type
    ? validated.filter((item) => item.type === type)
    : validated;

  const ordered = filtered.sort((a, b) => a.name.localeCompare(b.name));

  const items = ordered.map(toDomain);
  return items;
}
