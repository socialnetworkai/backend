import { Injectable } from '@nestjs/common';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Trim } from '../../users/api/decorators/transform/trim';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../../../infrastructure/config/env.validation';

@Injectable()
export class AuthConfig {
  @IsEnum(Environment)
  nodeEnv: Environment;

  @IsString()
  @Trim()
  redisUrl: string;

  @IsNumber()
  refreshTokenExpiresIn: number;

  @IsNumber()
  accessTokenExpiresIn: number;

  @Trim()
  @IsString()
  jwtSecret: string;

  //todo! validation does not working
  constructor(private readonly configService: ConfigService) {
    this.redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
    this.refreshTokenExpiresIn = +this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
    this.accessTokenExpiresIn = +this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    this.nodeEnv = this.configService.getOrThrow<Environment>('NODE_ENV');
  }
}
