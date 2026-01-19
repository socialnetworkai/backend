import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules-mo/ioredis';

@Module({})
export class IoRedisModule {
  static register(): DynamicModule {
    return {
      module: IoRedisModule,
      imports: [
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'single',
            url: configService.get<string>('REDIS_URL'),
            reconnectOnError: (error: Error) => {
              console.error('Redis encountered an error:', error.message);
              return true;
            },
            maxRetriesPerRequest: 20,
            options: {
              username: configService.get<string>('REDIS_USERNAME'),
              password: configService.get<string>('REDIS_PASSWORD'),
            },
          }),
        }),
      ],
    };
  }
}
