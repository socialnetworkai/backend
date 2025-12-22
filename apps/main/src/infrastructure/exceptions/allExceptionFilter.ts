import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Internal server error';

    if (exception instanceof Error) {
      errorMessage = exception.message;
    } else if (
      exception &&
      typeof exception === 'object' &&
      'message' in exception
    ) {
      const exceptionWithMessage = exception as { message: unknown };
      errorMessage = String(exceptionWithMessage.message);
    }

    response.status(status).json({
      errorsMessages: errorMessage,
      code: status,
    });
  }
}
