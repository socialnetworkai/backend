import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../infrastructure/mail-module/mail.service';
import { SendEmailDto } from '../../../../infrastructure/mail-module/sendEmail.dto';
import { BadRequestDomainException } from '../../../../infrastructure/exceptions/domainException';
import { LoggerService } from '@app/shared/common/logger/logger.service';

export class EmailConfirmationSentEvent {
  constructor(public readonly payload: SendEmailDto) {}
}

@EventsHandler(EmailConfirmationSentEvent) // Декоратор связывает обработчик с событием
export class EmailConfirmationSentHandler implements IEventHandler<EmailConfirmationSentEvent> {
  constructor(
    private readonly mailService: MailService,
    private readonly logger: LoggerService,
  ) {}

  async handle({ payload }: EmailConfirmationSentEvent): Promise<void> {
    try {
      await this.mailService.sendConfirmationEmail(payload);
      this.logger.log(
        'EmailConfirmationSentHandler',
        `✅ Confirmation email sent to ${payload.email}`,
      );
    } catch (e) {
      this.logger.error(
        'EmailConfirmationSentHandler',
        `❌ Failed to send email to ${payload.email}:`,
      );
      throw BadRequestDomainException.create('Email incorrect value', 'email');
    }
  }
}
