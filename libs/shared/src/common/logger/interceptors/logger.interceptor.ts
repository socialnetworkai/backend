import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TraceStore } from '../local-storage.middleware';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  constructor(private readonly als: AsyncLocalStorage<any>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const tag = `${context.getClass().name} ${context.getHandler().name} handler`;

    const store = this.als.getStore() as TraceStore;
    const traceId = store?.traceId || 'NO-TRACE';

    const req = context.switchToHttp().getRequest();
    const { url } = req;
    const startTime = Date.now();

    this.logger.log(`[${traceId}]  Req: ${tag} ${url} `);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;

        this.logger.log(`[${traceId}] Res: ${tag} ${url} ${duration}ms `);
      }),
    );
  }
}
