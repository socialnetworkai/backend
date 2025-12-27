import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { AuthConfig } from './auth.config';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { User } from '../../users/domain/entity/user.entity';
import { generateConfirmationCode } from '../../../infrastructure/common/generateUUID';
import { addSeconds } from 'date-fns/addSeconds';
import { SendEmailDto } from '../../../infrastructure/mail-module/sendEmail.dto';
import { BadRequestDomainException } from '../../../infrastructure/exceptions/domainException';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class AuthService {
  constructor(
    protected cryptoService: CryptoService,
    protected userRepository: UsersRepository,
    private readonly authConfig: AuthConfig,
  ) {}

  async registration(dto: CreateUserInputDto) {
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

    const hash: string | null = dto.password
      ? await this.cryptoService.createPasswordHash(dto.password)
      : null;

    const userDto: User = User.createIsNotConfirmedUser(
      dto.login,
      dto.email,
      hash,
      generateConfirmationCode(),
      addSeconds(new Date(), this.authConfig.codeLifetimeInSecs),
    );

    const sendEmailDto: SendEmailDto = {
      login: dto.login,
      email: dto.email,
      code: userDto.confirmation.confirmationCode!,
    };

    return { userDto, sendEmailDto };
  }
}
