import { fetchDrugsMock } from './drug.repo.mock';
import type { Drug } from '../model/drug.types';

import { USE_MOCK } from '@/utils/use-mock';

export async function fetchDrugs(): Promise<Drug[]> {
  if (USE_MOCK) {
    return fetchDrugsMock();
  }

  // Version "réelle" (plus tard)
  // const json = await api.get('drugs').json();
  // const validated = drugArraySchema.parse(json);
  // return validated.map(toDomain);

  // Pour l'instant, on renvoie le mock par défaut
  return fetchDrugsMock();
}
