import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { SignInTokensDto } from '../../api/output-dto/signin-tokens.dto';
import { SignInDto } from '../../api/input-dto/signin.dto';

export class SignInCommand {
  constructor(public readonly signInDto: SignInDto) {}
}

@CommandHandler(SignInCommand)
export class SignInUseCase implements ICommandHandler<SignInCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute({ signInDto }: SignInCommand): Promise<SignInTokensDto> {
    return await this.authService.signIn(signInDto);
  }
}
