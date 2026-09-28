import 'dotenv/config';
import config from './config';
import app from "./app";
import { bootstrap } from "./bootstrap";

async function start() {
  await bootstrap();
  app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
}

start().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
