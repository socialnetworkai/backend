import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import Redis from 'ioredis';

@Injectable()
export class RedisSession {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly authConfig: AuthConfig,
  ) {}

  async saveRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<void> {
    const expiresIn = this.authConfig.refreshTokenExpiresIn;
    const key = this.getKey(userId, deviceId);

    await this.redisClient.set(key, refreshToken, 'EX', expiresIn);
  }

  async validateRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const key = this.getKey(userId, deviceId);
    const storedRefreshToken = await this.redisClient.get(key);
    const isTokenValid = refreshToken === storedRefreshToken;

    if (!isTokenValid) throw new Error();

    return true;
  }

  private async getAllUserSessionsKeys(userId: string) {
    const pattern = `users:${userId}:device:*`;
    return await this.redisClient.keys(pattern);
  }

  async deleteSession(userId: string, userAgent: string) {
    const pattern = `users:${userId}:device:*_${userAgent}`;
    const key = await this.redisClient.keys(pattern);
    await this.deleteRefreshToken(key[0]);
  }

  async getAllUserSessionsNames(userId: string): Promise<string[]> {
    const keys = await this.getAllUserSessionsKeys(userId);
    return this.getUserAgentsFromKeys(keys);
  }

  async getRefreshToken(
    userId: string,
    deviceId: string,
  ): Promise<string | null> {
    const key = this.getKey(userId, deviceId);
    return await this.redisClient.get(key);
  }

  private async deleteRefreshToken(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  private getKey(userId: string, deviceId: string): string {
    return `users:${userId}:device:${deviceId}`;
  }

  private getUserAgentsFromKeys(keys: string[]): string[] {
    return keys.map((key) => key.slice(key.lastIndexOf('_') + 1));
  }
}
