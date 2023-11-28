import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateAnswerDto, CreateAnswerResponseDto } from './answer.dto';
import { Expose, Type } from 'class-transformer';

export class QuestionIdDto {
  @IsUUID()
  questionId: string;
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  questionText: string;

  @IsNotEmpty()
  @IsUUID()
  factId: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}

export class CreateQuestionResponseDto {
  @Expose()
  id: string;

  @Expose()
  questionText: string;

  @Expose()
  @Type(() => CreateAnswerResponseDto)
  answers: CreateAnswerResponseDto[];
}

export class DeleteQuestionDto extends QuestionIdDto {}
