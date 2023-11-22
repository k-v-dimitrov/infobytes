import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser, InjectUserInBody } from 'src/interceptors';
import { PatchUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUserInBody)
  getCurrentUser(@CurrentUser() user) {
    delete user.password;
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUserInBody)
  @Patch()
  patch(@Body() dto: PatchUserDto, @CurrentUser() user) {
    return this.userService.patch(dto, user);
  }
}
