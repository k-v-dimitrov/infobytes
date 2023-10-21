import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateFactDto, FactIdDto, PatchFactDto, PutFactDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';

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

      return { createdFact };
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

      return { fact };
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

      return { patchedFact };
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

      return { patchedFact };
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

      return { fact };
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

      return { results };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
