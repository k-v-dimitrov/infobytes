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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserAnsweredCorrectlyEvent } from './events/asnwered-correctly.event';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  getCurrentUser(@CurrentUser() user: User) {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  @Patch()
  patch(@Body() dto: PatchUserDto, @CurrentUser() user: User) {
    return this.userService.patch(dto, user);
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  test(@CurrentUser() user: User) {
    this.eventEmitter.emit(
      'user.answer.correct',
      new UserAnsweredCorrectlyEvent(user),
    );
  }
}
