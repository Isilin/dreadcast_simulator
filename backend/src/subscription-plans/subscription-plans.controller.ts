import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { SubscriptionPlansService } from './subscription-plans.service';

@Controller('subscription-plans')
@UseGuards(BearerAuthGuard)
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  @Get()
  async findAll(@Request() req: { accessToken: string }) {
    return this.subscriptionPlansService.findAll(req.accessToken);
  }
}
