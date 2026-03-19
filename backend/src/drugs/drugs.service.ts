import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const DRUG_SELECT_QUERY = `
  id,
  name,
  image,
  stat_modifier (
    property,
    value
  )
`;

@Injectable()
export class DrugsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: string) {
    const client = this.supabase.createClient();
    let dbQuery = client.from('drug').select(DRUG_SELECT_QUERY);

    if (query?.trim()) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    const { data, error } = await dbQuery.order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async findById(id: string) {
    const client = this.supabase.createClient();
    const { data, error } = await client
      .from('drug')
      .select(DRUG_SELECT_QUERY)
      .eq('id', id)
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
