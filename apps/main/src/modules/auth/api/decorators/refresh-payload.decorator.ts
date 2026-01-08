import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedDomainException } from '../../../../infrastructure/exceptions/domainException';
import { ErrorConstants } from '../../../../infrastructure/exceptions/error-constants';

export const RefreshPayload = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const refreshPayload = context.switchToHttp().getRequest()?.refreshPayload;

    if (!refreshPayload)
      throw UnauthorizedDomainException.create(
        ErrorConstants.REFRESH_TOKEN_INVALID,
        'RefreshPayload',
      );

    return refreshPayload;
  },
);
