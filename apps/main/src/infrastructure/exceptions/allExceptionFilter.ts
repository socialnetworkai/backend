import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '@app/shared/common/logger/logger.service';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const url = request.url;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Internal server error';

    if (exception instanceof Error) {
      errorMessage = exception.message;
      this.logger.error(
        '[HTTP]',
        `MESSAGE:${errorMessage} CODE:${status} PATH:${url}`,
      );
    } else if (
      exception &&
      typeof exception === 'object' &&
      'message' in exception
    ) {
      const exceptionWithMessage = exception as { message: unknown };
      errorMessage = String(exceptionWithMessage.message);
      this.logger.error(
        '[HTTP]',
        `MESSAGE:${errorMessage} CODE:${status} PATH:${url}`,
      );
    }

    response.status(status).json({
      errorsMessages: errorMessage,
      code: status,
      path: url,
      date: new Date(),
    });
  }
}
