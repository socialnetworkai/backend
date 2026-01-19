import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerService } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    LoggerService,
  ],
  exports: [AsyncLocalStorage, LoggerService],
})
export class LoggerModule {}
