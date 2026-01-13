import { INestApplication } from '@nestjs/common';

export const corsSetup = (app: INestApplication) => {
  app.enableCors({
    origin: ['http://localhost:3000', 'https://socialnetwork-ai.com'],
    credentials: true,
  });
};
