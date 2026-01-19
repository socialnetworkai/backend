import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException, DomainExceptionCode } from './domainException';
import { LoggerService } from '@app/shared/common/logger/logger.service';
import { Request, Response } from 'express';

@Catch(DomainException)
export class DomainHttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const url = request.url;
    const status = this.getStatus(exception);
    const responseBody = this.getResponseBody(exception, url);

    responseBody.exceptions.map((exception) =>
      this.logger.error(
        '[DOMAIN]',
        `FIELD:${exception.field} MESSAGE:${exception.message} PATH:${responseBody.path}`,
      ),
    );

    response.status(status).json(responseBody);
  }

  getStatus(exception: DomainException): number {
    switch (exception.code) {
      case DomainExceptionCode.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  getResponseBody(exception: DomainException, path: string) {
    return { exceptions: exception.extensions, path, date: new Date() };
  }
}
