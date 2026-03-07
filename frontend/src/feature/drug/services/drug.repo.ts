import type { DrugResponseDto } from './drug.dto';
import { toDomain } from './drug.mapper';
import type { Drug } from '../model/drug.types';

export async function fetchDrugs(): Promise<Drug[]> {
  const response = await fetch('/api/drugs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch drugs: ${response.statusText}`);
  }

  const drugs: DrugResponseDto[] = await response.json();
  return drugs.map(toDomain);
}
