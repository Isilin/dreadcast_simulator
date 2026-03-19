import { Module } from '@nestjs/common';
import { ImplantsController } from './implants.controller';
import { ImplantsService } from './implants.service';

@Module({
  controllers: [ImplantsController],
  providers: [ImplantsService],
})
export class ImplantsModule {}
