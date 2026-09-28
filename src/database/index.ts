import { Sequelize } from 'sequelize-typescript';
import config from '../config';
import { Hashing } from './entities/hashing.model';
import { Role } from './entities/roles.model';
import { User } from './entities/users.model';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  models: [User, Role, Hashing],
  logging: false,
});

export default sequelize;
