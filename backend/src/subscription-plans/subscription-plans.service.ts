import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const SUBSCRIPTION_PLAN_SELECT_QUERY = `
  code,
  label,
  duration_ingame_years,
  price_cents,
  sort_order
`;

@Injectable()
export class SubscriptionPlansService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(accessToken: string) {
    const client = this.supabase.createClientWithAuth(accessToken);
    const { data: userData, error: userError } = await client.auth.getUser();

    if (userError || !userData.user) {
      throw new UnauthorizedException('Utilisateur non authentifie.');
    }

    const { data, error } = await client
      .from('subscription_plan')
      .select(SUBSCRIPTION_PLAN_SELECT_QUERY)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ?? [];
  }
}
