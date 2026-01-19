import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { SignOutInputDto } from '../../api/input-dto/signout.input.dto';

export class SignOutCommand {
  constructor(public readonly signOutInputDto: SignOutInputDto) {}
}

@CommandHandler(SignOutCommand)
export class SignOutUseCase implements ICommandHandler<SignOutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute({ signOutInputDto }: SignOutCommand): Promise<void> {
    return await this.authService.signOut(signOutInputDto);
  }
}
