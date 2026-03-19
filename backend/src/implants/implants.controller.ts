import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ImplantsService } from './implants.service';

@Controller('implants')
export class ImplantsController {
  constructor(private readonly implantsService: ImplantsService) {}

  @Get()
  async findAll(@Query('query') query?: string, @Query('name') name?: string) {
    if (name) {
      const implant = await this.implantsService.findByName(name);
      if (!implant) {
        throw new NotFoundException('Implant not found');
      }
      return implant;
    }

    return this.implantsService.findAll(query);
  }
}
