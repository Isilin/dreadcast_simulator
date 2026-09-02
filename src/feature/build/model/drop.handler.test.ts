import { describe, expect, it, vi } from 'vitest';

import type { WorkbenchDragData, WorkbenchDropTarget } from './drag-drop.types';
import {
  handleDrop,
  type DropHandlerActions,
  type DropHandlerArgs,
} from './drop.handler';

import {
  ImplantNameValues,
  MAX_IMPLANTS,
  type ImplantsState,
} from '@/feature/implant';
import type { Item } from '@/feature/item';
import type { Kit, KitSelection } from '@/feature/kit';

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

const implant = {
  id: 1,
  name: 'Génie' as const,
  levelMax: 3,
  attributes: [],
  valuePerLevel: [1, 2, 3],
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
  deleteKit: vi.fn(),
  setKitNumber: vi.fn(),
  decreaseImplant: vi.fn(),
  setImplant: vi.fn(),
  setDrug: vi.fn(),
});

const createImplantsState = (level = 0): ImplantsState =>
  Object.fromEntries(
    ImplantNameValues.map((name) => [name, name === 'Génie' ? level : 0]),
  ) as ImplantsState;

const createArgs = (
  actions: DropHandlerActions,
  dragData: WorkbenchDragData | null,
  dropData: WorkbenchDropTarget | null,
  overrides: Partial<Pick<DropHandlerArgs, 'activeItem' | 'kits' | 'implants'>> = {},
): DropHandlerArgs => ({
  dragData,
  dropData,
  activeItem: null,
  kits: [],
  implants: createImplantsState(),
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
    const dragData = { kind: 'kit', kit, source: 'catalogue' } as const;

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

  it('installs implants and enforces the total implant limit', () => {
    const actions = createActions();
    const dragData = {
      kind: 'implant',
      implant,
      source: 'catalogue',
    } as const;

    const result = handleDrop(
      createArgs(actions, dragData, { kind: 'implant-bay' }, {
        implants: createImplantsState(1),
      }),
    );

    expect(result).toEqual({ message: 'Génie installé niveau 2.' });
    expect(actions.setImplant).toHaveBeenCalledWith('Génie', 2);

    const atLimit = handleDrop(
      createArgs(actions, dragData, { kind: 'implant-bay' }, {
        implants: Object.fromEntries(
          ImplantNameValues.map((name) => [name, MAX_IMPLANTS]),
        ) as ImplantsState,
      }),
    );
    expect(atLimit).toEqual({
      message: `Limite de ${MAX_IMPLANTS} implants atteinte.`,
    });
  });

  it('activates drugs and removes installed modules', () => {
    const actions = createActions();

    const drugResult = handleDrop(
      createArgs(
        actions,
        { kind: 'drug', drug, source: 'catalogue' },
        { kind: 'drug-slot' },
      ),
    );
    expect(drugResult).toEqual({ message: 'Stimulant activée.' });
    expect(actions.setDrug).toHaveBeenCalledWith('drug-1');

    const installedDrugResult = handleDrop(
      createArgs(
        actions,
        { kind: 'drug', drug, source: 'installed' },
        { kind: 'removal-dock', spot: 'head' },
      ),
    );
    expect(installedDrugResult).toEqual({ message: 'Stimulant désactivée.' });
    expect(actions.setDrug).toHaveBeenCalledWith(null);

    const installedImplantResult = handleDrop(
      createArgs(
        actions,
        { kind: 'implant', implant, source: 'installed' },
        { kind: 'removal-dock', spot: 'head' },
      ),
    );
    expect(installedImplantResult).toEqual({ message: 'Génie retiré.' });
    expect(actions.decreaseImplant).toHaveBeenCalledWith('Génie');
  });

  it('decrements kit quantity before deleting its selection', () => {
    const actions = createActions();
    const kits: KitSelection[] = [{ kit, number: 2 }];
    const dragData = { kind: 'kit', kit, source: 'installed' } as const;

    const decrementResult = handleDrop(
      createArgs(actions, dragData, { kind: 'removal-dock', spot: 'head' }, {
        kits,
      }),
    );
    expect(decrementResult).toEqual({ message: 'Blindage retiré de Tête.' });
    expect(actions.setKitNumber).toHaveBeenCalledWith('head', 0, 1);
    expect(actions.deleteKit).not.toHaveBeenCalled();

    const deleteResult = handleDrop(
      createArgs(actions, dragData, { kind: 'removal-dock', spot: 'head' }, {
        kits: [{ kit, number: 1 }],
      }),
    );
    expect(deleteResult).toEqual({ message: 'Blindage retiré de Tête.' });
    expect(actions.deleteKit).toHaveBeenCalledWith('head', 0);
  });

  it('reports when an installed kit is absent from its rack', () => {
    const actions = createActions();

    const result = handleDrop(
      createArgs(
        actions,
        { kind: 'kit', kit, source: 'installed' },
        { kind: 'removal-dock', spot: 'head' },
      ),
    );

    expect(result).toEqual({
      message: 'Kit non trouvé dans cet emplacement.',
    });
  });
});
