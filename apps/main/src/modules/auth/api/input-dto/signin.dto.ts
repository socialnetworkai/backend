import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIP, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'example@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @IsIP()
  ip: string;

  @IsString()
  lastSeen: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
