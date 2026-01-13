import {
  ApiCreateUser,
  ApiDeleteUser,
} from './decorators/user.swagger.decorators';
import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { CreateUserInputDto } from './input-dto/create-user-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { Public } from '../../auth/api/decorators/public.decorator';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';

@Controller('users')
export class UsersController {
  constructor(protected commandBus: CommandBus) {}

  @Post()
  @ApiCreateUser()
  @Public()
  async createUser(@Body() body: CreateUserInputDto) {
    return await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(body),
    );
  }

  @Delete(':id')
  @ApiDeleteUser()
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
