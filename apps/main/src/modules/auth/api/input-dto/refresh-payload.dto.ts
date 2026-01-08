import { IsString, IsUUID } from 'class-validator';

export class RefreshPayloadDto {
  @IsUUID()
  sub: string;

  @IsString()
  deviceId: string;

  @IsString()
  deviceName: string;
}
