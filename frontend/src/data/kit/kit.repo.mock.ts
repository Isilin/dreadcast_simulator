import type { KitResponseDto } from './kit.dto';
import { toDomain } from './kit.mapper';
import { kitArrayResponseSchema } from './kit.schema';

import type { Kit } from '@/domain/kit';
import { sleep } from '@/utils/sleep';

const MOCK_KITS: KitResponseDto[] = [
  {
    id: '0',
    name: 'Kit elfique',
    tech: 0,
    type: 'head',
    effects: [{ property: 'perception', value: 5 }],
  },
  {
    id: '1',
    name: 'Kit elfique',
    tech: 0,
    type: 'chest',
    effects: [{ property: 'perception', value: 5 }],
  },
  {
    id: '2',
    name: 'Kit elfique',
    tech: 0,
    type: 'legs',
    effects: [{ property: 'perception', value: 5 }],
  },
  {
    id: '3',
    name: 'Kit elfique',
    tech: 0,
    type: 'feet',
    effects: [{ property: 'perception', value: 5 }],
  },
  {
    id: '4',
    name: 'Kit elfique',
    tech: 0,
    type: 'secondary',
    effects: [{ property: 'perception', value: 5 }],
  },
];

export async function fetchKitsMock(type?: Kit['type']): Promise<Kit[]> {
  await sleep(1000);
  const validated = kitArrayResponseSchema.parse(MOCK_KITS);

  const filtered = type
    ? validated.filter((item) => item.type === type)
    : validated;

  const kits = filtered.map(toDomain);
  return kits;
}
