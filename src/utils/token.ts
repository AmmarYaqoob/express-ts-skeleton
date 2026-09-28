import crypto from 'crypto';

const TOKEN_BYTES = 32;

export function createRawToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString('hex');
}

export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function tokenMatches(storedHex: string, raw: string): boolean {
  if (!storedHex || !raw) {
    return false;
  }

  const actual = Buffer.from(hashToken(raw), 'hex');
  const expected = Buffer.from(storedHex, 'hex');

  if (actual.length === 0 || actual.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(actual, expected);
}
