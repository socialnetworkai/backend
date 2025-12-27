import { CreateUserInputDto } from '../../api/input-dto/create-user-input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entity/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserService } from '../../services/user.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<
  CreateUserCommand,
  string
> {
  constructor(
    private userRepository: UsersRepository,
    private userService: UserService,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    const userDto: User = await this.userService.createUser(dto);

    const savedUser: User = await this.userRepository.saveUser(userDto);

    return savedUser.id;
  }
}
