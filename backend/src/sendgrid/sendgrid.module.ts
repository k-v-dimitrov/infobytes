import { Module } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';
import { SendGridController } from './sendgrid.controller';

@Module({
  providers: [SendGridService],
  controllers: [SendGridController],
})
export class SendGridModule {}
