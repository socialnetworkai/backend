import {
  RefreshTokensDto,
  SignInTokensDto,
} from '../api/output-dto/signin-tokens.dto';
import { Injectable } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { UserService } from '../../users/services/user.service';
import { SendEmailDto } from '../../../infrastructure/mail-module/sendEmail.dto';
import { BadRequestDomainException } from '../../../infrastructure/exceptions/domainException';
import { ErrorConstants } from '../../../infrastructure/exceptions/error-constants';
import { HashService } from '@app/shared/common/encrypt/hash.service';
import { TokensService } from './token.service';
import { CookieOptions } from 'express';
import { AuthConfig } from './auth.config';
import { RefreshPayloadDto } from '../api/input-dto/refresh-payload.dto';
import { RedisSession } from './redis-session.service';
import { SignInDto } from '../api/input-dto/signin.dto';
import { generateUUIDCode } from '../../../infrastructure/common/generateUUID';
import { SignOutInputDto } from '../api/input-dto/signout.input.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokensService: TokensService,

    private readonly redisSession: RedisSession,
    private readonly authConfig: AuthConfig,
  ) {
    console.log('authConfig.nodeEnv=', authConfig.nodeEnv);
  }

  async registration(
    dto: CreateUserInputDto,
  ): Promise<{ sendEmailDto: SendEmailDto }> {
    return await this.userService.createUser(dto);
  }

  async confirmation(code: string): Promise<void> {
    await this.userService.confirmation(code);
  }

  async signIn(signInDto: SignInDto): Promise<SignInTokensDto> {
    const { email, password, ip, lastSeen, userAgent } = signInDto;
    const user = await this.userService.findUserByEmail(email);

    if (!user || !user.confirmation.isAgreeWithPrivacy)
      throw BadRequestDomainException.create(
        ErrorConstants.USER_WITH_EMAIL_NOT_EXIST,
        'SignInUseCase',
      );

    if (!user.confirmation.isConfirmed)
      throw BadRequestDomainException.create(
        ErrorConstants.USER_NOT_CONFIRMED,
        'SignInUseCase',
      );

    if (
      user.hashPassword &&
      !(await this.hashService.compare(password, user.hashPassword))
    ) {
      throw BadRequestDomainException.create(
        ErrorConstants.INVALID_PASSWORD,
        'SignInUseCase',
      );
    }

    const deviceName = userAgent ? userAgent : `name_${generateUUIDCode()}`;

    const deviceId = generateUUIDCode();

    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user.id, deviceName, deviceId);

    await this.redisSession.saveSession(
      user.id,
      deviceId,
      lastSeen,
      ip,
      deviceName,
    );

    const refreshCookieOptions: CookieOptions =
      this.createRefreshCookieOptions();

    return { accessToken, refreshToken, refreshCookieOptions };
  }

  async refresh(
    refreshPayloadDto: RefreshPayloadDto,
  ): Promise<RefreshTokensDto> {
    const { sub, deviceId, deviceName } = refreshPayloadDto;

    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(sub, deviceName, deviceId);

    await this.redisSession.updateSession(sub, deviceId);

    const refreshCookieOptions: CookieOptions =
      this.createRefreshCookieOptions();

    return { accessToken, refreshToken, refreshCookieOptions };
  }

  createRefreshCookieOptions(): CookieOptions {
    return {
      //todo while fronts not have deployed site
      secure: this.authConfig.nodeEnv === 'production' ? false : false,
      maxAge: this.authConfig.refreshTokenExpiresIn * 1000,
      httpOnly: true,
    };
  }

  async resendingEmailRegister(email: string): Promise<SendEmailDto> {
    return await this.userService.resendingEmailRegister(email);
  }

  async recoveryPassword(email: string): Promise<SendEmailDto> {
    return await this.userService.recoveryPassword(email);
  }

  async signOut(signOutInputDto: SignOutInputDto): Promise<void> {
    return await this.redisSession.deleteSession(signOutInputDto);
  }

  async setNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    return await this.userService.setNewPassword(newPassword, recoveryCode);
  }
}
