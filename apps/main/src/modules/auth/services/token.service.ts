import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from './auth.config';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly authConfig: AuthConfig,
  ) {}

  async signJwtToken(payload: object, expiresIn: number): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  async verifyJwtToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }

  async generateTokens(
    id: string,
    deviceName: string,
    deviceId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload = {
      sub: id,
      deviceName,
    };

    const refreshPayload = {
      sub: id,
      deviceId,
      deviceName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signJwtToken(accessPayload, this.authConfig.accessTokenExpiresIn),
      this.signJwtToken(refreshPayload, this.authConfig.refreshTokenExpiresIn),
    ]);

    return { accessToken, refreshToken };
  }
}
