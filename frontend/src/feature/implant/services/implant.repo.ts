import { fetchImplantsMock } from './implant.repo.mock';

import type { Implant } from '@/feature/implant';
import { USE_MOCK } from '@/utils/use-mock';

export async function fetchImplants(): Promise<Implant[]> {
  if (USE_MOCK) {
    return fetchImplantsMock();
  }

  // Version “réelle” (plus tard)
  // const json = await api.get('implants').json();
  // const validated = implantArraySchema.parse(json);
  // return validated.map(toDomain);

  // Pour l’instant, on renvoie le mock par défaut
  return fetchImplantsMock();
}
