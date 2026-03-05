import { useDrugStore, useDrugsActions } from './drug.store';
import type { DrugsState } from './drug.types';

export const useDrugsState = (): DrugsState => useDrugStore((s) => s.drug);

export const useDrugsDispatch = () => useDrugsActions();
