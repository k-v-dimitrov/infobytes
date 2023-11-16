import { Controller } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';

@Controller('mail')
export class SendGridController {
  constructor(private sendGridService: SendGridService) {}
}
