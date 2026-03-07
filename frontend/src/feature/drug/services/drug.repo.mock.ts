import { toDomain } from './drug.mapper';
import { MOCK_DRUGS } from './drugs.mock';
import type { Drug } from '../model/drug.types';

import { sleep } from '@/utils/sleep';

export async function fetchDrugsMock(): Promise<Drug[]> {
  await sleep(1000);

  const sorted = [...MOCK_DRUGS].sort((a, b) => a.name.localeCompare(b.name));

  return sorted.map(toDomain);
}
