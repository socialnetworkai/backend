import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './sendEmail.dto';
import { BadRequestDomainException } from '../exceptions/domainException';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    protected configService: ConfigService,
  ) {}

  async sendConfirmationEmail(sendEmailDto: SendEmailDto) {
    const { login, email, code } = sendEmailDto;
    const baseRegistrationUrl =
      this.configService.get<string>('FRONTEND_BASE_URL');
    const url = `${baseRegistrationUrl}?code=${code}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Добро пожаловать в SocialNetwork, ${login}! Подтвердите регистрацию`,
        template: './registration',
        context: {
          login: login,
          url,
          code,
        },
      });
    } catch (e) {
      throw BadRequestDomainException.create('Email incorrect value', 'email');
    }
  }

  async sendUserRecoveryCode(sendEmailDto: SendEmailDto) {
    const { login, email, code } = sendEmailDto;

    const baseRecoveryUrl: string = this.configService.get('RECOVERY_URL')!;
    const url = `${baseRecoveryUrl}?code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `Восстановление пароля в SocialNetwork для пользователя ${login}`,
      template: './recoveryCode',
      context: {
        login: login,
        url,
        code,
      },
    });
  }
}
