import { Injectable } from '@nestjs/common';
import { User } from '../domain/entity/user.entity';
import { BadRequestDomainException } from '../../../infrastructure/exceptions/domainException';
import { CreateUserInputDto } from '../api/input-dto/create-user-input.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { HashService } from '@app/shared/common/encrypt/hash.service';
import { UserConfig } from './user.config';
import { generateUUIDCode } from '../../../infrastructure/common/generateUUID';
import { addSeconds } from 'date-fns/addSeconds';
import { SendEmailDto } from '../../../infrastructure/mail-module/sendEmail.dto';
import { DataSource } from 'typeorm';
import { ErrorConstants } from '../../../infrastructure/exceptions/error-constants';
import { UserConfirmation } from '../domain/entity/user-confirmation.entity';

@Injectable()
export class UserService {
  constructor(
    protected userRepository: UsersRepository,
    private hashService: HashService,
    private userConfig: UserConfig,
    private dataSource: DataSource,
  ) {}

  async createConfirmedUser(dto: CreateUserInputDto): Promise<User> {
    await this.validateLoginNotTaken(dto.login);
    await this.validateEmailNotTaken(dto.email);
    const userDto: User = User.createConfirmedUser(dto);
    return await this.userRepository.saveUser(userDto);
  }

  async createUser(
    dto: CreateUserInputDto,
  ): Promise<{ sendEmailDto: SendEmailDto }> {
    return await this.dataSource.transaction(async (manager) => {
      await this.validateLoginNotTaken(dto.login);
      await this.validateEmailNotTaken(dto.email);

      const hash: string | null = dto.password
        ? await this.hashService.generateHash(dto.password, 10)
        : null;

      const userDto: User = User.createIsNotConfirmedUser(
        dto.login,
        dto.email,
        hash,
        generateUUIDCode(),
        addSeconds(new Date(), this.userConfig.codeLifetimeInSecs),
      );

      await this.userRepository.saveUser(userDto, manager);

      const sendEmailDto: SendEmailDto = {
        login: dto.login,
        email: dto.email,
        code: userDto.confirmation.confirmationCode!,
      };

      return { sendEmailDto };
    });
  }

  async confirmation(code: string): Promise<void> {
    const userConfirmation: UserConfirmation | null =
      await this.userRepository.findUserByCode(code);

    if (!userConfirmation) {
      throw BadRequestDomainException.create(
        ErrorConstants.CONFIRMATION_CODE_INVALID,
        'ConfirmationUseCase',
      );
    }
    if (userConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        ErrorConstants.USER_ALREADY_CONFIRMED_CODE,
        'ConfirmationUseCase',
      );
    }

    if (
      !userConfirmation.expirationDate ||
      userConfirmation.expirationDate < new Date()
    ) {
      throw BadRequestDomainException.create(
        ErrorConstants.CONFIRMATION_LINK_EXPIRED,
        'ConfirmationUseCase',
      );
    }

    userConfirmation.confirm();

    await this.userRepository.saveUserConfirmation(userConfirmation);
  }

  async resendingEmailRegister(email: string): Promise<SendEmailDto> {
    const user: User | null = await this.userRepository.findUserByEmail(email);
    if (!user)
      throw BadRequestDomainException.create(
        ErrorConstants.USER_WITH_EMAIL_NOT_EXIST,
        'RegistrationEmailResendingUseCase',
      );

    if (user.confirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        ErrorConstants.USER_ALREADY_CONFIRMED,
        'RegistrationEmailResendingUseCase',
      );
    }

    user.confirmation.confirmationCode = generateUUIDCode();
    user.confirmation.expirationDate = addSeconds(
      new Date(),
      this.userConfig.codeLifetimeInSecs,
    );

    const savedUserConfirm: UserConfirmation =
      await this.userRepository.saveUserConfirmation(user.confirmation);

    const sendEmailDto: SendEmailDto = {
      login: user.login,
      email: user.email,
      code: savedUserConfirm.confirmationCode!,
    };

    return sendEmailDto;
  }

  async recoveryPassword(email: string): Promise<SendEmailDto> {
    const user: User | null = await this.userRepository.findUserByEmail(email);
    if (!user)
      throw BadRequestDomainException.create(
        ErrorConstants.USER_WITH_EMAIL_NOT_EXIST,
        'RecoverPasswordUseCase',
      );

    user.confirmation.passwordRecoveryCode = generateUUIDCode();
    user.confirmation.expirationDate = addSeconds(
      new Date(),
      this.userConfig.codeLifetimeInSecs,
    );

    const savedConfirm: UserConfirmation =
      await this.userRepository.saveUserConfirmation(user.confirmation);

    const sendEmailDto: SendEmailDto = {
      login: user.login,
      email: user.email,
      code: savedConfirm.passwordRecoveryCode!,
    };

    return sendEmailDto;
  }

  async setNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const userWithRecovery: User | null =
      await this.userRepository.findUserByPasswordRecoveryCode(recoveryCode);

    if (!userWithRecovery)
      throw BadRequestDomainException.create(
        ErrorConstants.RECOVERY_CODE_INCORRECT,
        'SetNewPasswordUseCase',
      );

    if (new Date() > userWithRecovery.confirmation.expirationDate!)
      throw BadRequestDomainException.create(
        ErrorConstants.RECOVERY_CODE_EXPIRED,
        'SetNewPasswordUseCase',
      );

    userWithRecovery.hashPassword = await this.hashService.generateHash(
      newPassword,
      10,
    );

    await this.userRepository.saveUser(userWithRecovery);

    userWithRecovery.confirmation.passwordRecoveryCode = null;
    userWithRecovery.confirmation.expirationDate = null;

    await this.userRepository.saveUserConfirmation(
      userWithRecovery.confirmation,
    );
  }

  private async validateLoginNotTaken(login: string): Promise<void> {
    const foundUserByLogin: User | null =
      await this.userRepository.findUserByLogin(login);

    if (foundUserByLogin) {
      throw BadRequestDomainException.create(
        'user with this login already exists',
        'login',
      );
    }
  }

  private async validateEmailNotTaken(email: string): Promise<void> {
    const foundUserByLogin: User | null =
      await this.userRepository.findUserByEmail(email);

    if (foundUserByLogin) {
      throw BadRequestDomainException.create(
        'user with this email already exists',
        'email',
      );
    }
  }
}
