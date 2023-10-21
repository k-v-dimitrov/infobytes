import { FactCategories } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CategoryTypeDto {
  @IsEnum(FactCategories)
  category: FactCategories;
}
