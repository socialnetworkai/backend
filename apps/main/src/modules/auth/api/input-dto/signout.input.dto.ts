import { IsBoolean, IsString } from 'class-validator';

export class SignOutInputDto {
  @IsString()
  userId: string;

  @IsString()
  deviceId: string;

  @IsBoolean()
  deleteAll: boolean;
}
