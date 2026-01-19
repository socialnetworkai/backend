import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInInputDto {
  @ApiProperty({
    example: 'example@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
