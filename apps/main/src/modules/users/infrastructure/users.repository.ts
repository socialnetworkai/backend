import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../domain/entity/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async saveUser(user: User, manager?: EntityManager) {
    if (manager) {
      return await manager.save(user);
    }
    return await this.usersRepository.save(user);
  }

  async findUserByLogin(login: string) {
    return await this.usersRepository.findOne({
      where: { login: login },
    });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }
}
