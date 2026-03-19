import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { KitsService } from './kits.service';

@Controller('kits')
export class KitsController {
  constructor(private readonly kitsService: KitsService) {}

  @Get()
  async findAll(
    @Query('query') query?: string,
    @Query('type') type?: string,
    @Query('id') id?: string,
  ) {
    if (id) {
      const kit = await this.kitsService.findById(id);
      if (!kit) {
        throw new NotFoundException('Kit not found');
      }
      return kit;
    }

    return this.kitsService.findAll(query, type);
  }
}
