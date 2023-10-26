import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthStrategy } from './http.strategy';

@Module({
  providers: [AuthService, PassportModule, BasicAuthStrategy],
})
export class AuthModule {}
