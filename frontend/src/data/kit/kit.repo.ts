import { fetchKitsMock } from './kit.repo.mock';

import type { Kit } from '@/domain';
import { USE_MOCK } from '@/utils/use-mock';

export async function fetchKits(
  type?: Kit['type'] | Array<Kit['type']>,
): Promise<Kit[]> {
  if (USE_MOCK) {
    return fetchKitsMock(type);
  }

  // Version “réelle” (plus tard)
  // const json = await api.get('kits').json();
  // const validated = kitArraySchema.parse(json);
  // return validated.map(toDomain);

  // Pour l’instant, on renvoie le mock par défaut
  return fetchKitsMock(type);
}
