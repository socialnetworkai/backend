import { ApiProperty } from '@nestjs/swagger';

export class UserViewDto {
  @ApiProperty({
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'Login',
  })
  login: string;

  @ApiProperty({
    example: 'user@mail.com',
  })
  email: string;
}
