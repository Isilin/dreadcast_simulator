import { beforeEach, describe, expect, it } from 'vitest';

import { initialState, useItemStore } from './item.store';
import type { Item } from './item.types';

const weapon = (hands: number): Item => ({
  id: `weapon-${hands}`,
  name: 'Arme',
  image: '',
  tech: 100,
  integrity: 100,
  type: hands > 1 ? '2handsMelee' : '1handMelee',
  hands,
});

describe('item store', () => {
  beforeEach(() => {
    useItemStore.setState({ items: initialState });
  });

  it('removes a one-handed weapon without touching the other arm', () => {
    useItemStore.getState().setItem('leftArm', weapon(1));
    useItemStore.getState().setItem('rightArm', weapon(1));

    useItemStore.getState().resetItem('leftArm');

    expect(useItemStore.getState().items.leftArm).toBeNull();
    expect(useItemStore.getState().items.rightArm).toEqual(
      expect.objectContaining({ id: 'weapon-1' }),
    );
  });

  it('removes a two-handed weapon from both arms', () => {
    useItemStore.getState().setItem('leftArm', weapon(2));

    useItemStore.getState().resetItem('leftArm');

    expect(useItemStore.getState().items.leftArm).toBeNull();
    expect(useItemStore.getState().items.rightArm).toBeNull();
  });
});
