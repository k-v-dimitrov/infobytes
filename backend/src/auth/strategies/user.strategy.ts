import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JWT_SECRET } from '../constants';
import { JwtPayload } from '../type';

@Injectable()
export class UserAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate({ email, id }: JwtPayload) {
    const user = await this.authService.validateUser(email, id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
