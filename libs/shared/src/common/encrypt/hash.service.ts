import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';

@Injectable()
export class HashService {
  async generateHash(input: string, saltRounds: number): Promise<string> {
    return await bcrypt.hash(input, saltRounds);
  }

  async compare(input: string, stringHash: string): Promise<boolean> {
    return await bcrypt.compare(input, stringHash);
  }

  createPasswordRecoveryCodeHash(recoveryCode: string): string {
    return createHash('sha256').update(recoveryCode).digest('hex');
  }
}
