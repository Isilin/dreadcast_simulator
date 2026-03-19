import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const client = this.supabase.createClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message ?? 'Connexion refusée');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }
}
