import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { UserFeedDto } from './dto';
import { CurrentUser, InjectUser } from 'src/interceptors';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUser)
  subscribeUserToFeed(@CurrentUser() user: User) {
    return this.feedService.subscribeUserToFeed(user);
  }

  // TODO: POTENTIAL SECURITY PROBLEM, userId should not be taken from QueryParams
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getFeedForUser(@Query() userIdDto: UserFeedDto) {
    return this.feedService.getFeedForUser(userIdDto);
  }
}
