import { useImplantStore, useImplantsActions } from './implant.store';
import type { ImplantsState } from './implant.types';

export const useImplantsState = (): ImplantsState =>
  useImplantStore((s) => s.implants);

export const useImplantsDispatch = () => useImplantsActions();
