import { toDomain } from './drug.mapper';
import { drugArrayResponseSchema } from './drug.schema';
import { MOCK_DRUGS } from './drugs.mock';
import type { Drug } from '../model/drug.types';

import { sleep } from '@/utils/sleep';

export async function fetchDrugsMock(): Promise<Drug[]> {
  await sleep(1000);
  const validated = drugArrayResponseSchema.parse(MOCK_DRUGS);

  const sorted = validated.sort((a, b) => a.name.localeCompare(b.name));

  return sorted.map(toDomain);
}
