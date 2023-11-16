import { Controller, Get } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';

@Controller('mail')
export class SendGridController {
  constructor(private sendGridService: SendGridService) {}

  @Get('test')
  search() {
    return this.sendGridService.testMail();
  }
}
