import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';

export class ConfirmationUseCaseCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationUseCaseCommand)
export class ConfirmationUseCase implements ICommandHandler<ConfirmationUseCaseCommand> {
  constructor(private authService: AuthService) {}

  async execute(command: ConfirmationUseCaseCommand) {
    await this.authService.confirmation(command.code);
  }
}
