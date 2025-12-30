import { Injectable } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { UserService } from '../../users/services/user.service';
import { SendEmailDto } from '../../../infrastructure/mail-module/sendEmail.dto';
import { CodeDto } from '../api/input-dto/code.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async registration(
    dto: CreateUserInputDto,
  ): Promise<{ sendEmailDto: SendEmailDto }> {
    return await this.userService.createUser(dto);
  }

  async confirmation(code: string): Promise<void> {
    await this.userService.confirmation(code);
  }

  async resendingEmailRegister(email: string): Promise<SendEmailDto> {
    return await this.userService.resendingEmailRegister(email);
  }

  async recoveryPassword(email: string): Promise<SendEmailDto> {
    return await this.userService.recoveryPassword(email);
  }

  async setNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    return await this.userService.setNewPassword(newPassword, recoveryCode);
  }
}
