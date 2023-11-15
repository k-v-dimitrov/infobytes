import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';

import * as bcrypt from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';

import { JwtPayload } from './type';
import { LoginDto, RegisterDto } from './dto';

import {
  ForgedUserPayloadError,
  IncorrectLoginCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async createUser({ email, password }: RegisterDto) {
    await this.checkAndThrowOnEmailAlreadyInUse(email);

    const encryptedPassword = await bcrypt.hash(password, 6);

    const newUser = await this.db.user.create({
      data: { email, password: encryptedPassword },
    });

    return this.buildLoginResponse({
      token: this.signJwtForUser(newUser),
      user: newUser,
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.getUserBy({ email });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new IncorrectLoginCredentialsError();
    }

    return this.buildLoginResponse({
      token: this.signJwtForUser(user),
      user,
    });
  }

  async validateUser(email: string, id: string) {
    const user = await this.getUserBy({ email });

    if (user.id !== id) {
      throw new ForgedUserPayloadError();
    }

    // Omit user password
    delete user.password;

    return user;
  }

  async validateAdminUser(username: string, password: string) {
    if (username === 'KIRIL' && password === '123456') {
      return {};
    }

    return null;
  }

  async getUserBy({
    email,
    id,
  }: {
    email?: string;
    id?: string;
  }): Promise<User> {
    if (!email && !id) {
      throw new Error('No user email or id was provided!');
    }

    try {
      const user = await this.db.user.findFirstOrThrow({
        where: { email, id },
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

  private signJwtForUser(user: User) {
    delete user.password;
    const jwtPayloadToSign: JwtPayload = { ...user };
    return this.jwtService.sign(jwtPayloadToSign);
  }

  private buildLoginResponse({ token, user }: { token: string; user: User }) {
    delete user.password;
    return { user, token };
  }

  private async checkAndThrowOnEmailAlreadyInUse(email: string) {
    if (await this.isEmailAlreadyInUse(email)) {
      throw new UserAlreadyExistsError(email);
    }
  }

  private async isEmailAlreadyInUse(email: string) {
    try {
      await this.getUserBy({ email });
      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          return false;
        }
      }

      throw error;
    }
  }
}
