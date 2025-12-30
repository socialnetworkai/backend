import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersRepository } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { UsersController } from './api/users.controller';
import { HashService } from '@app/shared/common/hash.service';
import { UserConfig } from './services/user.config';
import { UserConfirmation } from './domain/entity/user-confirmation.entity';

const providers = [
  UserService,
  CreateUserUseCase,
  UsersRepository,
  HashService,
  UserConfig,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, UserConfirmation])],
  controllers: [UsersController],
  providers: [...providers],
  exports: [UserService],
})
export class UsersModule {}
