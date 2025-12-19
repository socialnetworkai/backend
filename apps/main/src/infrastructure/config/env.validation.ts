import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'testing',
  Provision = 'provision',
  DevelopmentHome = 'development.local',
  TestHome = 'testing.local',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  // @IsString()
  // DB_USERNAME: string;
  //
  // @IsString()
  // DB_HOST: string;
  //
  // @IsString()
  // DB_PORT: string;
  //
  // @IsString()
  // DB_PASSWORD: string;
  //
  // @IsBoolean()
  // DB_LOGGING: boolean;
  //
  // @IsString()
  // DB_NAME: string;

  // @IsString()
  // MAIL_MODULE_USER: string;
  //
  // @IsString()
  // MAIL_MODULE_PASSWORD: string;
  //
  // @IsString()
  // MAIL_MODULE_FROM: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
