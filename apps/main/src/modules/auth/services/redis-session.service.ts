import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AuthConfig } from './auth.config';

@Injectable()
export class RedisSession {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly authConfig: AuthConfig,
  ) {}

  async insert(
    userId: string,
    deviceId: string,
    expiresIn: number = <number>this.authConfig.expiresIn,
  ): Promise<void> {
    const key = this.getKey(userId, deviceId);

    await this.redisClient.set(key, 'TOKEN', () => expiresIn);
  }

  private getKey(userId: string, deviceId: string): string {
    //user:uuid:device:safari-15
    return `users:${userId}:device:${deviceId}`;
  }
}
