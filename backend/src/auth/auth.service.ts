import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async validateAdminUser(username: string, password: string) {
    if (username === 'KIRIL' && password === '123456') {
      return {};
    }

    return null;
  }
}
