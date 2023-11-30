import { HttpException, HttpStatus } from '@nestjs/common';

import {
  ANSWERS_PER_QUESTION,
  RIGHT_ANSWERS_PER_QUESTION,
} from '../question.service';

export class IncorrectAnswerCountPerQuestionException extends HttpException {
  constructor(providedAnswersCount: number) {
    super(
      `Currently ${ANSWERS_PER_QUESTION} answers are required for each answer, provided ${providedAnswersCount}.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class IncorrectRightAnswerCount extends HttpException {
  constructor(providedRightAnswersCount: number) {
    super(
      `Currently ${RIGHT_ANSWERS_PER_QUESTION} right answer is required for each answer, provided ${providedRightAnswersCount}.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
1;
