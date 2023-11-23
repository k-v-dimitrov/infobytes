import { $Enums, FactCategories } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class FactIdDto {
  @IsUUID()
  id: string;
}

export class CreateFactDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  sourceUrl: string;

  @IsEnum(FactCategories)
  @IsOptional()
  categoryType?: FactCategories;
}

export class PutFactDto extends CreateFactDto {
  @IsUUID()
  factId: string;
}

export class PatchFactDto {
  @IsUUID()
  factId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsEnum(FactCategories)
  @IsOptional()
  categoryType?: FactCategories;
}

export class SearchFactDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}

export class AddFactForReviewDto {
  @IsUUID()
  factId: string;
}

export class DeleteFactForReviewDto {
  @IsUUID()
  factId: string;
}

export class FactResponseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  title: string;

  @Expose()
  text: string;

  @Expose()
  sourceUrl: string;

  @Expose()
  categoryType: $Enums.FactCategories;
}
