import { ValidateNested } from 'class-validator';
import type { CookieOptions } from 'express';

export class SignInTokensDto {
  accessToken: string;
  refreshToken: string;
  @ValidateNested()
  refreshCookieOptions: CookieOptions;
}
