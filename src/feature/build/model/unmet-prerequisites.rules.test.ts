import { describe, expect, it } from 'vitest';

import { collectUnmetPrerequisites } from './unmet-prerequisites.rules';

import { initialState as implantsInitialState } from '@/feature/implant/model/implant.store';
import type { Item, ItemsState } from '@/feature/item';
import { initialState as itemsInitialState } from '@/feature/item/model/item.store';
import type { Kit, KitsState } from '@/feature/kit';
import { initialState as kitsInitialState } from '@/feature/kit/model/kit.store';
import type { PrerequisiteContext } from '@/feature/prerequisite';
import { createEmptyStats } from '@/utils/stats';

const context: PrerequisiteContext = {
  pureStats: { ...createEmptyStats(), agility: 40 },
  titles: [],
  implants: implantsInitialState,
};

const helmet: Item = {
  id: 'helmet',
  name: 'Casque',
  image: '/casque.webp',
  tech: 300,
  integrity: 90,
  type: 'head',
  prerequisites: [
    { kind: 'stat', property: 'agility', value: 30 },
    { kind: 'stat', property: 'agility', value: 50 },
  ],
};

const rifle: Item = {
  id: 'rifle',
  name: 'Fusil',
  image: '/fusil.webp',
  tech: 200,
  integrity: 80,
  type: '2handsShot',
  hands: 2,
  prerequisites: [{ kind: 'title', titleId: 'sentinelle' }],
};

const lamp: Kit = {
  id: 'lamp',
  name: 'Lampe',
  tech: 60,
  type: 'head',
  effects: [],
  prerequisites: [{ kind: 'implant', implant: 'Génie' }],
};

const freeKit: Kit = { ...lamp, id: 'free', name: 'Libre', prerequisites: [] };

describe('collectUnmetPrerequisites', () => {
  it('lists the items and kits with unmet prerequisites, in slot order', () => {
    const items: ItemsState = {
      ...itemsInitialState,
      head: helmet,
      leftArm: rifle,
      rightArm: rifle,
    };
    const kits: KitsState = {
      ...kitsInitialState,
      head: [
        { kit: lamp, number: 1 },
        { kit: freeKit, number: 2 },
      ],
    };

    expect(collectUnmetPrerequisites(items, kits, context)).toEqual([
      {
        spot: 'head',
        kind: 'item',
        name: 'Casque',
        unmet: [{ kind: 'stat', property: 'agility', value: 50 }],
      },
      {
        spot: 'head',
        kind: 'kit',
        name: 'Lampe',
        unmet: [{ kind: 'implant', implant: 'Génie' }],
      },
      {
        spot: 'leftArm',
        kind: 'item',
        name: 'Fusil',
        unmet: [{ kind: 'title', titleId: 'sentinelle' }],
      },
    ]);
  });

  it('is empty when every prerequisite is met', () => {
    const items: ItemsState = { ...itemsInitialState, head: helmet };

    expect(
      collectUnmetPrerequisites(items, kitsInitialState, {
        ...context,
        pureStats: { ...context.pureStats, agility: 50 },
      }),
    ).toEqual([]);
  });
});
