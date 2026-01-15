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
  swaggerSetup(app);

  const logger = await app.resolve(LoggerService);

  app.useGlobalFilters(
    new AllHttpExceptionsFilter(logger),
    new DomainHttpExceptionFilter(logger),
  );

  app.use(cookieParser());

  logger.log('MAIN', `main application started on port ${process.env.PORT}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
