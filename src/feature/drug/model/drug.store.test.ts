import { beforeEach, describe, expect, it } from 'vitest';

import { initialState, useDrugStore } from './drug.store';

describe('drug store', () => {
  beforeEach(() => {
    useDrugStore.setState({ drug: initialState });
  });

  it('selects a dropped drug without toggling it off on a repeated drop', () => {
    useDrugStore.getState().setDrug('drug-1');
    useDrugStore.getState().setDrug('drug-1');

    expect(useDrugStore.getState().drug).toBe('drug-1');
  });

  it('replaces the active drug and clears it explicitly', () => {
    useDrugStore.getState().setDrug('drug-1');
    useDrugStore.getState().setDrug('drug-2');

    expect(useDrugStore.getState().drug).toBe('drug-2');

    useDrugStore.getState().setDrug(null);

    expect(useDrugStore.getState().drug).toBeNull();
  });
});
