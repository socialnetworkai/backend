import { Injectable } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { UserService } from '../../users/services/user.service';
import { SendEmailDto } from '../../../infrastructure/mail-module/sendEmail.dto';
import { SignInInputDto } from '../api/input-dto/sign-in-input.dto';
import { BadRequestDomainException } from '../../../infrastructure/exceptions/domainException';
import { ErrorConstants } from '../../../infrastructure/exceptions/error-constants';
import { HashService } from '@app/shared/common/encrypt/hash.service';
import { TokensService } from './token.service';
import { CookieOptions } from 'express';
import { AuthConfig } from './auth.config';
import { SignInTokensDto } from '../api/output-dto/signin-tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokensService: TokensService,
    private readonly authConfig: AuthConfig,
  ) {}

  async registration(
    dto: CreateUserInputDto,
  ): Promise<{ sendEmailDto: SendEmailDto }> {
    return await this.userService.createUser(dto);
  }

  async confirmation(code: string): Promise<void> {
    await this.userService.confirmation(code);
  }

  async signIn(
    signInInputDto: SignInInputDto,
    userAgent: string,
  ): Promise<SignInTokensDto> {
    const { email, password } = signInInputDto;
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

    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user.id, userAgent);

    const refreshCookieOptions: CookieOptions =
      this.createRefreshCookieOptions();

    return { accessToken, refreshToken, refreshCookieOptions };
  }

  private createRefreshCookieOptions(): CookieOptions {
    return {
      secure: this.authConfig.nodeEnv === 'production' ? true : false,
      sameSite: 'none',
      maxAge: +this.authConfig.refreshTokenExpiresIn,
      httpOnly: true,
    };
  }

  async resendingEmailRegister(email: string): Promise<SendEmailDto> {
    return await this.userService.resendingEmailRegister(email);
  }

  async recoveryPassword(email: string): Promise<SendEmailDto> {
    return await this.userService.recoveryPassword(email);
  }

  async setNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    return await this.userService.setNewPassword(newPassword, recoveryCode);
  }
}
