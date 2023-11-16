import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as sgMail from '@sendgrid/mail';
import { RESET_PASSWORD_TEMPLATE } from './templates';

const NO_REPLY = 'no-reply@infobytes.app';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(configService.get<string>('SENDGRID_API_KEY'));
  }

  async testMail() {
    await this.sendTemplateEmail('kir4agi@gmail.com');
    console.log('email was send');
  }

  async sendTemplateEmail(to: string) {
    await sgMail.send({
      from: NO_REPLY,
      templateId: RESET_PASSWORD_TEMPLATE,
      personalizations: [
        {
          to: [{ email: to }],
          dynamicTemplateData: {
            reset_password_link: 'https://google.com',
          },
        },
      ],
    });
  }
}
