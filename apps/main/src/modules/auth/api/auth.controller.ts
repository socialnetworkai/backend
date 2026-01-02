import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
import {
  RecoverPassword,
  RegisterEmailResending,
  Registration,
  RegistrationConfirmation,
  SetNewPassword,
} from './decorators/auth.swagger.decorators';
import { RegisterViewDto } from './output-dto/register-view.dto';
import { CodeDto } from './input-dto/code.dto';
import { ConfirmationUseCaseCommand } from '../application/use-cases/confirmation.use-case';
import { EmailDto } from './input-dto/email.dto';
import { RegistrationEmailResendingUseCaseCommand } from '../application/use-cases/emai-resending-register.use-case';
import { NewPasswordInputDto } from './input-dto/new-password.input.dto';
import { SetNewPasswordCommand } from '../application/use-cases/set-new-password.use-case';
import { RecoverPasswordCommand } from '../application/use-cases/password-recovery.use-case';
import { RedisSession } from '../services/redis-session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly redisSession: RedisSession,
  ) {}

  @Post('registration')
  @Registration()
  async registration(@Body() body: CreateUserInputDto) {
    await this.redisSession.insert('sdmnbcdshckjjsdklclscj', 'users', 60000);
    return await this.commandBus.execute<RegisterUserCommand, RegisterViewDto>(
      new RegisterUserCommand(body),
    );
  }

  @Get('registration-confirmation')
  @RegistrationConfirmation()
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Query() { code }: CodeDto) {
    await this.commandBus.execute(new ConfirmationUseCaseCommand(code));
  }

  @Post('registration-email-resending')
  @RegisterEmailResending()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() { email }: EmailDto): Promise<void> {
    await this.commandBus.execute(
      new RegistrationEmailResendingUseCaseCommand(email),
    );
  }

  @Post('recover-password')
  @RecoverPassword()
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() { email }: EmailDto): Promise<void> {
    await this.commandBus.execute(new RecoverPasswordCommand(email));
  }

  @Post('new-password')
  @SetNewPassword()
  @HttpCode(HttpStatus.NO_CONTENT)
  async setNewPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    await this.commandBus.execute(
      new SetNewPasswordCommand(body.newPassword, body.recoveryCode),
    );
  }
}
