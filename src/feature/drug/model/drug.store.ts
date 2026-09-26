import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { DrugsState } from './drug.types';

interface DrugStore {
  drug: DrugsState;
  setDrug: (id: DrugsState) => void;
  toggleDrug: (id: string) => void;
  replaceDrug: (state: DrugsState) => void;
}

export type DrugActions = Pick<
  DrugStore,
  'setDrug' | 'toggleDrug' | 'replaceDrug'
>;

export const initialState: DrugsState = null;

export const useDrugStore = create<DrugStore>((set) => ({
  drug: initialState,
  setDrug: (drug) => set({ drug }),
  toggleDrug: (id) => {
    set((state) => ({
      drug: state.drug === id ? null : id,
    }));
  },
  replaceDrug: (drug) => set({ drug }),
}));

export const useDrugId = (): DrugsState => useDrugStore((s) => s.drug);

export const useDrugActions = (): DrugActions =>
  useDrugStore(
    useShallow((s) => ({
      setDrug: s.setDrug,
      toggleDrug: s.toggleDrug,
      replaceDrug: s.replaceDrug,
    })),
  );
