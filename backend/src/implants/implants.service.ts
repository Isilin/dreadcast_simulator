import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const IMPLANT_SELECT_QUERY = `
  name,
  level_max,
  implant_attribute (
    attribute
  ),
  implant_value (
    level,
    value
  )
`;

@Injectable()
export class ImplantsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: string) {
    const client = this.supabase.createClient();
    let dbQuery = client.from('implant').select(IMPLANT_SELECT_QUERY);

    if (query?.trim()) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    const { data, error } = await dbQuery.order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async findByName(name: string) {
    const client = this.supabase.createClient();
    const { data, error } = await client
      .from('implant')
      .select(IMPLANT_SELECT_QUERY)
      .eq('name', name)
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
