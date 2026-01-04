import { ApiProperty } from '@nestjs/swagger';

export class SignInViewDto {
  @ApiProperty()
  accessToken: string;
}
