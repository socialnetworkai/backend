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
import { AuthConfig } from './services/auth.config';
import { CryptoService } from './services/crypto.service';

@Module({
  imports: [UsersModule, CqrsModule, MailModule],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    EmailConfirmationSentHandler,
    AuthService,
    EmailConfirmationSentEvent,
    AuthConfig,
    CryptoService,
  ],
})
export class AuthModule {}
