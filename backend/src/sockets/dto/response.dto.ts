import { Expose } from 'class-transformer';

export class UserLeveledUpResponseDto {
  @Expose()
  id: string;

  @Expose()
  level: number;

  @Expose()
  levelPoints: number;

  @Expose()
  requiredPointsForNextLevel: number;
}
