import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';

import * as bcrypt from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';

import { JwtPayload } from './type';
import {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  ResetPasswordCheckDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dto';

import {
  ForgedUserPayloadError,
  IncorrectLoginCredentialsError,
  InvalidPasswordRequestLink,
  UserAlreadyExistsError,
} from './exceptions';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from 'src/sendgrid/sendgrid.service';
import { UserNotFoundError } from 'src/database/exceptions';
import { plainToInstance } from 'class-transformer';
import { calculateExperienceForNextLevel } from 'src/utils/levels';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sendGridService: SendGridService,
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
    const user = await this.db.getUserBy({ email });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new IncorrectLoginCredentialsError();
    }

    return this.buildLoginResponse({
      token: this.signJwtForUser(user),
      user,
    });
  }

  async resetPasswordRequest({ email }: ResetPasswordRequestDto) {
    const { id: userId, email: userEmail } = await this.db.getUserBy({ email });

    const passwordRequest = await this.getPasswordResetRequest({ userId });
    const hasPasswordRequest = !!passwordRequest;

    if (hasPasswordRequest) {
      await this.removePasswordResetRequest({ userId });
    }

    const resetPasswordRequestId = await this.createPasswordResetRequest({
      userId,
    });

    const resetPasswordLink = this.buildResetPasswordLink({
      resetPasswordRequestId,
      userEmail,
    });

    await this.sendGridService.sendResetPasswordMail({
      to: email,
      resetPasswordLink,
    });
  }

  async resetPasswordCheck({
    email,
    requestPasswordChangeId,
  }: ResetPasswordCheckDto) {
    const { id: userId } = await this.db.getUserBy({ email });

    const passwordRequest = await this.getPasswordResetRequest({ userId });
    const hasPasswordRequest = !!passwordRequest;

    if (!hasPasswordRequest || passwordRequest.id !== requestPasswordChangeId) {
      throw new InvalidPasswordRequestLink();
    }
  }

  async resetPassword({
    email,
    password,
    requestPasswordChangeId,
  }: ResetPasswordDto) {
    await this.resetPasswordCheck({ email, requestPasswordChangeId });
    const user = await this.db.getUserBy({ email });
    const newEncryptedPassword = await bcrypt.hash(password, 6);
    await this.updateUserPassword(newEncryptedPassword, user.id);
    await this.removePasswordResetRequest({ userId: user.id });
  }

  async validateUser(email: string, id: string) {
    const user = await this.db.getUserBy({ email });

    if (user.id !== id) {
      throw new ForgedUserPayloadError();
    }

    return user;
  }

  async validateAdminUser(username: string, password: string) {
    if (username === 'KIRIL' && password === '123456') {
      return {};
    }

    return null;
  }

  private async updateUserPassword(encryptedPassword: string, userId: string) {
    await this.db.user.update({
      data: { password: encryptedPassword },
      where: { id: userId },
    });
  }

  private buildResetPasswordLink({
    resetPasswordRequestId,
    userEmail,
  }: {
    resetPasswordRequestId: string;
    userEmail: string;
  }) {
    const params = new URLSearchParams();
    params.append('rprid', resetPasswordRequestId);
    params.append('usr', userEmail);

    return `${this.configService.get<string>(
      'DOMAIN_URL',
    )}/reset-password?${params.toString()}`;
  }

  private async createPasswordResetRequest({ userId }: { userId: string }) {
    const { id: passwordRequestId } = await this.db.resetPassword.create({
      data: { userId: userId },
    });

    return passwordRequestId;
  }

  private async removePasswordResetRequest({ userId }: { userId: string }) {
    await this.db.resetPassword.delete({
      where: { userId },
    });
  }

  private async getPasswordResetRequest({ userId }: { userId: string }) {
    try {
      return await this.db.resetPassword.findFirstOrThrow({
        where: { userId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordsNotFound) {
          return;
        }
      }

      throw error;
    }
  }

  private signJwtForUser(user: User) {
    const jwtPayloadToSign: JwtPayload = { ...user };
    return this.jwtService.sign(jwtPayloadToSign);
  }

  private buildLoginResponse({ token, user }: { token: string; user: User }) {
    return plainToInstance(
      LoginResponseDto,
      {
        ...{
          ...user,
          requiredPointsForNextLevel: calculateExperienceForNextLevel(
            user.level,
          ),
        },
        token,
      },
      { excludeExtraneousValues: true },
    );
  }

  private async checkAndThrowOnEmailAlreadyInUse(email: string) {
    if (await this.isEmailAlreadyInUse(email)) {
      throw new UserAlreadyExistsError(email);
    }
  }

  private async isEmailAlreadyInUse(email: string) {
    try {
      await this.db.getUserBy({ email });
      return true;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return false;
      }

      throw error;
    }
  }
}
