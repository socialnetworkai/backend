import {
  BadRequestDomainException,
  UnauthorizedDomainException,
} from '../../../infrastructure/exceptions/domainException';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import Redis, { ScanStream } from 'ioredis';
import { SessionDto, SessionViewDto } from '../api/input-dto/session.dto';
import { ErrorConstants } from '../../../infrastructure/exceptions/error-constants';
import { SignOutInputDto } from '../api/input-dto/signout.input.dto';

@Injectable()
export class RedisSession {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly authConfig: AuthConfig,
  ) {}

  async saveSession(
    userId: string,
    deviceId: string,
    lastSeen: string,
    ip: string,
    deviceName: string,
  ): Promise<void> {
    const expiresIn = this.authConfig.refreshTokenExpiresIn;
    const key = this.getKey(userId, deviceId);
    const session: SessionDto = { deviceId, lastSeen, name: deviceName, ip };

    try {
      const transaction = this.redisClient.multi();
      transaction.hset(key, session);
      transaction.expire(key, expiresIn);
      await transaction.exec();
    } catch (e) {
      throw UnauthorizedDomainException.create(
        ErrorConstants.SESSION_CREATE_ERROR,
        'saveSession',
      );
    }
  }

  async updateSession(userId: string, deviceId: string): Promise<void> {
    await this.validateDeviceId(userId, deviceId);

    const expiresIn = this.authConfig.refreshTokenExpiresIn;
    const key = this.getKey(userId, deviceId);

    await this.redisClient.expire(key, expiresIn);
  }

  private async validateDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const key = this.getKey(userId, deviceId);

    const storedDeviceId = await this.redisClient.hget(key, 'deviceId');
    const isTokenValid = deviceId === storedDeviceId;

    if (!isTokenValid)
      throw BadRequestDomainException.create(
        ErrorConstants.REFRESH_TOKEN_SESSION_MISMATCH,
        'validateDeviceId',
      );

    return true;
  }

  async deleteSession(signOutInputDto: SignOutInputDto): Promise<void> {
    const { userId, deviceId, deleteAll } = signOutInputDto;

    const pattern = `u_ses:${userId}:dev:*`;
    const sessions = await this.getAllUserSessionsByPattern(pattern);

    const sessionToDelete: SessionDto[] = <SessionDto[]>sessions
      .map((session) => {
        if (
          deleteAll
            ? session.deviceId !== deviceId
            : session.deviceId === deviceId
        ) {
          return session;
        }
      })
      .filter((session) => session);

    if (sessionToDelete !== undefined && !sessionToDelete.length)
      throw BadRequestDomainException.create(
        ErrorConstants.SESSION_NOT_FOUND,
        'deleteSession',
      );

    const keysToDelete = sessionToDelete.map((session) =>
      this.getKey(userId, session.deviceId as string),
    );

    const result = await this.redisClient.del(...keysToDelete);

    if (result < 1)
      throw BadRequestDomainException.create(
        ErrorConstants.SESSION_DELETE_ERROR,
        'deleteSession',
      );
  }

  async getAllUserSessions(userId: string): Promise<SessionViewDto[]> {
    const pattern = `u_ses:${userId}:dev:*`;

    const allUserSessions: SessionDto[] =
      await this.getAllUserSessionsByPattern(pattern);

    if (!allUserSessions.length)
      throw UnauthorizedDomainException.create(
        ErrorConstants.UNAUTHORIZED,
        'getAllUserSessions',
      );

    let sessionViews: SessionViewDto[] = [];

    for await (const session of allUserSessions) {
      delete session.deviceId;
      sessionViews.push(session);
    }

    return sessionViews;
  }

  private getKey(userId: string, deviceId: string): string {
    return `u_ses:${userId}:dev:${deviceId}`;
  }

  private async getAllUserSessionsByPattern(
    pattern: string,
  ): Promise<SessionDto[]> {
    const keys = [];
    const stream: ScanStream = this.redisClient.scanStream({
      match: pattern,
      type: 'hash',
      count: 3,
    });

    stream.on('data', (resultKeys) => {
      for (const key of resultKeys) {
        // @ts-ignore
        keys.push(key);
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('end', async () => {
        const hashes = [];
        const pipeline = this.redisClient.pipeline();
        for (const key of keys) {
          pipeline.hgetall(key);
        }

        try {
          const results = await pipeline.exec();

          for (let i = 0; i < keys.length; i++) {
            // @ts-ignore
            hashes.push(results[i][1]);
          }
          resolve(hashes);
        } catch (err) {
          reject(err);
        }
      });

      stream.on('e', (e) => reject(e));
    });
  }
}
