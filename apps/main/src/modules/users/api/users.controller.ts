import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInputDto } from './input-dto/create-user-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { ApiCreateUser } from './decorators/user.swagger.decorators';

@Controller('users')
export class UsersController {
  constructor(protected commandBus: CommandBus) {}

  @Post()
  @ApiCreateUser()
  async createUser(@Body() body: CreateUserInputDto) {
    return await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(body),
    );
  }
}
