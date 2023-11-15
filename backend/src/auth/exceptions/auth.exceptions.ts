import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsError extends HttpException {
  constructor(email: string) {
    super(`User with email "${email}" already exists`, HttpStatus.CONFLICT);
  }
}

export class UserNotFoundError extends HttpException {
  constructor() {
    super(`User not found`, HttpStatus.NOT_FOUND);
  }
}

export class IncorrectLoginCredentialsError extends HttpException {
  constructor() {
    super(`Email or password is incorrect`, HttpStatus.BAD_REQUEST);
  }
}

export class ForgedUserPayloadError extends HttpException {
  constructor() {
    super(
      `This looks like a forged user payload request. If that is not the case, please report a problem.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
