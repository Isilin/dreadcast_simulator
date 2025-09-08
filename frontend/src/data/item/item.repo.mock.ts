import type { ItemResponseDto } from './item.dto';
import { toDomain } from './item.mapper';
import { itemArrayResponseSchema } from './item.schema';

import type { Item } from '@/domain/item';
import { sleep } from '@/utils/sleep';

const MOCK_ITEMS: ItemResponseDto[] = [
  {
    id: '1',
    name: 'Item 1',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'head',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '2',
    name: 'Item 2',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '3',
    name: 'Item 3',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'legs',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '4',
    name: 'Item 4',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'feet',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '5',
    name: 'Item 5',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'secondary',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '6',
    name: 'Item 6',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'head',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '7',
    name: 'Item 7',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '8',
    name: 'Item 8',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'legs',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '9',
    name: 'Item 9',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'feet',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '10',
    name: 'Item 10',
    image: 'https://wiki.dreadcast.net/images/d/d5/ARMURE_ANCIENNE_HEAUME.png',
    tech: 0,
    integrity: 0,
    type: 'secondary',
    prerequisites: [
      {
        skill: 'strength',
        value: 5,
      },
      {
        skill: 'agility',
        value: 3,
      },
    ],
    effects: [
      {
        property: 'health',
        value: 10,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
];

export async function fetchItemsMock(type?: Item['type']): Promise<Item[]> {
  await sleep(1000);
  const validated = itemArrayResponseSchema.parse(MOCK_ITEMS);

  const filtered = type
    ? validated.filter((item) => item.type === type)
    : validated;

  const items = filtered.map(toDomain);
  return items;
}
