const app = require('./app');
const { port, nodeEnv } = require('./config/env');

app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`   Environment: ${nodeEnv}`);
});
