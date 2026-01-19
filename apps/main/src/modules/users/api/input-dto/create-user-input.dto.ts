import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../decorators/transform/trim';
import { passwordConstraints } from '../../domain/constraints/constraints';

export class CreateUserInputDto {
  @ApiProperty({
    description: 'must be unique login',
    example: 'Login',
    minLength: 6,
    maxLength: 30,
  })
  @Length(3, 15)
  @Trim()
  login: string;

  @ApiProperty({
    description: 'must be unique email',
    example: 'user@mail.com',
    maxLength: 255,
    pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
  })
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty({
    example: 'SP@ssw0rd344',
    minLength: passwordConstraints.minLength,
    maxLength: passwordConstraints.maxLength,
    pattern: String(passwordConstraints.match)
      .replace(/^\//, '')
      .replace(/\/$/, ''), // Преобразуем RegExp в строку
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(passwordConstraints.match, {
    message:
      'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
  })
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @Trim()
  password: string;
}
