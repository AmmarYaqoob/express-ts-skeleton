import crypto from 'crypto';
import config from '../config';

const algorithm = 'aes-256-cbc';

function getKeyAndIv() {
  const key = crypto.createHash('sha256').update(config.secret_key).digest();
  const iv = crypto
    .createHash('sha256')
    .update(`${config.secret_key}:iv`)
    .digest()
    .subarray(0, 16);

  return { key, iv };
}

export const encrypt = (text: string): string => {
  const { key, iv } = getKeyAndIv();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const { key, iv } = getKeyAndIv();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const hash = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
