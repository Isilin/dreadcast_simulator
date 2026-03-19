import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Get()
  async findAll(@Query('type') type?: string) {
    if (type) {
      const race = await this.racesService.findByType(type);
      if (!race) {
        throw new NotFoundException('Race not found');
      }
      return race;
    }

    return this.racesService.findAll();
  }
}
