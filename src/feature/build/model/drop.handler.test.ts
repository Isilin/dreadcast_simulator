import { describe, expect, it, vi } from 'vitest';

import type { WorkbenchDragData, WorkbenchDropTarget } from './drag-drop.types';
import {
  handleDrop,
  type DropHandlerActions,
  type DropHandlerArgs,
} from './drop.handler';

import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

const item: Item = {
  id: 'item-1',
  name: 'Casque léger',
  image: '/casque.webp',
  tech: 2,
  integrity: 90,
  type: 'head',
};

const kit: Kit = {
  id: 'kit-1',
  name: 'Blindage',
  tech: 3,
  type: 'head',
  effects: [],
};

const drug = {
  id: 'drug-1',
  name: 'Stimulant',
  image: '/stimulant.webp',
  sideEffects: [],
};

const createActions = (): DropHandlerActions => ({
  setItem: vi.fn(),
  addKit: vi.fn(),
  setDrug: vi.fn(),
});

const createArgs = (
  actions: DropHandlerActions,
  dragData: WorkbenchDragData | null,
  dropData: WorkbenchDropTarget | null,
  overrides: Partial<Pick<DropHandlerArgs, 'activeItem'>> = {},
): DropHandlerArgs => ({
  dragData,
  dropData,
  activeItem: null,
  ...overrides,
  ...actions,
});

describe('handleDrop', () => {
  it('rejects missing or incompatible drop data without mutation', () => {
    const actions = createActions();

    expect(handleDrop(createArgs(actions, null, null))).toEqual({
      message: 'Élément non déplacé.',
    });
    expect(
      handleDrop(
        createArgs(
          actions,
          { kind: 'item', item },
          { kind: 'item-slot', spot: 'chest' },
        ),
      ),
    ).toEqual({ message: 'Cette zone n’accepte pas cet élément.' });
    expect(actions.setItem).not.toHaveBeenCalled();
  });

  it('equips compatible items and selects their slot', () => {
    const actions = createActions();

    const result = handleDrop(
      createArgs(
        actions,
        { kind: 'item', item },
        { kind: 'item-slot', spot: 'head' },
      ),
    );

    expect(result).toEqual({
      message: 'Casque léger équipé sur Tête.',
      nextSpot: 'head',
    });
    expect(actions.setItem).toHaveBeenCalledWith('head', item);
  });

  it('adds kits only when active item type matches', () => {
    const actions = createActions();
    const dragData = { kind: 'kit', kit } as const;

    const result = handleDrop(
      createArgs(actions, dragData, { kind: 'kit-rack', spot: 'head' }, {
        activeItem: item,
      }),
    );

    expect(result).toEqual({
      message: 'Blindage ajouté à Tête.',
      nextSpot: 'head',
    });
    expect(actions.addKit).toHaveBeenCalledWith('head', kit);

    const rejected = handleDrop(
      createArgs(actions, dragData, { kind: 'kit-rack', spot: 'chest' }, {
        activeItem: { ...item, type: 'chest' },
      }),
    );
    expect(rejected).toEqual({ message: 'Cette zone n’accepte pas cet élément.' });
  });

  it('activates drugs on the drug slot', () => {
    const actions = createActions();

    const drugResult = handleDrop(
      createArgs(actions, { kind: 'drug', drug }, { kind: 'drug-slot' }),
    );
    expect(drugResult).toEqual({ message: 'Stimulant activée.' });
    expect(actions.setDrug).toHaveBeenCalledWith('drug-1');
  });
});
