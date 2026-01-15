import { INestApplication } from '@nestjs/common';

export const corsSetup = (app: INestApplication) => {
  app.enableCors({
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Content-Length',
      'x-recaptcha-token',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
    ],
    exposedHeaders: ['Set-cookie'],

    origin: ['http://localhost:3000', 'https://socialnetwork-ai.com'],
    credentials: true,
  });
};
