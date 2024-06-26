import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from 'src/auth/type';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class InjectUser implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    this.checkAndThrowOnMissingAuthorization(request);
    const token = this.tryToExtractJwtToken(request);
    const decodedToken = this.jwtService.decode<JwtPayload>(token);
    const user = await this.db.getUserBy({
      id: decodedToken.id,
      include: { UserFactCategory: true },
    });
    this.attachUserToRequestContext(request, user);
    return next.handle();
  }

  private attachUserToRequestContext(request: any, user: User) {
    request.user = user;
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

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as User;
  },
);
