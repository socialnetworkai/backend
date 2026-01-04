import { INestApplication } from '@nestjs/common';

export const corsSetup = (app: INestApplication) => {
  app.enableCors({
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Content-Type',
      'Authorization',
      'Content-Length',
      'Host',
      'Accept',
      'Accept-Encoding',
      'Connection',
      'User-Agent',
      'x-recaptcha-token',
    ],
    exposedHeaders: ['Set-cookie'],

    origin: ['*'],
    credentials: true,
  });
};
