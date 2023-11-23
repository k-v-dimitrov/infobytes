import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { UserFeedDto } from './dto';
import { CurrentUser, InjectUserInBody } from 'src/interceptors';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUserInBody)
  subscribeUserToFeed(@CurrentUser() user: User) {
    return this.feedService.subscribeUserToFeed(user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getFeedForUser(@Query() userIdDto: UserFeedDto) {
    return this.feedService.getFeedForUser(userIdDto);
  }
}
