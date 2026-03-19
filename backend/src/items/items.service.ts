import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const ITEM_SELECT_QUERY = `
  id,
  name,
  image,
  tech,
  integrity,
  type,
  min_damage,
  max_damage,
  damage_bonus,
  hands,
  reach,
  hits_per_round,
  item_prerequisite (
    property,
    value
  ),
  item_effect (
    property,
    value
  )
`;

@Injectable()
export class ItemsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: string, type?: string) {
    const client = this.supabase.createClient();
    let dbQuery = client.from('item').select(ITEM_SELECT_QUERY);

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
      .from('item')
      .select(ITEM_SELECT_QUERY)
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
