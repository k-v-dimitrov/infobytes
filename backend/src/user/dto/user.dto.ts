import { FactCategories } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
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

export class UserFactCategoriesResponseDto {
  @Expose()
  category: string;
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  displayName: string;

  @Expose()
  isOnboarded: boolean;

  @Expose({ name: 'UserFactCategory' })
  @Type(() => UserFactCategoriesResponseDto)
  categories: UserFactCategoriesResponseDto[];
}
