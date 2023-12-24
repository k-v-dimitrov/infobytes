import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAnsweredCorrectlyListener } from './listeners/answered-correctly.listener';

@Module({
  providers: [UserService, UserAnsweredCorrectlyListener],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
