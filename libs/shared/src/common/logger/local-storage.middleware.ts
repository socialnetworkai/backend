import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { generateUUIDCode } from '../../../../../apps/main/src/infrastructure/common/generateUUID';

export interface TraceStore {
  traceId: string;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly alsService: AsyncLocalStorage<any>) {}

  use(req: Request, res: Response, next: (error?: any) => void) {
    const traceId = req.headers['traceId']
      ? req.headers['traceId']
      : this.genV4();
    const store = { traceId };

    this.alsService.run(store, () => {
      next();
    });
  }

  private genV4(): string {
    let traceId = generateUUIDCode();
    return traceId.slice(traceId.lastIndexOf('-') + 1);
  }
}
