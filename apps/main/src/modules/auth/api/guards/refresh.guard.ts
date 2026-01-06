import {
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../../infrastructure/exceptions/domainException';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ErrorConstants } from '../../../../infrastructure/exceptions/error-constants';
import { TokensService } from '../../services/token.service';
import { UserService } from '../../../users/services/user.service';

@Injectable()
export class RefreshGuard {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.refreshToken;

    if (!token) {
      throw UnauthorizedDomainException.create(
        ErrorConstants.NO_REFRESH_COOKIE,
        'RefreshGuard',
      );
    }

    const jwtPayload = await this.tokensService.verifyJwtToken(token);

    if (!jwtPayload) {
      throw UnauthorizedDomainException.create(
        ErrorConstants.REFRESH_TOKEN_EXPIRED,
        'RefreshGuard',
      );
    }

    const { sub, deviceId, deviceName } = jwtPayload;

    const user = await this.usersService.findUserByIdView(sub);

    if (!user) {
      throw NotFoundDomainException.create(
        ErrorConstants.USER_NOT_FOUND,
        'TokensService/refreshToken',
      );
    }

    request.refreshPayload = { sub, deviceId, deviceName };

    return true;
  }
}
