import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Headers,
  Res,
  UseGuards,
  Ip,
  Get,
} from '@nestjs/common';
import {
  RecoverPassword,
  RegisterEmailResending,
  Registration,
  Login,
  RegistrationConfirmation,
  SetNewPassword,
  SignOut,
  SignOutOther,
  Refresh,
  Sessions,
  AuthMe,
} from './decorators/auth.swagger.decorators';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
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
import { RefreshViewDto, SignInViewDto } from './output-dto/signin-view.dto';
import { SignInTokensDto } from './output-dto/signin-tokens.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequestUser } from './output-dto/request-user.dto';
import { Public } from './decorators/public.decorator';
import { UserViewDto } from '../../users/api/output-dto/user-view.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RefreshCommand } from '../application/use-cases/refresh.use-case';
import { RefreshPayload } from './decorators/refresh-payload.decorator';
import { RefreshGuard } from './guards/refresh.guard';
import { RefreshPayloadDto } from './input-dto/refresh-payload.dto';
import { RedisSession } from '../services/redis-session.service';
import { SignOutCommand } from '../application/use-cases/signout.use-case';
import { AuthService } from '../services/auth.service';
import { DeviceName } from './decorators/device-name.decorator';
import { SessionViewDto } from './input-dto/session.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly redisSession: RedisSession,
    private readonly authService: AuthService,
  ) {}

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
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('User-Agent') userAgent?: string,
  ): Promise<SignInViewDto> {
    const lastSeen = new Date().toISOString();
    const { accessToken, refreshToken, refreshCookieOptions }: SignInTokensDto =
      await this.commandBus.execute(
        new SignInCommand({ ...signInInputDto, userAgent, lastSeen, ip }),
      );

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    return { accessToken };
  }

  @SkipAuth()
  @UseGuards(RefreshGuard)
  @Post('signout')
  @SignOut()
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(
    @RefreshPayload() refreshPayload: RefreshPayloadDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.commandBus.execute(
      new SignOutCommand({
        userId: refreshPayload.sub,
        deviceId: refreshPayload.deviceId,
        deleteAll: false,
      }),
    );

    const cookieOptions = this.authService.createRefreshCookieOptions();
    cookieOptions.maxAge = 0;
    res.clearCookie('refreshToken', cookieOptions);
    res.sendStatus(200);
  }

  @SkipAuth()
  @UseGuards(RefreshGuard)
  @Post('signout-other')
  @SignOutOther()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOtherSessions(
    @RefreshPayload() refreshPayload: RefreshPayloadDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.commandBus.execute(
      new SignOutCommand({
        userId: refreshPayload.sub,
        deviceId: refreshPayload.deviceId,
        deleteAll: true,
      }),
    );

    res.sendStatus(200);
  }

  @SkipAuth()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @Refresh()
  async refresh(
    @RefreshPayload() refreshPayload: RefreshPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshViewDto> {
    const { accessToken, refreshToken, refreshCookieOptions }: SignInTokensDto =
      await this.commandBus.execute(new RefreshCommand(refreshPayload));

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    return { accessToken };
  }

  @Get('sessions')
  @Sessions()
  async getAllUserSessions(
    @CurrentUser('id') sub: string,
    @DeviceName() deviceName: string,
  ): Promise<SessionViewDto[]> {
    const sessions: SessionViewDto[] =
      await this.redisSession.getAllUserSessions(sub);
    return sessions.map((session: SessionViewDto) => {
      if (session.name === deviceName) {
        session.current = true;
        return session;
      }
      return session;
    });
  }

  @Get('me')
  @AuthMe()
  async authMe(@CurrentUser() user: RequestUser): Promise<UserViewDto> {
    return user;
  }

  @Public()
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
