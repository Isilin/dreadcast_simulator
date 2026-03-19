import { Module } from '@nestjs/common';
import { SubscriptionPlansController } from './subscription-plans.controller';
import { SubscriptionPlansService } from './subscription-plans.service';

@Module({
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService],
})
export class SubscriptionPlansModule {}
