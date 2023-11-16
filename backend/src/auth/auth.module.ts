import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthStrategy } from './strategies/admin.strategy';
import { UserAuthStrategy } from './strategies/user.strategy';
import { AuthController } from './auth.controller';
import { JWT_SECRET } from './constants';
import { ThrottlerModule } from '@nestjs/throttler';
import { SendGridModule } from 'src/sendgrid/sendgrid.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
    ThrottlerModule.forRoot([{ ttl: 1000 * 60 * 30, limit: 10 }]),
    SendGridModule,
  ],
  providers: [AuthService, PassportModule, AdminAuthStrategy, UserAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
