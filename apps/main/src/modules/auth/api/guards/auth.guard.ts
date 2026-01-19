import { UnauthorizedDomainException } from '../../../../infrastructure/exceptions/domainException';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokensService } from '../../services/token.service';
import { ErrorConstants } from '../../../../infrastructure/exceptions/error-constants';
import { UserService } from '../../../users/services/user.service';
import { SKIP_AUTH_GUARD } from '../decorators/skip-auth.decorator';
import { IS_PUBLIC } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokensService: TokensService,

    private readonly usersService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    const skipAuth = this.reflector.getAllAndOverride(SKIP_AUTH_GUARD, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')?.pop();

    if (!token) this.throwUnauthorizedDomainException();

    const payload = await this.tokensService.verifyJwtToken(token);

    if (!payload || !payload.sub || !payload.deviceName) {
      this.throwUnauthorizedDomainException();
    }

    const user = await this.usersService.findUserByIdView(payload.sub);

    if (!user) {
      this.throwUnauthorizedDomainException();
    }

    request.user = user;

    request.deviceName = payload.deviceName;

    return true;
  }

  private throwUnauthorizedDomainException() {
    throw UnauthorizedDomainException.create(
      ErrorConstants.UNAUTHORIZED,
      'AuthGuard',
    );
  }
}
