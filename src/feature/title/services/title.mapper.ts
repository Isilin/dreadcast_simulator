import type { TitleResponseDto } from './title.schema';
import type { Title } from '../model/title.types';

export const toDomain = (dto: TitleResponseDto): Title => ({
  id: dto.id,
  name: dto.name,
});
