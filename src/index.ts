import 'dotenv/config';
import app from './app';
import config from './config';
import { bootstrap } from './bootstrap';

async function start() {
  await bootstrap();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

start();