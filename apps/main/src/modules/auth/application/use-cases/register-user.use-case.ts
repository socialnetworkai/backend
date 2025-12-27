import { CreateUserInputDto } from '../../../users/api/input-dto/create-user-input.dto';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationSentEvent } from '../events/email-confirmation-sent.event';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { User } from '../../../users/domain/entity/user.entity';
import { DataSource, EntityManager } from 'typeorm';
import { AuthService } from '../../services/auth.service';

export class RegisterUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<
  RegisterUserCommand,
  string
> {
  constructor(
    private dataSource: DataSource,
    private authService: AuthService,
    private eventBus: EventBus,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<string> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const { userDto, sendEmailDto } =
        await this.authService.registration(dto);

      const savedUser: User = await this.usersRepository.saveUser(
        userDto,
        manager,
      );

      this.eventBus.publish(new EmailConfirmationSentEvent(sendEmailDto));

      return savedUser.id;
    });
  }
}
