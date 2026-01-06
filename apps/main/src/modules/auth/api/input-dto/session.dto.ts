import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SessionDto {
  @ApiPropertyOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty()
  @IsString()
  lastSeen: string;

  @ApiProperty({ description: 'device name' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  ip: string;
}

export class SessionViewDto extends OmitType(SessionDto, ['deviceId']) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  current?: boolean;
}
