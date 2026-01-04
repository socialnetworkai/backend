import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../domain/entity/user.entity';
import { UserConfirmation } from '../domain/entity/user-confirmation.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserConfirmation)
    private confirmRepository: Repository<UserConfirmation>,
  ) {}

  async saveUser(user: User, manager?: EntityManager): Promise<User> {
    if (manager) {
      return await manager.save(user);
    }
    return await this.usersRepository.save(user);
  }

  async findUserByLogin(login: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { login: login },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: ['confirmation'],
    });
  }

  async findUserByCode(code: string): Promise<UserConfirmation | null> {
    return await this.confirmRepository.findOne({
      where: { confirmationCode: code },
    });
  }

  async saveUserConfirmation(userConfirmation: UserConfirmation) {
    return await this.confirmRepository.save(userConfirmation);
  }

  async findUserByPasswordRecoveryCode(code: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        confirmation: {
          passwordRecoveryCode: code,
        },
      },
      relations: ['confirmation'],
    });
  }
}
