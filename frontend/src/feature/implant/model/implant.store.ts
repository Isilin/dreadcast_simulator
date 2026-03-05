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
  increaseImplant: (name: ImplantName) => void;
  decreaseImplant: (name: ImplantName) => void;
  replaceImplants: (state: ImplantsState) => void;
}

export const initialState: ImplantsState = Object.fromEntries(
  ImplantNameValues.map((name) => [name, 0]),
) as ImplantsState;

export const useImplantStore = create<ImplantStore>((set) => ({
  implants: initialState,
  setImplant: (name, level) =>
    set((s) => ({ implants: { ...s.implants, [name]: level } })),
  increaseImplant: (name) =>
    set((s) => ({ implants: { ...s.implants, [name]: s.implants[name] + 1 } })),
  decreaseImplant: (name) =>
    set((s) => ({ implants: { ...s.implants, [name]: s.implants[name] - 1 } })),
  replaceImplants: (implants) => set({ implants }),
}));

export const useImplantsActions = () =>
  useImplantStore(
    useShallow((s) => ({
      setImplant: s.setImplant,
      increaseImplant: s.increaseImplant,
      decreaseImplant: s.decreaseImplant,
      replaceImplants: s.replaceImplants,
    })),
  );
