import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
  ImplantNameValues,
  type ImplantName,
  type ImplantsState,
} from './implant.types';

interface ImplantStore {
  implants: ImplantsState;
  setImplant: (name: ImplantName, level: number) => void;
  replaceImplants: (state: ImplantsState) => void;
}

export type ImplantsActions = Pick<
  ImplantStore,
  'setImplant' | 'replaceImplants'
>;

export const initialState: ImplantsState = Object.fromEntries(
  ImplantNameValues.map((name) => [name, 0]),
) as ImplantsState;

export const useImplantStore = create<ImplantStore>((set) => ({
  implants: initialState,
  setImplant: (name, level) => {
    set((s) => ({ implants: { ...s.implants, [name]: level } }));
  },
  replaceImplants: (implants) => set({ implants }),
}));

export const useImplantsState = (): ImplantsState =>
  useImplantStore((s) => s.implants);

export const useImplantsActions = (): ImplantsActions =>
  useImplantStore(
    useShallow((s) => ({
      setImplant: s.setImplant,
      replaceImplants: s.replaceImplants,
    })),
  );
