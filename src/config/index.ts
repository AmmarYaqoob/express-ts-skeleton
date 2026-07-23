import dotenv from 'dotenv';

dotenv.config();

export default {
  baseURL: 'http://localhost:4200',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  secret_key: 'secret__sha__key'
};