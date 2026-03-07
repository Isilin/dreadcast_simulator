import type { DrugResponseDto } from './drug.dto';
import { toDomain } from './drug.mapper';
import { fetchDrugsMock } from './drug.repo.mock';
import type { Drug } from '../model/drug.types';

// import { USE_MOCK } from '@/utils/use-mock';

export async function fetchDrugs(): Promise<Drug[]> {
  // if (USE_MOCK) {
  //   return fetchDrugsMock();
  // }

  try {
    const response = await fetch('/api/drugs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const drugs: DrugResponseDto[] = await response.json();
    return drugs.map(toDomain);
  } catch (error) {
    console.error('Failed to fetch drugs:', error);
    // Fallback to mock en cas d'erreur
    return fetchDrugsMock();
  }
}
