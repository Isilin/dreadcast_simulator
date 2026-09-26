import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { DrugsState } from './drug.types';

interface DrugStore {
  drug: DrugsState;
  setDrug: (id: DrugsState) => void;
  replaceDrug: (state: DrugsState) => void;
}

export type DrugActions = Pick<DrugStore, 'setDrug' | 'replaceDrug'>;

export const initialState: DrugsState = null;

export const useDrugStore = create<DrugStore>((set) => ({
  drug: initialState,
  setDrug: (drug) => set({ drug }),
  replaceDrug: (drug) => set({ drug }),
}));

export const useDrugId = (): DrugsState => useDrugStore((s) => s.drug);

export const useDrugActions = (): DrugActions =>
  useDrugStore(
    useShallow((s) => ({
      setDrug: s.setDrug,
      replaceDrug: s.replaceDrug,
    })),
  );
