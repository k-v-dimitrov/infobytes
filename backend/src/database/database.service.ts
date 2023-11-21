import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';
import { UserNotFoundError } from './exceptions';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  // Utils

  async getUserBy({
    email,
    id,
    include,
  }: {
    email?: string;
    id?: string;
    include?: Prisma.UserInclude;
  }): Promise<User> {
    if (!email && !id) {
      throw new Error('No user email or id was provided!');
    }

    try {
      const user = await this.user.findFirstOrThrow({
        where: { email, id },
        include,
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          throw new UserNotFoundError();
        }
      } else {
        throw error;
      }
    }
  }
}
