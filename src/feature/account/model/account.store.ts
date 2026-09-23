import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface AccountDialogStore {
  isPseudoDialogOpen: boolean;
  openPseudoDialog: () => void;
  closePseudoDialog: () => void;
}

/**
 * The pseudo dialog is mounted once (AccountDialogs) and opened from the
 * account menu, which unmounts as soon as an entry is chosen.
 */
export const useAccountDialogStore = create<AccountDialogStore>((set) => ({
  isPseudoDialogOpen: false,
  openPseudoDialog: () => set({ isPseudoDialogOpen: true }),
  closePseudoDialog: () => set({ isPseudoDialogOpen: false }),
}));

export const usePseudoDialog = () =>
  useAccountDialogStore(
    useShallow((state) => ({
      isOpen: state.isPseudoDialogOpen,
      open: state.openPseudoDialog,
      close: state.closePseudoDialog,
    })),
  );
