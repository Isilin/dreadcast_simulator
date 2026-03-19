import { Module } from '@nestjs/common';
import { DrugsController } from './drugs.controller';
import { DrugsService } from './drugs.service';

@Module({
  controllers: [DrugsController],
  providers: [DrugsService],
})
export class DrugsModule {}
