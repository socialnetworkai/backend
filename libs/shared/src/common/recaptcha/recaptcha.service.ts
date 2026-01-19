import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaService {
  private readonly verifyUrl =
    'https://www.google.com/recaptcha/api/siteverify';
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Получаем секретный ключ из переменных окружения
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY')!;

    if (!this.secretKey) {
      throw new Error('RECAPTCHA_SECRET_KEY is not configured');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    if (!token) {
      throw new Error('Recaptcha token is required');
    }

    try {
      // Формируем данные для запроса
      const requestData = new URLSearchParams();
      requestData.append('secret', this.secretKey);
      requestData.append('response', token);

      // Отправляем запрос к Google
      const response = await firstValueFrom(
        this.httpService.post(this.verifyUrl, requestData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const data = response.data;

      // Для reCAPTCHA v2 проверяем только поле success
      return data.success === true;
    } catch (error) {
      // Логируем ошибку, но для пользователя возвращаем false
      console.error('Recaptcha verification failed:', error.message);
      return false;
    }
  }
}
