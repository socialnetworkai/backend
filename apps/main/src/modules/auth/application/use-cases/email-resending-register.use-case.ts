import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { SendEmailDto } from '../../../../infrastructure/mail-module/sendEmail.dto';
import { EmailConfirmationSentEvent } from '../events/email-confirmation-sent.event';

export class RegistrationEmailResendingUseCaseCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingUseCaseCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingUseCaseCommand> {
  constructor(
    private eventBus: EventBus,
    private authService: AuthService,
  ) {}

  async execute(command: RegistrationEmailResendingUseCaseCommand) {
    const sendEmailDto: SendEmailDto =
      await this.authService.resendingEmailRegister(command.email);

    this.eventBus.publish(new EmailConfirmationSentEvent(sendEmailDto));
  }
}
