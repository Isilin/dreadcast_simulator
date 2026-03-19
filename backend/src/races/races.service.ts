import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const RACE_SELECT_QUERY = `
  type,
  strength,
  agility,
  robustness,
  perception,
  stealth,
  computing,
  medicine,
  engineering,
  health,
  stamina
`;

@Injectable()
export class RacesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    const client = this.supabase.createClient();
    const { data, error } = await client
      .from('race')
      .select(RACE_SELECT_QUERY)
      .order('type', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async findByType(type: string) {
    const client = this.supabase.createClient();
    const { data, error } = await client
      .from('race')
      .select(RACE_SELECT_QUERY)
      .eq('type', type)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  }
}
