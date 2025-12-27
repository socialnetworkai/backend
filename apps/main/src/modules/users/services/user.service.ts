import { Injectable } from '@nestjs/common';
import { User } from '../domain/entity/user.entity';
import { BadRequestDomainException } from '../../../infrastructure/exceptions/domainException';
import { CreateUserInputDto } from '../api/input-dto/create-user-input.dto';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UserService {
  constructor(protected userRepository: UsersRepository) {}

  async createUser(dto: CreateUserInputDto) {
    const foundUserByLogin: User | null =
      await this.userRepository.findUserByLogin(dto.login);
    if (foundUserByLogin) {
      throw BadRequestDomainException.create(
        'user with this login already exists',
        'login',
      );
    }

    const foundUserByEmail: User | null =
      await this.userRepository.findUserByEmail(dto.email);
    if (foundUserByEmail) {
      throw BadRequestDomainException.create(
        'user with this email already exists',
        'email',
      );
    }

    return User.createConfirmedUser(dto);
  }
}
