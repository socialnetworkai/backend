import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envFilePaths } from './infrastructure/config/env-file-paths';
import { validate } from './infrastructure/config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePaths,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
        migrationsTableName: 'typeorm_migrations',
        migrationsRun: process.env.NODE_ENV === 'production',
        // Настройки SSL для Neon
        ssl: configService.get('DB_SSL', true)
          ? {
              rejectUnauthorized: false, // Важно для Neon!
            }
          : false,
        // Дополнительные настройки
        synchronize: process.env.NODE_ENV !== 'production', // false для продакшена!
        logging: process.env.NODE_ENV !== 'production',
        extra: {
          connectionLimit: 10,
          // Поддержка serverless (важно для Neon)
          sslmode: 'require',
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
