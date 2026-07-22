import dotenv from 'dotenv';

dotenv.config();

export default {
  baseURL: '',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  url: 'http://localhost:4200',
  secret_key: 'secret__sha__key'
};