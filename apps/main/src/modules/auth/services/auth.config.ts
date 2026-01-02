import { Injectable } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { Trim } from '../../users/api/decorators/transform/trim';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  @IsString()
  @Trim()
  redisUrl: string;

  @IsNumber()
  expiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
  }
}
