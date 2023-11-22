import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
  requestPasswordChangeId: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}

export class ResetPasswordCheckDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
  requestPasswordChangeId: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}

export class RegisterDto extends LoginDto {}

export class UserLoginResponseDto {
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
}

export class LoginResponseDto {
  @Expose()
  token: string;

  @Expose({ name: 'user' })
  @Type(() => UserLoginResponseDto)
  user: UserLoginResponseDto;
}
