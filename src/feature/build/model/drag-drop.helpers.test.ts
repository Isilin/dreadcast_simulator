import { describe, expect, it } from 'vitest';

import {
  getDraggedData,
  getDragIdentifier,
  getDropAnnouncement,
  getDropData,
} from './drag-drop.helpers';

const item = {
  id: 'item-1',
  name: 'Casque léger',
  image: '/casque.webp',
  tech: 2,
  integrity: 90,
  type: 'head' as const,
};

const kit = {
  id: 'kit-1',
  name: 'Blindage',
  tech: 3,
  type: 'head' as const,
  effects: [],
};

const drug = {
  id: 'drug-1',
  name: 'Stimulant',
  image: '/stimulant.webp',
  sideEffects: [],
};

describe('workbench drag and drop helpers', () => {
  it('rejects malformed drag and drop payloads', () => {
    expect(getDraggedData(null)).toBeNull();
    expect(getDraggedData({ kind: 'item', item: { id: 'item-1' } })).toBeNull();
    expect(getDraggedData({ kind: 'unknown' })).toBeNull();
    expect(getDropData(null)).toBeNull();
    expect(getDropData({ kind: 'item-slot', spot: 'invalid' })).toBeNull();
    expect(getDropData({ kind: 'unknown', spot: 'head' })).toBeNull();
  });

  it('normalizes valid payloads and produces stable identifiers', () => {
    const itemData = getDraggedData({ kind: 'item', item });
    const kitData = getDraggedData({
      kind: 'kit',
      kit,
      source: 'installed',
    });
    const drugData = getDraggedData({
      kind: 'drug',
      drug,
      source: 'installed',
    });

    expect(itemData).toEqual({ kind: 'item', item });
    expect(kitData).toEqual({ kind: 'kit', kit, source: 'installed' });
    expect(drugData).toEqual({ kind: 'drug', drug, source: 'installed' });
    expect(getDragIdentifier(itemData!)).toBe('item-1');
    expect(getDragIdentifier(kitData!)).toBe('installed-kit-1');
    expect(getDragIdentifier(drugData!)).toBe('installed-drug-1');
    expect(getDropData({ kind: 'item-slot', spot: 'head' })).toEqual({
      kind: 'item-slot',
      spot: 'head',
    });
    expect(getDropData({ kind: 'drug-slot' })).toEqual({
      kind: 'drug-slot',
    });
    expect(getDropData({ kind: 'implant-bay' })).toBeNull();
    expect(
      getDraggedData({ kind: 'implant', implant: {}, source: 'catalogue' }),
    ).toBeNull();
  });

  it('announces compatible and incompatible destinations', () => {
    const itemData = getDraggedData({ kind: 'item', item })!;
    const kitData = getDraggedData({
      kind: 'kit',
      kit,
      source: 'catalogue',
    })!;
    const drugData = getDraggedData({
      kind: 'drug',
      drug,
      source: 'catalogue',
    })!;
    const installedDrugData = getDraggedData({
      kind: 'drug',
      drug,
      source: 'installed',
    })!;

    expect(
      getDropAnnouncement(itemData, { kind: 'item-slot', spot: 'head' }),
    ).toBe('Déposer Casque léger sur Tête.');
    expect(
      getDropAnnouncement(kitData, { kind: 'kit-rack', spot: 'head' }),
    ).toBe('Déposer Blindage sur Tête.');
    expect(getDropAnnouncement(drugData, { kind: 'drug-slot' })).toBe(
      'Activer Stimulant.',
    );
    expect(
      getDropAnnouncement(installedDrugData, {
        kind: 'removal-dock',
        spot: 'head',
      }),
    ).toBe('Retirer Stimulant du build.');
    expect(
      getDropAnnouncement(itemData, { kind: 'item-slot', spot: 'chest' }),
    ).toBe('Cette zone n’accepte pas cet élément.');
  });
});
