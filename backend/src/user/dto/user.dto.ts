import { FactCategories } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class PatchUserDto {
  @IsBoolean()
  @IsOptional()
  isOnboarded?: boolean;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsOptional()
  @IsArray()
  @IsEnum(FactCategories, { each: true })
  categories?: Array<FactCategories>;
}
