import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UserFeedDto {
  @IsUUID()
  userFeedId: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(16)
  @IsNumber()
  size: number;
}
