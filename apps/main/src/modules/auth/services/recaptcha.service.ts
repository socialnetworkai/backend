import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly verifyUrl: string =
    'https://www.google.com/recaptcha/api/siteverify';
  constructor(private configService: ConfigService) {}

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await axios.post(this.verifyUrl, null, {
        params: {
          secret: this.configService.get<string>('RECAPTCHA_SECRET_KEY'),
          response: token,
        },
      });

      const data = response.data;
      return data.success && data.score >= 0.5;
    } catch (error) {
      console.error('Recaptcha verification error:', error);
      return false;
    }
  }
}
