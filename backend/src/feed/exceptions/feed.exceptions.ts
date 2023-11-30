import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidAnswerIdException extends HttpException {
  constructor() {
    super(
      'The given answer id does not match any of the answers for the provided question',
      HttpStatus.CONFLICT,
    );
  }
}

export class UserFeedQuestionAlreadyAnsweredException extends HttpException {
  constructor() {
    super(
      'The given user question has already been answered!',
      HttpStatus.BAD_REQUEST,
    );
  }
}
