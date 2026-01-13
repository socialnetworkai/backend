import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { envFilePaths } from './infrastructure/config/env-file-paths';
import { validate } from './infrastructure/config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './modules/auth/auth.module';
import { AllDeleteModule } from './modules/testing-all-delete/all-delete.module';
import { LoggerModule } from '@app/shared/common/logger/localStorage.module';
import { LoggerMiddleware } from '@app/shared/common/logger/local-storage.middleware';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: envFilePaths,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validate,
      isGlobal: true,
    }),
    CqrsModule,
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
        ssl: configService.get('DB_SSL')
          ? {
              rejectUnauthorized: false, // Важно для Neon!
            }
          : false,
        // Дополнительные настройки
        synchronize: process.env.NODE_ENV !== 'production', // false для продакшена!
        logging: false,
        extra: {
          connectionLimit: 10,
          // Поддержка serverless (важно для Neon)
          sslmode: 'require',
        },
      }),
    }),
    AuthModule,
    // AllDeleteModule,
  ],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: '*path', method: RequestMethod.ALL });
  // }
}
