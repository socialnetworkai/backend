import { INestApplication } from '@nestjs/common';

export const corsSetup = (app: INestApplication) => {
  app.enableCors({
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Content-Length',
      'x-recaptcha-token',
    ],
    exposedHeaders: ['Set-Cookie'],

    origin: ['http://localhost:3000', 'https://socialnetwork-ai.com'],
    credentials: true,
  });
};
