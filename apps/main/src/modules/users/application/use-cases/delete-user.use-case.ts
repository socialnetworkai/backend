import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../services/user.service';

export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersService: UserService) {}
  async execute({ id }: DeleteUserCommand): Promise<any> {
    return await this.usersService.deleteUser(id);
  }
}
