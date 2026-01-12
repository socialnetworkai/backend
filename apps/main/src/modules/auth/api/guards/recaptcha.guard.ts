import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenDomainException } from '../../../../infrastructure/exceptions/domainException';
import { ErrorConstants } from '../../../../infrastructure/exceptions/error-constants';
import { RecaptchaService } from '../../services/recaptcha.service';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private recaptchaService: RecaptchaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.body.recaptchaToken;
    if (!token) {
      throw ForbiddenDomainException.create(
        ErrorConstants.RECAPTCHA_TOKEN_REQUIRED,
        'RecaptchaGuard',
      );
    }
    const isValid = await this.recaptchaService.verifyToken(token);
    if (!isValid) {
      throw ForbiddenDomainException.create(
        ErrorConstants.RECAPTCHA_VERIFICATION_FAILED,
        'RecaptchaGuard',
      );
    }

    return true;
  }
}
