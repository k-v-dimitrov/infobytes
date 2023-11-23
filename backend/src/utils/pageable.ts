import { HttpException, HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PageableParamsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @IsOptional()
  size: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @IsOptional()
  sortBy?: string[];
}

export class PageableResponseDto {
  @Expose()
  hasNextPage: boolean;

  @Expose()
  totalPages: number;

  constructor(currentPage: number, pageSize: number, totalEntries: number) {
    this.hasNextPage = totalEntries - currentPage * pageSize > 0;
    this.totalPages = totalEntries / pageSize;
  }
}

export const validateSortKeys = ({
  knownKeys,
  keys,
}: {
  knownKeys: string[];
  keys: string[];
}) => {
  const unknownKeys = getUnknownKeys(knownKeys, keys);

  if (unknownKeys.length > 0) {
    throw new UnknownSortKeysException(knownKeys, unknownKeys);
  }
};

const getUnknownKeys = (
  knownKeys: string[],
  keysToCheck: string[],
): string[] => {
  return keysToCheck.filter((key) => !knownKeys.includes(key));
};

export const generateOrderBySortKeys = (
  sortBy: PageableParamsDto['sortBy'],
  order: 'asc' | 'desc',
) => {
  const orderBy = {};

  sortBy.forEach((sortKey) => {
    orderBy[sortKey] = order;
  });

  return orderBy;
};

export class UnknownSortKeysException extends HttpException {
  constructor(knownKeys: string[], unknownKeys: string[]) {
    super(
      `Unable to sort, the following keys cannot be sorted by [${unknownKeys.join(
        ', ',
      )}]  Sortable keys are: [${knownKeys.join(', ')}]`,
      HttpStatus.FORBIDDEN,
    );
  }
}
