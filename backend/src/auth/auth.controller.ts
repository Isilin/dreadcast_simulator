import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new UnprocessableEntityException('Payload de connexion invalide');
    }

    return this.authService.login(parsed.data);
  }
}
