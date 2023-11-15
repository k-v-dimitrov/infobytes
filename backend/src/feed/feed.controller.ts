import {
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { UserFeedDto } from './dto';
import { InjectUserInBody, UserInjected } from 'src/interceptors';
import { AuthGuard } from '@nestjs/passport';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(InjectUserInBody)
  subscribeUserToFeed(@Body() dto: UserInjected<void>) {
    return this.feedService.subscribeUserToFeed(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getFeedForUser(@Query() userIdDto: UserFeedDto) {
    return this.feedService.getFeedForUser(userIdDto);
  }
}
