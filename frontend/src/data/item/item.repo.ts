import { fetchItemsMock } from './item.repo.mock';

import type { Item } from '@/domain/item';
import { USE_MOCK } from '@/utils/use-mock';

export async function fetchItems(type?: Item['type']): Promise<Item[]> {
  if (USE_MOCK) {
    return fetchItemsMock(type);
  }

  // Version “réelle” (plus tard)
  // const json = await api.get('items').json();
  // const validated = itemArraySchema.parse(json);
  // return validated.map(toDomain);

  // Pour l’instant, on renvoie le mock par défaut
  return fetchItemsMock(type);
}
