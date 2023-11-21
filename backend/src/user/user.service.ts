import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserInjected } from 'src/interceptors';
import { DatabaseService } from 'src/database/database.service';

import { PatchUserDto } from './dto/user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isArray } from 'class-validator';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private db: DatabaseService) {}

  async patch(dto: PatchUserDto) {
    try {
      const { user } = dto as UserInjected<PatchUserDto>;
      await this.db.userFactCategory.deleteMany({ where: { userId: user.id } });

      const patchedUser = await this.db.user.update({
        where: {
          id: user.id,
        },

        data: {
          displayName: dto.displayName,
          isOnboarded: dto.isOnboarded,
          ...(isArray(dto.categories) && {
            UserFactCategory: {
              createMany: {
                data: dto.categories.map((category) => ({ category })),
              },
            },
          }),
        },
        include: { UserFactCategory: true },
      });

      delete patchedUser.password;

      return { patchedUser };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
