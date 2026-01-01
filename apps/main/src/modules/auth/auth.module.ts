import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UsersModule } from '../users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import {
  EmailConfirmationSentEvent,
  EmailConfirmationSentHandler,
} from './application/events/email-confirmation-sent.event';
import { AuthService } from './services/auth.service';
import { MailModule } from '../../infrastructure/mail-module/mail.module';
import { HashService } from '@app/shared/common/encrypt/hash.service';
import { ConfirmationUseCase } from './application/use-cases/confirmation.use-case';
import { RegistrationEmailResendingUseCase } from './application/use-cases/emai-resending-register.use-case';
import { EmailRecoveryPasswordSentHandler } from './application/events/email-recovery-password-sent.event';
import { RecoverPasswordUseCase } from './application/use-cases/password-recovery.use-case';
import { SetNewPasswordUseCase } from './application/use-cases/set-new-password.use-case';

const providers = [
  RegisterUserUseCase,
  EmailConfirmationSentHandler,
  AuthService,
  EmailConfirmationSentEvent,
  HashService,
  ConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  EmailRecoveryPasswordSentHandler,
  RecoverPasswordUseCase,
  SetNewPasswordUseCase,
];

@Module({
  imports: [UsersModule, CqrsModule, MailModule],
  controllers: [AuthController],
  providers: [...providers],
})
export class AuthModule {}
