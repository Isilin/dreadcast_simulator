import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { SubscriptionsService } from './subscriptions.service';

const createSubscriptionSchema = z.object({
  planCode: z.string().min(1),
});

@Controller('subscriptions')
@UseGuards(BearerAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async getSubscriptions(@Request() req: { accessToken: string }) {
    return this.subscriptionsService.getSubscriptions(req.accessToken);
  }

  @Post()
  @HttpCode(201)
  async createSubscription(
    @Request() req: { accessToken: string },
    @Body() body: unknown,
  ) {
    const parsed = createSubscriptionSchema.safeParse(body);
    if (!parsed.success) {
      throw new UnprocessableEntityException('Payload abonnement invalide.');
    }

    return this.subscriptionsService.createSubscription(
      req.accessToken,
      parsed.data.planCode,
    );
  }
}
