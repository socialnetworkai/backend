import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersRepository } from './infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { UsersController } from './api/users.controller';

const providers = [UserService, CreateUserUseCase, UsersRepository];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [...providers],
  exports: [UserService, UsersRepository],
})
export class UsersModule {}
