import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateQuestionDto,
  CreateQuestionResponseDto,
  DeleteQuestionDto,
} from './dto';
import {
  IncorrectAnswerCountPerQuestionException,
  IncorrectRightAnswerCount,
} from './exceptions';
import { DatabaseService } from 'src/database/database.service';
import { plainToInstance } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';

export const ANSWERS_PER_QUESTION = 4;
export const RIGHT_ANSWERS_PER_QUESTION = 1;
@Injectable()
export class QuestionService {
  constructor(private db: DatabaseService) {}

  async create(dto: CreateQuestionDto) {
    this.validateAnswers(dto);

    try {
      const createdQuestion = await this.db.question.create({
        data: {
          questionText: dto.questionText,
          answers: {
            createMany: {
              data: dto.answers,
            },
          },
          factId: dto.factId,
        },
        select: {
          answers: true,
          createdAt: true,
          factId: true,
          id: true,
          questionText: true,
          updatedAt: true,
        },
      });

      return plainToInstance(CreateQuestionResponseDto, createdQuestion, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === PrismaError.ForeignConstraintViolation) {
          throw new HttpException(
            `Encountered error creating new question for fact with id ${dto.factId}. Does this fact exist?`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  async delete(dto: DeleteQuestionDto) {
    try {
      await this.db.question.delete({ where: { id: dto.questionId } });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === PrismaError.RecordsNotFound) {
          throw new NotFoundException();
        }

        throw err;
      }
    }
  }

  private validateAnswers(dto: CreateQuestionDto) {
    const providedAnswersCount = dto.answers.length;

    if (!this.hasProvidedEnoughAnswers(providedAnswersCount)) {
      throw new IncorrectAnswerCountPerQuestionException(providedAnswersCount);
    }

    if (!this.hasCorrectNumberOfRightAnswers(dto.answers)) {
      throw new IncorrectRightAnswerCount(
        this.getRightAnswersCount(dto.answers),
      );
    }
  }

  private hasProvidedEnoughAnswers(providedCount: number) {
    return providedCount === ANSWERS_PER_QUESTION;
  }

  private hasCorrectNumberOfRightAnswers(
    answers: CreateQuestionDto['answers'],
  ) {
    return this.getRightAnswersCount(answers) === RIGHT_ANSWERS_PER_QUESTION;
  }

  private getRightAnswersCount(answers: CreateQuestionDto['answers']) {
    return answers.filter(({ isCorrect }) => isCorrect).length;
  }
}
