import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordCheckDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dto';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post('register')
  create(@Body() dto: RegisterDto) {
    return this.authService.createUser(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('reset/request')
  resetPasswordRequest(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('reset/check')
  @HttpCode(HttpStatus.OK)
  resetPasswordCheck(@Body() dto: ResetPasswordCheckDto) {
    return this.authService.resetPasswordCheck(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
