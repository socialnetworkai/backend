import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokensService } from '../../services/token.service';
import { UnauthorizedDomainException } from '../../../../infrastructure/exceptions/domainException';
import { ErrorConstants } from '../../../../infrastructure/exceptions/error-constants';
import { UserService } from '../../../users/services/user.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../decorators/public.decorator';

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

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')?.pop();

    if (!token) this.throwUnauthorizedDomainException();

    const payload = await this.tokensService.verifyJwtToken(token);

    if (!payload || !payload.sub) {
      this.throwUnauthorizedDomainException();
    }

    const user = await this.usersService.findUserByIdView(payload.sub);

    if (!user) {
      this.throwUnauthorizedDomainException();
    }

    request.user = user;

    return true;
  }

  private throwUnauthorizedDomainException() {
    throw UnauthorizedDomainException.create(
      ErrorConstants.UNAUTHORIZED,
      'AuthGuard',
    );
  }
}
