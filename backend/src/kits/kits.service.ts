import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const KIT_SELECT_QUERY = `
  id,
  name,
  tech,
  type,
  kit_effect (
    property,
    value
  )
`;

@Injectable()
export class KitsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: string, type?: string) {
    const client = this.supabase.createClient();
    let dbQuery = client.from('kit').select(KIT_SELECT_QUERY);

    if (query?.trim()) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    if (type?.trim()) {
      const types = type.split(',').map((t) => t.trim());
      dbQuery = dbQuery.in('type', types);
    }

    const { data, error } = await dbQuery.order('name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async findById(id: string) {
    const client = this.supabase.createClient();
    const { data, error } = await client
      .from('kit')
      .select(KIT_SELECT_QUERY)
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
