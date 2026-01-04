import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisSession } from './redis-session.service';
import { AuthConfig } from './auth.config';
import { NotFoundDomainException } from '../../../infrastructure/exceptions/domainException';
import { ErrorConstants } from '../../../infrastructure/exceptions/error-constants';
import { UserService } from '../../users/services/user.service';
import { generateUUIDCode } from '../../../infrastructure/common/generateUUID';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly redisSession: RedisSession,
    private readonly authConfig: AuthConfig,
  ) {}

  async signToken(payload: object, expiresIn: number): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  async generateTokens(
    id: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload = {
      sub: id,
    };

    const deviceId = this.generateDeviceId(userAgent);

    const refreshPayload = {
      sub: id,
      deviceId,
      userAgent,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(accessPayload, +this.authConfig.accessTokenExpiresIn),
      this.signToken(refreshPayload, +this.authConfig.refreshTokenExpiresIn),
    ]);

    await this.redisSession.saveRefreshToken(id, deviceId, refreshToken);

    await this.redisSession.getAllUserSessionsNames(id);

    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { sub, deviceId, userAgent } =
      await this.jwtService.verifyAsync(refreshToken);

    const user = await this.usersService.findUserById(sub);

    if (!user) {
      throw NotFoundDomainException.create(
        ErrorConstants.USER_NOT_FOUND,
        'TokensService/refreshToken',
      );
    }

    const userId = user.id;
    await this.redisSession.validateRefreshToken(
      userId,
      deviceId,
      refreshToken,
    );

    return this.generateTokens(userId, userAgent);
  }

  private generateDeviceId(userAgent: string): string {
    const token = generateUUIDCode();
    return `${token.slice(token.lastIndexOf('-') + 1)}_${userAgent}`;
  }
}
