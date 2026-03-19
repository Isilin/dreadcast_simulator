import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { DrugsService } from './drugs.service';

@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Get()
  async findAll(@Query('query') query?: string, @Query('id') id?: string) {
    if (id) {
      const drug = await this.drugsService.findById(id);
      if (!drug) {
        throw new NotFoundException('Drug not found');
      }
      return drug;
    }

    return this.drugsService.findAll(query);
  }
}
