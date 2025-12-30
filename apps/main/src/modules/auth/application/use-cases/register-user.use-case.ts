import { CreateUserInputDto } from '../../../users/api/input-dto/create-user-input.dto';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationSentEvent } from '../events/email-confirmation-sent.event';
import { AuthService } from '../../services/auth.service';

export class RegisterUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<
  RegisterUserCommand,
  void
> {
  constructor(
    private authService: AuthService,
    private eventBus: EventBus,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const { sendEmailDto } = await this.authService.registration(dto);

    this.eventBus.publish(new EmailConfirmationSentEvent(sendEmailDto));
  }
}
