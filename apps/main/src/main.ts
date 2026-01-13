import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pipesSetup } from './infrastructure/pipe/pipes.setup';
import { AllHttpExceptionsFilter } from './infrastructure/exceptions/allExceptionFilter';
import { DomainHttpExceptionFilter } from './infrastructure/exceptions/domainExceptionFilter';
import { swaggerSetup } from './infrastructure/common/swagger.setup';
import { LoggerService } from '@app/shared/common/logger/logger.service';
import { corsSetup } from './infrastructure/config/cors.setup';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');

  pipesSetup(app);
  // corsSetup(app);
  console.log(1);
  // swaggerSetup(app);
  console.log(2);

  const logger = await app.resolve(LoggerService);

  console.log(3);
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(logger),
    new DomainHttpExceptionFilter(logger),
  );

  console.log(4);

  app.use(cookieParser());

  console.log(5);

  logger.log('MAIN', `main application started on port ${process.env.PORT}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
