import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { SendEmailDto } from '../../../../infrastructure/mail-module/sendEmail.dto';
import { EmailRecoveryPasswordSentEvent } from '../events/email-recovery-password-sent.event';

export class RecoverPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase implements ICommandHandler<RecoverPasswordCommand> {
  constructor(
    private authService: AuthService,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: RecoverPasswordCommand): Promise<void> {
    const sendEmailDto: SendEmailDto =
      await this.authService.recoveryPassword(email);

    this.eventBus.publish(new EmailRecoveryPasswordSentEvent(sendEmailDto));
  }
}
