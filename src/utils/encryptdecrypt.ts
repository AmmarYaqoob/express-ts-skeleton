import crypto from 'crypto';
import config from '../config';

const algorithm = 'aes-256-gcm';
const REJECTED_KEYS = new Set(['', 'secret__sha__key']);

function getKey(): Buffer {
  if (REJECTED_KEYS.has(config.secret_key)) {
    throw new Error(
      'secret_key must be a long random value set in the environment',
    );
  }

  return crypto.createHash('sha256').update(config.secret_key).digest();
}

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    tag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
};

export const decrypt = (payload: string): string => {
  const [ivHex, tagHex, dataHex] = payload.split(':');

  if (!ivHex || !tagHex || !dataHex) {
    throw new Error('Invalid ciphertext');
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(),
    Buffer.from(ivHex, 'hex'),
  );
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
};

export const hash = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
