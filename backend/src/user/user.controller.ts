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
import { User } from '@prisma/client';
import { Events } from 'src/events';
import { calculateExperienceForNextLevel } from 'src/utils/levels';

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
    return plainToInstance(
      UserResponseDto,
      {
        ...user,
        requiredPointsForNextLevel: calculateExperienceForNextLevel(user.level),
      },
      {
        excludeExtraneousValues: true,
      },
    );
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
      Events.INTERNAL.userAnsweredCorrectly,
      new Events.PAYLOADS.UserAnsweredCorrectlyEventPayload(user),
    );
  }
}
