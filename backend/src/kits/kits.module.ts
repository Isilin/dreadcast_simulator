import { Module } from '@nestjs/common';
import { KitsController } from './kits.controller';
import { KitsService } from './kits.service';

@Module({
  controllers: [KitsController],
  providers: [KitsService],
})
export class KitsModule {}
