const app = require('./app');
const { port, nodeEnv } = require('./config/env');
const { runStartupMigrations } = require('./db/ensureSchema');
const logger = require('./utils/logger');

async function start() {
  await runStartupMigrations();

  app.listen(port, () => {
    logger.info(`API running on port ${port} (${nodeEnv})`);
  });
}

start().catch((err) => {
  logger.error('Failed to start API', { message: err.message });
  process.exit(1);
});
