require('dotenv').config();

const shared = {
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || 'password',
  database: process.env.TYPEORM_DATABASE || 'express_ts_skeleton',
  host: process.env.TYPEORM_HOST || '127.0.0.1',
  port: Number(process.env.TYPEORM_PORT || 3306),
  dialect: 'mysql',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: { ...shared },
  local: { ...shared },
  test: {
    ...shared,
    database: process.env.TYPEORM_DATABASE_TEST || `${shared.database}_test`,
  },
  production: { ...shared },
};
