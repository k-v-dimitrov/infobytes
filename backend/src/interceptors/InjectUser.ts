import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/type';

@Injectable()
export class InjectUserInBody implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    this.checkAndThrowOnMissingAuthorization(request);
    const token = this.tryToExtractJwtToken(request);
    const decodedToken = this.jwtService.decode<JwtPayload>(token);
    const user = await this.authService.getUserBy({ id: decodedToken.id });
    this.attachUserToRequestBody(request, user);
    return next.handle();
  }

  private attachUserToRequestBody(request: any, user: User) {
    request.body.user = user;
  }

  private tryToExtractJwtToken(request: any) {
    try {
      return request.headers.authorization.split(' ')[1];
    } catch (error) {
      throw new Error(
        `There was an error extracting token from request headers: \n ${error} `,
      );
    }
  }

  private checkAndThrowOnMissingAuthorization(request: any) {
    if (!request.headers.authorization) {
      const pathOfEndpoint = request.route.path;
      throw new Error(
        `Interceptor \`InjectUserInBody\` failed because no authorization info was found.
         You probably forgot to add @UseGuards(AuthGuard('jwt')) at ${pathOfEndpoint} endpoint!`,
      );
    }
  }
}

export type UserInjected<T> = {
  user: User;
} & T;
