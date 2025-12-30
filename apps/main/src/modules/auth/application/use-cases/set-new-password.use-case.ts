import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';

export class SetNewPasswordCommand {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
  ) {}
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordUseCase implements ICommandHandler<SetNewPasswordCommand> {
  constructor(private authService: AuthService) {}

  async execute({
    newPassword,
    recoveryCode,
  }: SetNewPasswordCommand): Promise<void> {
    await this.authService.setNewPassword(newPassword, recoveryCode);
  }
}
