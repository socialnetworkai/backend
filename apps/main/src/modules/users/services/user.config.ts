import { IsNumber } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserConfig {
  @IsNumber()
  codeLifetimeInSecs: number;
  constructor(private readonly configService: ConfigService) {
    this.codeLifetimeInSecs = this.configService.get<number>(
      'EMAIL_CONFIRMATION_CODE_LIFETIME_SECS',
    )!;
  }
}
