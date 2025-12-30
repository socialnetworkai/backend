import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { passwordConstraints } from '../../../users/domain/constraints/constraints';
import { IsStringOfLengthWithTrim } from '../decorators/is-string-of-length-with-trim';

export class NewPasswordInputDto {
  @ApiProperty({ type: String })
  @Matches(passwordConstraints.match, {
    message:
      'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
  })
  @IsStringOfLengthWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
