import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser, InjectUser } from 'src/interceptors';
import { PatchUserDto, UserResponseDto } from './dto';

import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  getCurrentUser(@CurrentUser() user) {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  @Patch()
  patch(@Body() dto: PatchUserDto, @CurrentUser() user) {
    return this.userService.patch(dto, user);
  }
}
