import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { UserFeedDto } from './dto';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get('user')
  subscribeUserToFeed() {
    return this.feedService.subscribeUserToFeed();
  }

  @Get()
  getFeedForUser(@Query() userIdDto: UserFeedDto) {
    return this.feedService.getFeedForUser(userIdDto);
  }
}
