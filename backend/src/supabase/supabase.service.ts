import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly anonKey: string;

  constructor() {
    this.url =
      process.env.SIMULATOR_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_URL ||
      '';
    this.anonKey =
      process.env.SIMULATOR_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY ||
      '';
  }

  createClient(): SupabaseClient {
    return createClient(this.url, this.anonKey);
  }

  createClientWithAuth(accessToken: string): SupabaseClient {
    return createClient(this.url, this.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }
}
