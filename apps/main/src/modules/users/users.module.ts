import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersRepository } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { UsersController } from './api/users.controller';
import { HashService } from '@app/shared/common/encrypt/hash.service';
import { UserConfig } from './services/user.config';
import { UserConfirmation } from './domain/entity/user-confirmation.entity';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

const providers = [
  UserService,
  CreateUserUseCase,
  DeleteUserUseCase,
  UsersRepository,
  UsersQueryRepository,
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
