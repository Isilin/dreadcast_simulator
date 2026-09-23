import { useMemo } from 'react';

import type { BuildCatalogs } from '../model';

import { useDrugs } from '@/feature/drug';
import { useImplants } from '@/feature/implant';
import { useItems } from '@/feature/item';
import { useKits } from '@/feature/kit';
import { useRaces } from '@/feature/profile';

/**
 * Game catalogs needed to rebuild a snapshot outside the workbench stores.
 * Same queries as the workbench: already cached when coming from it.
 */
export const useBuildCatalogs = () => {
  const items = useItems();
  const kits = useKits();
  const implants = useImplants();
  const drugs = useDrugs();
  const races = useRaces();

  const catalogs = useMemo<BuildCatalogs | undefined>(() => {
    if (
      !items.data ||
      !kits.data ||
      !implants.data ||
      !drugs.data ||
      !races.data
    ) {
      return undefined;
    }

    return {
      items: items.data,
      kits: kits.data,
      implants: implants.data,
      drugs: drugs.data,
      races: races.data,
    };
  }, [drugs.data, implants.data, items.data, kits.data, races.data]);

  return {
    catalogs,
    isError:
      items.isError ||
      kits.isError ||
      implants.isError ||
      drugs.isError ||
      races.isError,
  };
};
