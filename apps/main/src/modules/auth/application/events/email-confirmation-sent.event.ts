import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../infrastructure/mail-module/mail.service';
import { SendEmailDto } from '../../../../infrastructure/mail-module/sendEmail.dto';
import { BadRequestDomainException } from '../../../../infrastructure/exceptions/domainException';

export class EmailConfirmationSentEvent {
  constructor(public readonly payload: SendEmailDto) {}
}

@EventsHandler(EmailConfirmationSentEvent) // Декоратор связывает обработчик с событием
export class EmailConfirmationSentHandler implements IEventHandler<EmailConfirmationSentEvent> {
  constructor(private readonly mailService: MailService) {}

  async handle(event: EmailConfirmationSentEvent): Promise<void> {
    try {
      await this.mailService.sendConfirmationEmail(event.payload);
      console.log(`✅ Confirmation email sent to ${event.payload.email}`);
    } catch (e) {
      console.error(`❌ Failed to send email to ${event.payload.email}:`);
      throw BadRequestDomainException.create('Email incorrect value', 'email');
    }
  }
}
