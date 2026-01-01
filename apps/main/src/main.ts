import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pipesSetup } from './infrastructure/pipe/pipes.setup';
import { AllHttpExceptionsFilter } from './infrastructure/exceptions/allExceptionFilter';
import { DomainHttpExceptionFilter } from './infrastructure/exceptions/domainExceptionFilter';
import { swaggerSetup } from './infrastructure/common/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  pipesSetup(app);
  swaggerSetup(app);
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(),
    new DomainHttpExceptionFilter(),
  );
  console.log(`main application started on port ${process.env.PORT}`);
  await app.listen(process.env.PORT!);
}
bootstrap();
