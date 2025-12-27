import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';

@Injectable()
export class CryptoService {
  async createPasswordHash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  createPasswordRecoveryCodeHash(recoveryCode: string): string {
    return createHash('sha256').update(recoveryCode).digest('hex');
  }
}
