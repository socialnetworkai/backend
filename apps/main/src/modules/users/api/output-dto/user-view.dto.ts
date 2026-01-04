import { ApiProperty } from '@nestjs/swagger';

export class UserViewDto {
  @ApiProperty({
    example: 'Login',
  })
  login: string;

  @ApiProperty({
    example: 'user@mail.com',
  })
  email: string;
}
