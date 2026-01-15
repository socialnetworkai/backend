import { INestApplication } from '@nestjs/common';

export const corsSetup = (app: INestApplication) => {
  app.enableCors({
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Content-Length',
      'x-recaptcha-token',
    ],
    exposedHeaders: ['Set-cookie'],

    origin: ['http://localhost:3000', 'https://api.socialnetwork-ai.com'],
    credentials: true,
  });
};
