import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminAuthStrategy extends PassportStrategy(
  BasicStrategy,
  'admin',
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateAdminUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
