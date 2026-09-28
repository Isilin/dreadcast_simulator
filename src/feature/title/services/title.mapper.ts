import type { Title as TitleDto } from '@server/feature/catalog/catalog.schema';

import type { Title } from '../model/title.types';

export const toDomain = (dto: TitleDto): Title => ({
  id: dto.id,
  name: dto.name,
});
