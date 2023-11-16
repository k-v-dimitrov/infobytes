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

  async sendResetPasswordMail({
    to,
    resetPasswordLink,
  }: {
    to: string;
    resetPasswordLink: string;
  }) {
    await sgMail.send({
      from: NO_REPLY,
      templateId: RESET_PASSWORD_TEMPLATE,
      personalizations: [
        {
          to: [{ email: to }],
          dynamicTemplateData: {
            reset_password_link: resetPasswordLink,
          },
        },
      ],
    });
  }
}
