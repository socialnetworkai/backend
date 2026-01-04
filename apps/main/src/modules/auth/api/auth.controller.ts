import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Headers,
  Res,
} from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
import {
  RecoverPassword,
  RegisterEmailResending,
  Registration,
  Login,
  RegistrationConfirmation,
  SetNewPassword,
} from './decorators/auth.swagger.decorators';
import { RegisterViewDto } from './output-dto/register-view.dto';
import { CodeDto } from './input-dto/code.dto';
import { ConfirmationUseCaseCommand } from '../application/use-cases/confirmation.use-case';
import { EmailDto } from './input-dto/email.dto';
import { RegistrationEmailResendingUseCaseCommand } from '../application/use-cases/email-resending-register.use-case';
import { NewPasswordInputDto } from './input-dto/new-password.input.dto';
import { SetNewPasswordCommand } from '../application/use-cases/set-new-password.use-case';
import { RecoverPasswordCommand } from '../application/use-cases/password-recovery.use-case';
import { SignInInputDto } from './input-dto/sign-in-input.dto';
import { SignInCommand } from '../application/use-cases/sign-in.use-case';
import type { Response } from 'express';
import { SignInViewDto } from './output-dto/signin-view.dto';
import { SignInTokensDto } from './output-dto/signin-tokens.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequestUser } from './output-dto/request-user.dto';
import { Public } from './decorators/public.decorator';
import { UserViewDto } from '../../users/api/output-dto/user-view.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Public()
  @Post('registration')
  @Registration()
  async registration(@Body() body: CreateUserInputDto) {
    return await this.commandBus.execute<RegisterUserCommand, RegisterViewDto>(
      new RegisterUserCommand(body),
    );
  }

  @Public()
  @Post('signin')
  @Login()
  async signIn(
    @Body() signInInputDto: SignInInputDto,
    @Headers('User-Agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInViewDto> {
    const { accessToken, refreshToken, refreshCookieOptions }: SignInTokensDto =
      await this.commandBus.execute(
        new SignInCommand(signInInputDto, userAgent),
      );

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return { accessToken };
  }

  @Get('me')
  async authMe(@CurrentUser() user: RequestUser): Promise<UserViewDto> {
    return user;
  }

  @Get('registration-confirmation')
  @RegistrationConfirmation()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExcludeEndpoint()
  async confirmation(@Query() { code }: CodeDto) {
    await this.commandBus.execute(new ConfirmationUseCaseCommand(code));
  }

  @Public()
  @Post('registration-email-resending')
  @RegisterEmailResending()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() { email }: EmailDto): Promise<void> {
    await this.commandBus.execute(
      new RegistrationEmailResendingUseCaseCommand(email),
    );
  }

  @Public()
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
