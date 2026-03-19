import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(
    @Query('query') query?: string,
    @Query('type') type?: string,
    @Query('id') id?: string,
  ) {
    if (id) {
      const item = await this.itemsService.findById(id);
      if (!item) {
        throw new NotFoundException('Item not found');
      }
      return item;
    }

    return this.itemsService.findAll(query, type);
  }
}
