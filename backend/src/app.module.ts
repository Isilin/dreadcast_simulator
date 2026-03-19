import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { ImplantsModule } from './implants/implants.module';
import { ItemsModule } from './items/items.module';
import { KitsModule } from './kits/kits.module';
import { DrugsModule } from './drugs/drugs.module';
import { RacesModule } from './races/races.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';

@Module({
  imports: [
    SupabaseModule,
    ImplantsModule,
    ItemsModule,
    KitsModule,
    DrugsModule,
    RacesModule,
    AuthModule,
    SubscriptionsModule,
    SubscriptionPlansModule,
  ],
})
export class AppModule {}
