import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { RefreshTokensDto } from '../../api/output-dto/signin-tokens.dto';
import { RefreshPayloadDto } from '../../api/input-dto/refresh-payload.dto';

export class RefreshCommand {
  constructor(public refreshPayloadDto: RefreshPayloadDto) {}
}

@CommandHandler(RefreshCommand)
export class RefreshUseCase implements ICommandHandler<RefreshCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute({
    refreshPayloadDto,
  }: RefreshCommand): Promise<RefreshTokensDto> {
    return await this.authService.refresh(refreshPayloadDto);
  }
}
