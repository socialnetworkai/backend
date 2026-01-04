import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInInputDto } from '../../api/input-dto/sign-in-input.dto';
import { AuthService } from '../../services/auth.service';
import { SignInTokensDto } from '../../api/output-dto/signin-tokens.dto';

export class SignInCommand {
  constructor(
    public dto: SignInInputDto,
    public userAgent: string,
  ) {}
}

@CommandHandler(SignInCommand)
export class SignInUseCase implements ICommandHandler<SignInCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute({ dto, userAgent }: SignInCommand): Promise<SignInTokensDto> {
    return await this.authService.signIn(dto, userAgent);
  }
}
