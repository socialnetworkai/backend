import { randomUUID } from 'node:crypto';

export function generateUUIDCode(): string {
  return randomUUID();
}
