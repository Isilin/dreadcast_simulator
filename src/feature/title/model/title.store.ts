import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { toggleTitleId } from './title.rules';
import type { TitlesState } from './title.types';

interface TitleStore {
  titles: TitlesState;
  toggleTitle: (id: string) => void;
  replaceTitles: (state: TitlesState) => void;
}

export type TitlesActions = Pick<TitleStore, 'toggleTitle' | 'replaceTitles'>;

export const initialState: TitlesState = [];

export const useTitleStore = create<TitleStore>((set) => ({
  titles: initialState,
  toggleTitle: (id) => set((s) => ({ titles: toggleTitleId(s.titles, id) })),
  replaceTitles: (titles) => set({ titles: [...titles].sort() }),
}));

export const useTitlesState = (): TitlesState => useTitleStore((s) => s.titles);

export const useTitlesActions = (): TitlesActions =>
  useTitleStore(
    useShallow((s) => ({
      toggleTitle: s.toggleTitle,
      replaceTitles: s.replaceTitles,
    })),
  );
