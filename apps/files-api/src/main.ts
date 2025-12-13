import { NestFactory } from '@nestjs/core';
import { FilesApiModule } from './files-api.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesApiModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
