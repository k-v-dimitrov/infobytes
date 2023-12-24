import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import {
  AnswerFeedQuestionDto,
  AnswerFeedQuestionRouteParams,
  UserFeedDto,
} from './dto';
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
  getFeedForUser(@Query() userFeedDto: UserFeedDto) {
    return this.feedService.getFeedForUser(userFeedDto);
  }

  @Post('/q/:userQuestionId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  answerFeedQuestion(
    @Param() asnwerFeedQuestionRouteParams: AnswerFeedQuestionRouteParams,
    @Body() answerFeedQuestionDto: AnswerFeedQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.feedService.answerFeedQuestion(
      asnwerFeedQuestionRouteParams,
      answerFeedQuestionDto,
      user,
    );
  }
}
