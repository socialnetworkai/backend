import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('registration')
  async registration(@Body() body: CreateUserInputDto) {
    return await this.commandBus.execute<RegisterUserCommand, string>(
      new RegisterUserCommand(body),
    );
  }
}
