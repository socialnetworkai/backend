import { SendEmailDto } from '../../../../infrastructure/mail-module/sendEmail.dto';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../infrastructure/mail-module/mail.service';
import { BadRequestDomainException } from '../../../../infrastructure/exceptions/domainException';

export class EmailRecoveryPasswordSentEvent {
  constructor(public readonly payload: SendEmailDto) {}
}

@EventsHandler(EmailRecoveryPasswordSentEvent) // Декоратор связывает обработчик с событием
export class EmailRecoveryPasswordSentHandler implements IEventHandler<EmailRecoveryPasswordSentEvent> {
  constructor(private readonly mailService: MailService) {}

  async handle(event: EmailRecoveryPasswordSentEvent): Promise<void> {
    try {
      await this.mailService.sendUserRecoveryCode(event.payload);
      console.log(
        `✅ Recovery code for new password email sent to ${event.payload.email}`,
      );
    } catch (e) {
      console.error(`❌ Failed to send email to ${event.payload.email}:`);
      throw BadRequestDomainException.create('Email incorrect value', 'email');
    }
  }
}
