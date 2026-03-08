import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { DrugsState } from './drug.types';

interface DrugStore {
  drug: DrugsState;
  selectDrug: (id: string) => void;
  toggleDrug: (id: string) => void;
  deselectDrug: () => void;
  replaceDrug: (state: DrugsState) => void;
}

export type DrugActions = Pick<
  DrugStore,
  'selectDrug' | 'toggleDrug' | 'deselectDrug' | 'replaceDrug'
>;

export const initialState: DrugsState = null;

export const useDrugStore = create<DrugStore>((set) => ({
  drug: initialState,
  selectDrug: (id) => set({ drug: id }),
  toggleDrug: (id) =>
    set((state) => ({
      drug: state.drug === id ? null : id,
    })),
  deselectDrug: () => set({ drug: null }),
  replaceDrug: (drug) => set({ drug }),
}));

export const useDrugId = (): DrugsState => useDrugStore((s) => s.drug);

export const useDrugActions = (): DrugActions =>
  useDrugStore(
    useShallow((s) => ({
      selectDrug: s.selectDrug,
      toggleDrug: s.toggleDrug,
      deselectDrug: s.deselectDrug,
      replaceDrug: s.replaceDrug,
    })),
  );
