import sequelize from '../database';

export const bootstrap = async (): Promise<void> => {
  await sequelize.authenticate();
  console.log('Database connection established');
};