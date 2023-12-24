import { Exclude, Expose } from 'class-transformer';

export class UserLeveledUpResponseDto {
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

  @Expose()
  level: number;

  @Expose()
  level_points: number;
}
