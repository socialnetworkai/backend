import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entity/user.entity';
import { UserViewDto } from '../api/output-dto/user-view.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findUserByLogin(login: string): Promise<UserViewDto | null> {
    const user = await this.usersRepository.findOne({
      where: { login: login },
    });
    if (!user) return null;
    return User.userViewMapper(user);
  }

  async findUserByEmail(email: string): Promise<UserViewDto | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['confirmation'],
    });
    if (!user) return null;
    return User.userViewMapper(user);
  }
}
