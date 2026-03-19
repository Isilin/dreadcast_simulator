import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

const SUBSCRIPTION_SELECT_QUERY = `
  id,
  user_id,
  plan_code,
  plan_name,
  price_cents,
  starts_at,
  ends_at,
  created_at
`;

const SUBSCRIPTION_PLAN_SELECT_QUERY = `
  code,
  label,
  duration_ingame_years,
  price_cents,
  sort_order
`;

const INFINITE_SUBSCRIPTION_END_ISO = '9999-12-31T23:59:59.999Z';

function buildSubscriptionDateRange(durationIngameYears: number | null): {
  startsAt: string;
  endsAt: string;
} {
  const now = new Date();
  const startsAt = now.toISOString();

  if (durationIngameYears === null) {
    return { startsAt, endsAt: INFINITE_SUBSCRIPTION_END_ISO };
  }

  const endsAtDate = new Date(now);
  endsAtDate.setUTCMonth(endsAtDate.getUTCMonth() + durationIngameYears);

  return { startsAt, endsAt: endsAtDate.toISOString() };
}

@Injectable()
export class SubscriptionsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getSubscriptions(accessToken: string) {
    const client = this.supabase.createClientWithAuth(accessToken);
    const { data: userData, error: userError } = await client.auth.getUser();

    if (userError || !userData.user) {
      throw new UnauthorizedException('Utilisateur non authentifie.');
    }

    const { data, error } = await client
      .from('subscription')
      .select(SUBSCRIPTION_SELECT_QUERY)
      .eq('user_id', userData.user.id)
      .order('starts_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ?? [];
  }

  async createSubscription(accessToken: string, planCode: string) {
    const client = this.supabase.createClientWithAuth(accessToken);
    const { data: userData, error: userError } = await client.auth.getUser();

    if (userError || !userData.user) {
      throw new UnauthorizedException('Utilisateur non authentifie.');
    }

    const { data: planData, error: planError } = await client
      .from('subscription_plan')
      .select(SUBSCRIPTION_PLAN_SELECT_QUERY)
      .eq('code', planCode)
      .eq('is_active', true)
      .single();

    if (planError || !planData) {
      throw new BadRequestException('Plan abonnement introuvable.');
    }

    const { startsAt, endsAt } = buildSubscriptionDateRange(
      planData.duration_ingame_years,
    );

    const { data, error } = await client
      .from('subscription')
      .insert({
        user_id: userData.user.id,
        plan_code: planData.code,
        plan_name: planData.label,
        price_cents: planData.price_cents,
        starts_at: startsAt,
        ends_at: endsAt,
      })
      .select(SUBSCRIPTION_SELECT_QUERY)
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}
