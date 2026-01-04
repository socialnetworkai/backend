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
import { RegistrationEmailResendingUseCase } from './application/use-cases/email-resending-register.use-case';
import { EmailRecoveryPasswordSentHandler } from './application/events/email-recovery-password-sent.event';
import { RecoverPasswordUseCase } from './application/use-cases/password-recovery.use-case';
import { SetNewPasswordUseCase } from './application/use-cases/set-new-password.use-case';
import { IoRedisModule } from '@app/shared/common/redis/redis.module';
import { AuthConfig } from './services/auth.config';
import { RedisSession } from './services/redis-session.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokensService } from './services/token.service';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';

const providers = [
  RegisterUserUseCase,
  SignInUseCase,
  EmailConfirmationSentHandler,
  AuthService,
  EmailConfirmationSentEvent,
  HashService,
  ConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  EmailRecoveryPasswordSentHandler,
  RecoverPasswordUseCase,
  SetNewPasswordUseCase,
  RedisSession,
  AuthConfig,
  TokensService,
];

@Module({
  imports: [
    UsersModule,
    CqrsModule,
    MailModule,
    IoRedisModule.register(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [...providers],
})
export class AuthModule {}
