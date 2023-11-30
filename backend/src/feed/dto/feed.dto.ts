import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UserFeedDto {
  @IsUUID()
  userFeedId: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(16)
  @IsNumber()
  size: number;
}

export class AnswerFeedQuestionRouteParams {
  @IsUUID()
  userQuestionId: string;
}

export class AnswerFeedQuestionDto {
  @IsUUID()
  answerId: string;
}

export class UserFeedFactResponseDto {
  @Expose()
  id: string;

  @Expose()
  sourceUrl: string;

  @Expose()
  text: string;

  @Expose()
  title: string;

  @Expose()
  categoryType: string;
}

export class AnswersDataResponseDto {
  @Expose()
  id: string;

  @Expose({ name: 'answerText' })
  text: string;
}

export class QuestionDataReponseDto {
  @Expose()
  id: string;

  @Expose()
  questionText: string;

  @Expose()
  @Type(() => AnswersDataResponseDto)
  answers: AnswersDataResponseDto[];

  @Expose()
  answerURI: string;
}

export class UserFeedQuestionResponseDto {
  @Exclude()
  id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  givenAnswerId: string;

  @Exclude()
  isCorrect: boolean;

  @Exclude()
  userId: string;

  @Exclude()
  questionId: string;

  @Expose({ name: 'question' })
  @Type(() => QuestionDataReponseDto)
  data: QuestionDataReponseDto;
}

export class UserFeedResponseDto {
  @Expose()
  @Type(() => UserFeedFactResponseDto)
  facts: UserFeedFactResponseDto[];

  @Expose()
  @Type(() => UserFeedQuestionResponseDto)
  questions: UserFeedQuestionResponseDto[];
}
