import { ApiProperty } from '@nestjs/swagger';

export class RegisterViewDto {
  @ApiProperty()
  userId: string;
}
