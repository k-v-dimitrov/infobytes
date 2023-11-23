import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { isArray } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { DatabaseService } from 'src/database/database.service';
import { PatchUserDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async patch(dto: PatchUserDto, user: User) {
    await this.deleteAllUserFactCategories(user);
    const updatedUser = await this.updateUserByPatchDto(user, dto);
    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  private async updateUserByPatchDto(user: User, dto: PatchUserDto) {
    try {
      return await this.db.user.update({
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }

  private async deleteAllUserFactCategories(user: {
    id: string;
    email: string;
    password: string;
    displayName: string;
    isOnboarded: boolean;
  }) {
    try {
      await this.db.userFactCategory.deleteMany({ where: { userId: user.id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
