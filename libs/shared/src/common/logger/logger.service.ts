import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerMiddleware } from './local-storage.middleware';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(private readonly als: AsyncLocalStorage<any>) {
    super();
  }

  log(tag: string, message: string): void {
    const traceId = this.getTraceId();
    super.log(`${tag} [${traceId}] ${message}`);
  }

  error(tag: string, message: unknown): void {
    const traceId = this.getTraceId();
    super.error(`${tag} [${traceId}] ${message}`);
  }

  private getTraceId(): string {
    const store = this.als.getStore() as LoggerMiddleware;
    return store?.['traceId'] ? store['traceId'] : 'NO-TRACE';
  }
}
