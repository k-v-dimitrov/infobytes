import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateFactDto,
  FactIdDto,
  FactResponseDto,
  PatchFactDto,
  PutFactDto,
} from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';
import { isArray } from 'class-validator';
import {
  PageableParamsDto,
  PageableResponseDto,
  validateSortKeys,
  generateOrderBySortKeys,
} from 'src/utils/pageable';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';

@Injectable()
export class FactService {
  private readonly logger = new Logger(FactService.name);

  constructor(private db: DatabaseService) {}

  async create(dto: CreateFactDto) {
    try {
      const createdFact = await this.db.fact.create({
        data: {
          text: dto.text,
          sourceUrl: dto.sourceUrl,
          title: dto.title,
          categoryType: dto.categoryType,
        },
      });

      return plainToInstance(FactResponseDto, createdFact, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async get({ id }: FactIdDto) {
    try {
      const fact = await this.db.fact.findFirstOrThrow({
        where: {
          id: id,
        },
      });

      return plainToInstance(FactResponseDto, fact, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          throw new HttpException(
            `Fact with id ${id} was not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async put(dto: PutFactDto) {
    try {
      const putFact = await this.db.fact.update({
        where: {
          id: dto.factId,
        },

        data: {
          text: dto.text,
          sourceUrl: dto.sourceUrl,
          title: dto.title,
          categoryType: dto.categoryType,
        },
      });

      return plainToInstance(FactResponseDto, putFact, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          throw new HttpException(
            `Fact with id ${dto.factId} was not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async patch(dto: PatchFactDto) {
    try {
      const patchedFact = await this.db.fact.update({
        where: {
          id: dto.factId,
        },

        data: {
          text: dto.text,
          sourceUrl: dto.sourceUrl,
          title: dto.title,
          categoryType: dto.categoryType,
        },
      });

      return plainToInstance(FactResponseDto, patchedFact, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          throw new HttpException(
            `Fact with id ${dto.factId} was not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete({ id }: FactIdDto) {
    try {
      const fact = await this.db.fact.delete({
        where: {
          id: id,
        },
      });

      return plainToInstance(FactResponseDto, fact, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          throw new HttpException(
            `Fact with id ${id} was not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async search(searchedString: string) {
    try {
      const results = await this.db.fact.findMany({
        where: {
          OR: [
            {
              text: { search: `${searchedString}:*` },
            },

            {
              title: { search: `${searchedString}:*` },
            },
          ],
        },
        orderBy: {
          _relevance: {
            fields: ['title', 'text'],
            search: `${searchedString}:*`,
            sort: 'desc',
          },
        },
      });

      return plainToInstance(Array<FactResponseDto>, results, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getFactsForReview(dto: PageableParamsDto, user: User) {
    const reviewFactSortableKeys = ['createdAt', 'updatedAt'];

    const hasProvidedSortKeys = dto.sortBy && isArray(dto.sortBy);
    hasProvidedSortKeys &&
      validateSortKeys({
        knownKeys: reviewFactSortableKeys,
        keys: dto.sortBy,
      });

    const orderBy =
      hasProvidedSortKeys && generateOrderBySortKeys(dto.sortBy, 'desc');

    const hasProvidedPageableProps = dto.page && dto.size;

    const factReviewList = await this.db.factReview.findMany({
      skip: hasProvidedPageableProps && (dto.page - 1) * dto.size,
      where: { userId: user.id },
      include: { fact: true },
      orderBy,
      take: hasProvidedPageableProps && dto.size,
    });

    const factReviewTotalEntries = await this.db.factReview.count({
      where: { userId: user.id },
    });

    const pageable =
      hasProvidedPageableProps &&
      plainToInstance(
        PageableResponseDto,
        new PageableResponseDto(dto.page, dto.size, factReviewTotalEntries),
      );

    const factsForReview = plainToInstance(
      FactResponseDto,
      factReviewList.map(({ fact }) => fact),
      {
        excludeExtraneousValues: true,
      },
    );

    return { results: factsForReview, pageable };
  }
}
